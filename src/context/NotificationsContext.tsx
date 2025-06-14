import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: "pedido" | "reserva" | "saldo" | "promocion" | "general";
  fecha: Date;
  leida: boolean;
  icono: string;
  accion?: {
    tipo: "navegar" | "mostrar";
    destino?: string;
    datos?: any;
  };
}

interface NotificationsContextType {
  notificaciones: Notificacion[];
  notificacionesNoLeidas: number;
  sidebarVisible: boolean;
  mostrarSidebar: () => void;
  ocultarSidebar: () => void;
  toggleSidebar: () => void;
  marcarComoLeida: (id: string) => void;
  marcarTodasComoLeidas: () => void;
  agregarNotificacion: (notificacion: Omit<Notificacion, "id" | "fecha" | "leida">) => void;
  eliminarNotificacion: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Notificaciones de ejemplo para testing
  useEffect(() => {
    const notificacionesEjemplo: Notificacion[] = [
      {
        id: "1",
        titulo: "¡Pedido Confirmado! 🎉",
        mensaje: "Tu Menú Personalizado está siendo preparado. Listo para recoger en 20 min.",
        tipo: "pedido",
        fecha: new Date(),
        leida: false,
        icono: "restaurant",
        accion: {
          tipo: "navegar",
          destino: "Menu"
        }
      },
      {
        id: "2", 
        titulo: "Reserva Confirmada ✅",
        mensaje: "Tu reserva para 2 personas el 15 de junio a las 12:30 ha sido confirmada.",
        tipo: "reserva",
        fecha: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        leida: false,
        icono: "event",
        accion: {
          tipo: "navegar",
          destino: "Reservas"
        }
      },
      {
        id: "3",
        titulo: "Saldo Bajo ⚠️",
        mensaje: "Te quedan solo 3 menús disponibles. ¡Recarga tu saldo pronto!",
        tipo: "saldo", 
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        leida: true,
        icono: "account-balance-wallet",
        accion: {
          tipo: "mostrar"
        }
      },
      {
        id: "4",
        titulo: "¡Menú Especial! 🍲",
        mensaje: "Hoy tenemos Pique Macho especial con descuento para pensionados.",
        tipo: "promocion",
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        leida: true,
        icono: "local-offer",
        accion: {
          tipo: "navegar",
          destino: "Menu"
        }
      }
    ];
    
    setNotificaciones(notificacionesEjemplo);
  }, []);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const mostrarSidebar = () => setSidebarVisible(true);
  const ocultarSidebar = () => setSidebarVisible(false);
  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  const marcarComoLeida = (id: string) => {
    setNotificaciones(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones(prev =>
      prev.map(notif => ({ ...notif, leida: true }))
    );
  };

  const agregarNotificacion = (nuevaNotificacion: Omit<Notificacion, "id" | "fecha" | "leida">) => {
    const notificacion: Notificacion = {
      ...nuevaNotificacion,
      id: Date.now().toString(),
      fecha: new Date(),
      leida: false
    };
    
    setNotificaciones(prev => [notificacion, ...prev]);
  };

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  };

  const value = {
    notificaciones,
    notificacionesNoLeidas,
    sidebarVisible,
    mostrarSidebar,
    ocultarSidebar,
    toggleSidebar,
    marcarComoLeida,
    marcarTodasComoLeidas,
    agregarNotificacion,
    eliminarNotificacion
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
