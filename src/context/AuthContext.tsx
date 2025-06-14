import React, { createContext, useContext, useState, useEffect } from "react";

export interface UsuarioPensionado {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  tipoMembresía: "platos";
  saldoComidas: number;
  saldoPlatos: number; 
  activo: boolean;
}

interface AuthContextType {
  usuario: UsuarioPensionado | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUsuario: (usuario: UsuarioPensionado) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioPensionado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const usuariosDemo: UsuarioPensionado[] = [
    {
      id: "1",
      nombre: "Paneton",
      apellidos: "Pan Cito",
      email: "paneton@ejemplo.com",
      telefono: "+591 74402990",
      fechaRegistro: "2025-05-30",
      tipoMembresía: "platos",
      saldoComidas: 0,
      saldoPlatos: 18, 
      activo: true,
    },
    {
      id: "2",
      nombre: "Buñuelito",
      apellidos: "Manu gei",
      email: "manu@ejemplo.com",
      telefono: "110",
      fechaRegistro: "2025-02-20",
      tipoMembresía: "platos",
      saldoComidas: 0,
      saldoPlatos: 25, 
      activo: true,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const usuarioEncontrado = usuariosDemo.find((u) => u.email === email);

    if (usuarioEncontrado && password === "123456") {
      setUsuario(usuarioEncontrado);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUsuario(null);
  };

  const updateUsuario = (usuarioActualizado: UsuarioPensionado) => {
    setUsuario(usuarioActualizado);
  };

  const value = {
    usuario,
    isLoading,
    login,
    logout,
    updateUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
