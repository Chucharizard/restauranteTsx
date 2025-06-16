import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  personas: number;
  mesa: string;
  estado: "confirmada" | "pendiente" | "cancelada";
  comentarios: string;
  fechaCreacion: string;
  usuarioId: string; // Cambiado de 'usuario' a 'usuarioId'
}

const STORAGE_KEY = '@reservas_pensionado';

const reservasIniciales: Reserva[] = [
  {
    id: "1",
    fecha: "2025-06-18",
    hora: "12:30",
    personas: 2,
    mesa: "Mesa 5",
    estado: "confirmada",
    comentarios: "Mesa cerca de la ventana",
    fechaCreacion: "2025-06-15T10:30:00Z",
    usuarioId: "1", // ID del usuario Paneton
  },
  {
    id: "2",
    fecha: "2025-06-20",
    hora: "19:00",
    personas: 4,
    mesa: "Mesa 12",
    estado: "pendiente",
    comentarios: "Celebración familiar",
    fechaCreacion: "2025-06-15T14:45:00Z",
    usuarioId: "1", // ID del usuario Paneton
  },
];

const horariosDisponibles = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

// Componente ReservaCard extraído
const ReservaCard = React.memo(({ 
  reserva, 
  onCancel, 
  onEdit, 
  theme, 
  styles 
}: {
  reserva: Reserva;
  onCancel: (id: string) => void;
  onEdit: (reserva: Reserva) => void;
  theme: any;
  styles: any;
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada": return "#56A099";
      case "pendiente": return "#D48689";
      case "cancelada": return "#C7362F";
      default: return "#5F98A6";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "confirmada": return "check-circle";
      case "pendiente": return "schedule";
      case "cancelada": return "cancel";
      default: return "help";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "confirmada": return "Confirmada";
      case "pendiente": return "Pendiente";
      case "cancelada": return "Cancelada";
      default: return "Desconocido";
    }
  };

  const formatearFechaCorta = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
    });
  };

  const getDiaSemana = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-BO", {
      weekday: "short",
    });
  };

  return (
    <View 
      style={styles.reservaCard}
      accessible={true}
      accessibilityLabel={`Reserva para ${reserva.fecha} a las ${reserva.hora}, ${reserva.personas} personas, estado ${getEstadoTexto(reserva.estado)}`}
    >
      <View style={styles.reservaHeader}>
        <View style={styles.fechaContainer}>
          <View style={styles.fechaCircle}>
            <Text style={styles.fechaDia}>
              {formatearFechaCorta(reserva.fecha).split(' ')[0]}
            </Text>
            <Text style={styles.fechaMes}>
              {formatearFechaCorta(reserva.fecha).split(' ')[1]}
            </Text>
          </View>
          <View style={styles.fechaTextos}>
            <Text style={styles.reservaFecha}>
              {getDiaSemana(reserva.fecha).toUpperCase()}
            </Text>
            <Text style={styles.reservaHora}>
              <MaterialIcons name="schedule" size={14} color="#61B1BA" />
              {" "}{reserva.hora}
            </Text>
          </View>
        </View>
        <View style={styles.estadoContainer}>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor(reserva.estado) },
            ]}
          >
            <MaterialIcons 
              name={getEstadoIcon(reserva.estado) as any} 
              size={12} 
              color="#FFF" 
            />
            <Text style={styles.estadoTexto}>
              {getEstadoTexto(reserva.estado)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.reservaDetalle}>
        <View style={styles.detalleGrid}>
          <View style={styles.detalleItem}>
            <View style={styles.detalleIconContainer}>
              <MaterialIcons name="people" size={16} color="#61B1BA" />
            </View>
            <View>
              <Text style={styles.detalleLabel}>Personas</Text>
              <Text style={styles.detalleValor}>
                {reserva.personas} persona{reserva.personas !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          <View style={styles.detalleItem}>
            <View style={styles.detalleIconContainer}>
              <MaterialIcons name="table-restaurant" size={16} color="#61B1BA" />
            </View>
            <View>
              <Text style={styles.detalleLabel}>Mesa</Text>
              <Text style={styles.detalleValor}>{reserva.mesa}</Text>
            </View>
          </View>
        </View>
      </View>

      {reserva.comentarios && (
        <View style={styles.comentariosContainer}>
          <View style={styles.comentariosHeader}>
            <MaterialIcons name="comment" size={14} color="#5F98A6" />
            <Text style={styles.comentariosLabel}>Comentarios</Text>
          </View>
          <Text style={styles.comentariosTexto}>
            {reserva.comentarios}
          </Text>
        </View>
      )}

      {reserva.estado !== "cancelada" && (
        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.cancelarButton}
            onPress={() => onCancel(reserva.id)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Cancelar reserva"
            accessibilityRole="button"
          >
            <MaterialIcons name="cancel" size={16} color="#C7362F" />
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editarButton}
            onPress={() => onEdit(reserva)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Modificar reserva"
            accessibilityRole="button"
          >
            <MaterialIcons name="edit" size={16} color="#5F98A6" />
            <Text style={styles.editarTexto}>Modificar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

// Componente Calendario extraído
const CalendarioCustom = React.memo(({ 
  visible, 
  onClose, 
  onDateSelect, 
  selectedDate, 
  reservasExistentes,
  theme,
  styles 
}: {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (fecha: Date) => void;
  selectedDate: string;
  reservasExistentes: Reserva[];
  theme: any;
  styles: any;
}) => {
  const [mesActual, setMesActual] = useState(new Date());

  const obtenerDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    const dias = [];
    for (let i = 0; i < diaSemanaInicio; i++) dias.push(null);
    for (let i = 1; i <= diasEnMes; i++) dias.push(new Date(año, mes, i));
    return dias;
  };

  const formatearFechaCalendario = (fecha: Date) => {
    return fecha.toISOString().split('T')[0];
  };

  const esFechaHabilitada = (fecha: Date) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha >= hoy;
  };

  const tieneReserva = (fecha: Date) => {
    const fechaStr = formatearFechaCalendario(fecha);
    return reservasExistentes.some(reserva => 
      reserva.fecha === fechaStr && reserva.estado !== 'cancelada'
    );
  };

  const cambiarMes = (direccion: number) => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + direccion, 1));
  };

  const cambiarAño = (direccion: number) => {
    setMesActual(prev => new Date(prev.getFullYear() + direccion, prev.getMonth(), 1));
  };

  const nombreMes = mesActual.toLocaleDateString("es-BO", { month: "long", year: "numeric" });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.calendarioOverlay}>
        <View style={styles.calendarioContainer}>
          <View style={styles.calendarioHeader}>
            <TouchableOpacity 
              onPress={() => cambiarMes(-1)}
              style={styles.calendarioNavButton}
              accessible={true}
              accessibilityLabel="Mes anterior"
            >
              <MaterialIcons name="chevron-left" size={24} color="#37738F" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => cambiarAño(-1)}
              style={styles.calendarioYearButton}
              accessible={true}
              accessibilityLabel="Año anterior"
            >
              <Text style={styles.calendarioYearText}>‹‹</Text>
            </TouchableOpacity>

            <Text style={styles.calendarioTitulo}>
              {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
            </Text>

            <TouchableOpacity 
              onPress={() => cambiarAño(1)}
              style={styles.calendarioYearButton}
              accessible={true}
              accessibilityLabel="Año siguiente"
            >
              <Text style={styles.calendarioYearText}>››</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => cambiarMes(1)}
              style={styles.calendarioNavButton}
              accessible={true}
              accessibilityLabel="Mes siguiente"
            >
              <MaterialIcons name="chevron-right" size={24} color="#37738F" />
            </TouchableOpacity>
          </View>

          <View style={styles.diasSemanaContainer}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((dia) => (
              <Text key={dia} style={styles.diaSemanaLabel}>
                {dia}
              </Text>
            ))}
          </View>

          <View style={styles.diasGrid}>
            {obtenerDiasDelMes(mesActual).map((fecha, index) => {
              const fechaStr = fecha ? formatearFechaCalendario(fecha) : '';
              const esSeleccionado = fecha && selectedDate === fechaStr;
              const esHabilitado = fecha && esFechaHabilitada(fecha);
              const tieneReservaExistente = fecha && tieneReserva(fecha);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.diaButton,
                    !fecha && styles.diaVacio,
                    fecha && !esHabilitado && styles.diaDeshabilitado,
                    esSeleccionado && styles.diaSeleccionado,
                    tieneReservaExistente && styles.diaConReserva
                  ]}
                  onPress={() => fecha && esHabilitado && onDateSelect(fecha)}
                  disabled={!fecha || !esHabilitado}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={fecha ? `${fecha.getDate()} de ${nombreMes}` : undefined}
                >
                  {fecha && (
                    <>
                      <Text style={[
                        styles.diaTexto,
                        !esHabilitado && styles.diaTextoDeshabilitado,
                        esSeleccionado && styles.diaTextoSeleccionado
                      ]}>
                        {fecha.getDate()}
                      </Text>
                      {tieneReservaExistente && (
                        <View style={styles.indicadorReserva} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.calendarioLeyenda}>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaColor, { backgroundColor: '#37738F' }]} />
              <Text style={styles.leyendaTexto}>Seleccionado</Text>
            </View>
            <View style={styles.leyendaItem}>
              <View style={[styles.leyendaColor, { backgroundColor: '#D48689' }]} />
              <Text style={styles.leyendaTexto}>Con reserva</Text>
            </View>
          </View>

          <View style={styles.calendarioActions}>
            <TouchableOpacity 
              style={styles.calendarioCancelButton}
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Cerrar calendario"
            >
              <Text style={styles.calendarioCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default function ReservasScreen() {
  const { theme, isDarkMode } = useTheme();
  const { usuario } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Estados principales
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoReserva, setEditandoReserva] = useState<Reserva | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [personasSeleccionadas, setPersonasSeleccionadas] = useState(2);
  const [comentarios, setComentarios] = useState("");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [loadingCreacion, setLoadingCreacion] = useState(false);

  // Cargar reservas al iniciar
  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const reservasGuardadas = await AsyncStorage.getItem(STORAGE_KEY);
      if (reservasGuardadas) {
        const reservasParseadas = JSON.parse(reservasGuardadas);
        // Filtrar solo las reservas del usuario actual usando el ID
        const reservasUsuario = reservasParseadas.filter(
          (r: Reserva) => r.usuarioId === usuario?.id
        );
        setReservas(reservasUsuario);
      } else {
        // Si no hay reservas guardadas, usar las iniciales si es el usuario correcto
        const reservasUsuario = reservasIniciales.filter(
          r => r.usuarioId === usuario?.id
        );
        setReservas(reservasUsuario);
        if (reservasUsuario.length > 0) {
          await guardarReservas(reservasUsuario);
        }
      }
    } catch (err) {
      console.error('Error cargando reservas:', err);
      setError('Error al cargar las reservas');
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarReservas();
    setRefreshing(false);
  }, []);

  const guardarReservas = async (nuevasReservas: Reserva[]) => {
    try {
      // Obtener todas las reservas existentes
      const todasReservas = await AsyncStorage.getItem(STORAGE_KEY);
      let reservasExistentes: Reserva[] = todasReservas ? JSON.parse(todasReservas) : [];
      
      // Filtrar las reservas que no son del usuario actual
      const reservasOtrosUsuarios = reservasExistentes.filter(
        r => r.usuarioId !== usuario?.id
      );
      
      // Combinar con las nuevas reservas del usuario actual
      const reservasActualizadas = [...reservasOtrosUsuarios, ...nuevasReservas];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservasActualizadas));
    } catch (err) {
      console.error('Error guardando reservas:', err);
    }
  };

  // Validaciones mejoradas
  const validarReserva = useCallback((): string[] => {
    const errores: string[] = [];
    
    if (!fechaSeleccionada) {
      errores.push("• Selecciona una fecha para tu reserva");
    }
    
    if (!horaSeleccionada) {
      errores.push("• Selecciona una hora para tu reserva");
    }
    
    if (personasSeleccionadas < 1 || personasSeleccionadas > 8) {
      errores.push("• El número de personas debe estar entre 1 y 8");
    }
    
    // Validar que la fecha no sea en el pasado
    if (fechaSeleccionada) {
      const fechaReserva = new Date(fechaSeleccionada);
      const ahora = new Date();
      ahora.setHours(0, 0, 0, 0);
      
      if (fechaReserva < ahora) {
        errores.push("• No puedes reservar para fechas pasadas");
      }
    }
    
    // Validar disponibilidad solo si no estamos editando
    if (fechaSeleccionada && horaSeleccionada && !editandoReserva) {
      const reservaExistente = reservas.find(r => 
        r.fecha === fechaSeleccionada && 
        r.hora === horaSeleccionada && 
        r.estado !== 'cancelada'
      );
      
      if (reservaExistente) {
        errores.push("• Ya tienes una reserva para esta fecha y hora");
      }
    }
    
    // Validar que no sea muy tarde para reservar el mismo día
    if (fechaSeleccionada && horaSeleccionada) {
      const fechaReserva = new Date(fechaSeleccionada);
      const ahora = new Date();
      const horaReserva = parseInt(horaSeleccionada.split(':')[0]);
      
      if (fechaReserva.toDateString() === ahora.toDateString()) {
        if (ahora.getHours() > horaReserva - 2) {
          errores.push("• Para reservas del mismo día, debes hacerlo con al menos 2 horas de anticipación");
        }
      }
    }
    
    return errores;
  }, [fechaSeleccionada, horaSeleccionada, personasSeleccionadas, reservas, editandoReserva]);

  const resetForm = useCallback(() => {
    setFechaSeleccionada("");
    setHoraSeleccionada("");
    setPersonasSeleccionadas(2);
    setComentarios("");
    setEditandoReserva(null);
    setError('');
  }, []);

  const crearOEditarReserva = useCallback(async () => {
    try {
      setLoadingCreacion(true);
      setError('');
      
      const errores = validarReserva();
      if (errores.length > 0) {
        Alert.alert(
          "⚠️ Errores en la reserva", 
          errores.join('\n'),
          [{ text: "Entendido", style: "default" }]
        );
        return;
      }
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editandoReserva) {
        // Editar reserva existente
        const reservaActualizada: Reserva = {
          ...editandoReserva,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          personas: personasSeleccionadas,
          comentarios: comentarios.trim(),
        };
        
        const nuevasReservas = reservas.map(r => 
          r.id === editandoReserva.id ? reservaActualizada : r
        );
        
        setReservas(nuevasReservas);
        await guardarReservas(nuevasReservas);
        
        Alert.alert(
          "✅ ¡Reserva actualizada!",
          "Tu reserva ha sido modificada exitosamente"
        );
      } else {
        // Crear nueva reserva
        const nuevaReserva: Reserva = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          personas: personasSeleccionadas,
          mesa: `Mesa ${Math.floor(Math.random() * 20) + 1}`,
          estado: "pendiente",
          comentarios: comentarios.trim(),
          fechaCreacion: new Date().toISOString(),
          usuarioId: usuario?.id || 'unknown', // Usar el ID del usuario
        };
        
        const nuevasReservas = [...reservas, nuevaReserva];
        setReservas(nuevasReservas);
        await guardarReservas(nuevasReservas);
        
        Alert.alert(
          "🎉 ¡Reserva creada!",
          "Tu reserva ha sido creada y está pendiente de confirmación"
        );
      }
      
      resetForm();
      setModalVisible(false);
      
    } catch (err) {
      console.error('Error al crear/editar reserva:', err);
      setError('Error al procesar la reserva. Intenta nuevamente.');
      Alert.alert(
        "❌ Error",
        "Hubo un problema al procesar tu reserva. Por favor intenta nuevamente."
      );
    } finally {
      setLoadingCreacion(false);
    }
  }, [
    validarReserva, 
    editandoReserva, 
    fechaSeleccionada, 
    horaSeleccionada, 
    personasSeleccionadas, 
    comentarios, 
    reservas, 
    resetForm, 
    usuario,
    guardarReservas
  ]);

  const cancelarReserva = useCallback(async (id: string) => {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    Alert.alert(
      "🚫 Cancelar Reserva",
      `¿Estás seguro de que deseas cancelar tu reserva del ${formatearFecha(reserva.fecha)} a las ${reserva.hora}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const nuevasReservas = reservas.map((r) =>
                r.id === id ? { ...r, estado: "cancelada" as const } : r
              );
              
              setReservas(nuevasReservas);
              await guardarReservas(nuevasReservas);
              
              Alert.alert(
                "✅ Reserva cancelada",
                "Tu reserva ha sido cancelada exitosamente"
              );
            } catch (err) {
              console.error('Error al cancelar reserva:', err);
              Alert.alert(
                "❌ Error",
                "No se pudo cancelar la reserva. Intenta nuevamente."
              );
            }
          },
        },
      ]
    );
  }, [reservas, guardarReservas]);

  const editarReserva = useCallback((reserva: Reserva) => {
    setEditandoReserva(reserva);
    setFechaSeleccionada(reserva.fecha);
    setHoraSeleccionada(reserva.hora);
    setPersonasSeleccionadas(reserva.personas);
    setComentarios(reserva.comentarios);
    setModalVisible(true);
  }, []);

  const formatearFecha = useCallback((fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const seleccionarFecha = useCallback((fecha: Date) => {
    setFechaSeleccionada(fecha.toISOString().split('T')[0]);
    setMostrarCalendario(false);
  }, []);

  const abrirModalNuevaReserva = useCallback(() => {
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const cerrarModal = useCallback(() => {
    resetForm();
    setModalVisible(false);
  }, [resetForm]);

  // Estadísticas calculadas
  const estadisticas = useMemo(() => {
    const confirmadas = reservas.filter(r => r.estado === "confirmada").length;
    const pendientes = reservas.filter(r => r.estado === "pendiente").length;
    const canceladas = reservas.filter(r => r.estado === "cancelada").length;
    
    return { confirmadas, pendientes, canceladas };
  }, [reservas]);

  // Reservas filtradas y ordenadas
  const reservasActivas = useMemo(() => {
    return reservas
      .filter(r => r.estado !== "cancelada")
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [reservas]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#37738F" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextSection}>
            <Text style={styles.headerTitle}>🍽️ Mis Reservas</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona tus reservas {usuario?.nombre}
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{estadisticas.confirmadas}</Text>
              <Text style={styles.miniStatLabel}>Confirmadas</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{estadisticas.pendientes}</Text>
              <Text style={styles.miniStatLabel}>Pendientes</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Error Display */}
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={20} color="#C7362F" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={cargarReservas}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Botón Nueva Reserva */}
        <TouchableOpacity
          style={styles.nuevaReservaButton}
          onPress={abrirModalNuevaReserva}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Crear nueva reserva"
          accessibilityRole="button"
        >
          <View style={styles.nuevaReservaIconContainer}>
            <MaterialIcons name="add" size={24} color="#FFF" />
          </View>
          <View style={styles.nuevaReservaTextContainer}>
            <Text style={styles.nuevaReservaText}>Nueva Reserva</Text>
            <Text style={styles.nuevaReservaSubtext}>Reserva tu mesa ahora</Text>
          </View>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Lista de Reservas */}
        <View style={styles.reservasContainer}>
          <Text style={styles.sectionTitle}>📅 Próximas Reservas</Text>
          {reservasActivas.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <MaterialIcons name="event-available" size={60} color="#61B1BA" />
              </View>
              <Text style={styles.emptyText}>No tienes reservas activas</Text>
              <Text style={styles.emptySubtext}>
                Crea tu primera reserva usando el botón de arriba
              </Text>
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={abrirModalNuevaReserva}
                accessible={true}
                accessibilityLabel="Hacer nueva reserva"
              >
                <Text style={styles.emptyActionText}>Hacer Reserva</Text>
              </TouchableOpacity>
            </View>
          ) : (
            reservasActivas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onCancel={cancelarReserva}
                onEdit={editarReserva}
                theme={theme}
                styles={styles}
              />
            ))
          )}
        </View>

        {/* Información */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color="#61B1BA" />
            <Text style={styles.infoTitle}>ℹ️ Información importante</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="star" size={16} color="#D48689" />
              <Text style={styles.infoText}>Prioridad en reservas como pensionado</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="check-circle" size={16} color="#56A099" />
              <Text style={styles.infoText}>Confirmación automática</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="schedule" size={16} color={theme.textMuted} />
              <Text style={styles.infoText}>Cancelación hasta 2h antes</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={16} color={theme.primary} />
              <Text style={styles.infoText}>12:00-14:30 y 18:30-21:00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>              
              <View style={styles.modalTitleContainer}>
                <MaterialIcons name="event-available" size={24} color={theme.primary} />
                <Text style={styles.modalTitle}>
                  {editandoReserva ? "✏️ Editar Reserva" : "📝 Nueva Reserva"}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={cerrarModal}
                style={styles.closeButton}
                accessible={true}
                accessibilityLabel="Cerrar modal"
              >
                <MaterialIcons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {error ? (
                <View style={styles.modalErrorContainer}>
                  <Text style={styles.modalErrorText}>{error}</Text>
                </View>
              ) : null}

              {/* Fecha */}
              <View style={styles.formGroup}>                
                <Text style={styles.formLabel}>
                  <MaterialIcons name="calendar-today" size={16} color={theme.primary} />
                  {" "}Fecha de la reserva *
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.fechaButton,
                    fechaSeleccionada && styles.fechaButtonSelected
                  ]}
                  onPress={() => setMostrarCalendario(true)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityLabel={fechaSeleccionada ? `Fecha seleccionada: ${formatearFecha(fechaSeleccionada)}` : "Seleccionar fecha"}
                >
                  <View style={styles.fechaButtonContent}>
                    <MaterialIcons name="date-range" size={20} color="#61B1BA" />
                    <Text style={[
                      styles.fechaButtonText,
                      fechaSeleccionada && styles.fechaButtonTextSelected
                    ]}>
                      {fechaSeleccionada 
                        ? formatearFecha(fechaSeleccionada)
                        : "Seleccionar fecha"
                      }
                    </Text>
                    <MaterialIcons name="expand-more" size={20} color="#61B1BA" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Hora */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="schedule" size={16} color="#37738F" />
                  {" "}Hora preferida *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.horariosContainer}>
                    {horariosDisponibles.map((hora) => (
                      <TouchableOpacity
                        key={hora}
                        style={[
                          styles.horarioButton,
                          horaSeleccionada === hora && styles.horarioSeleccionado,
                        ]}
                        onPress={() => setHoraSeleccionada(hora)}
                        activeOpacity={0.8}
                        accessible={true}
                        accessibilityLabel={`Seleccionar hora ${hora}`}
                      >
                        <Text
                          style={[
                            styles.horarioTexto,
                            horaSeleccionada === hora && styles.horarioTextoSeleccionado,
                          ]}
                        >
                          {hora}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Personas */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="people" size={16} color="#37738F" />
                  {" "}Número de personas (1-8) *
                </Text>
                <View style={styles.personasContainer}>
                  <TouchableOpacity
                    style={[
                      styles.personasButton,
                      personasSeleccionadas <= 1 && styles.personasButtonDisabled
                    ]}
                    onPress={() =>
                      setPersonasSeleccionadas(Math.max(1, personasSeleccionadas - 1))
                    }
                    activeOpacity={0.8}
                    disabled={personasSeleccionadas <= 1}
                    accessible={true}
                    accessibilityLabel="Reducir número de personas"
                  >
                    <MaterialIcons 
                      name="remove" 
                      size={20} 
                      color={personasSeleccionadas <= 1 ? "#CCC" : "#FFF"} 
                    />
                  </TouchableOpacity>
                  <View style={styles.personasDisplay}>
                    <Text style={styles.personasTexto}>{personasSeleccionadas}</Text>
                    <Text style={styles.personasLabel}>
                      persona{personasSeleccionadas !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.personasButton,
                      personasSeleccionadas >= 8 && styles.personasButtonDisabled
                    ]}
                    onPress={() =>
                      setPersonasSeleccionadas(Math.min(8, personasSeleccionadas + 1))
                    }
                    activeOpacity={0.8}
                    disabled={personasSeleccionadas >= 8}
                    accessible={true}
                    accessibilityLabel="Aumentar número de personas"
                  >
                    <MaterialIcons 
                      name="add" 
                      size={20} 
                      color={personasSeleccionadas >= 8 ? "#CCC" : "#FFF"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comentarios */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="comment" size={16} color="#37738F" />
                  {" "}Comentarios o solicitudes especiales
                </Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="Ej: Mesa cerca de la ventana, celebración especial, alergias alimentarias, etc."
                    value={comentarios}
                    onChangeText={setComentarios}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                    placeholderTextColor="#999"
                    accessible={true}
                    accessibilityLabel="Campo de comentarios"
                  />
                  <Text style={styles.characterCount}>
                    {comentarios.length}/200
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={cerrarModal}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Cancelar"
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  loadingCreacion && styles.createButtonDisabled
                ]}
                onPress={crearOEditarReserva}
                activeOpacity={0.8}
                disabled={loadingCreacion}
                accessible={true}
                accessibilityLabel={editandoReserva ? "Guardar cambios" : "Crear reserva"}
              >
                {loadingCreacion ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={20} color="#FFF" />
                    <Text style={styles.createButtonText}>
                      {editandoReserva ? "Guardar Cambios" : "Crear Reserva"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendario */}
      <CalendarioCustom
        visible={mostrarCalendario}
        onClose={() => setMostrarCalendario(false)}
        onDateSelect={seleccionarFecha}
        selectedDate={fechaSeleccionada}
        reservasExistentes={reservas}
        theme={theme}
        styles={styles}
      />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.textMuted,
  },
  header: {
    backgroundColor: theme.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.textInverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.surface,
    fontWeight: "500",
  },
  headerTextSection: {
    flex: 1,
  },
  headerStats: {
    flexDirection: "row",
    gap: 12,
  },
  miniStat: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 12,
    minWidth: 60,
  },
  miniStatNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textInverse,
  },
  miniStatLabel: {
    fontSize: 10,
    color: theme.surface,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#C7362F',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#C7362F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nuevaReservaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#61B1BA",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nuevaReservaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nuevaReservaTextContainer: {
    flex: 1,
  },
  nuevaReservaText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  nuevaReservaSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  reservasContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: theme.card,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyActionButton: {
    backgroundColor: "#61B1BA",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyActionText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  reservaCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#61B1BA",
  },
  reservaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  fechaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fechaCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#61B1BA",
  },
  fechaDia: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    lineHeight: 18,
  },
  fechaMes: {
    fontSize: 10,
    color: theme.textMuted,
    textTransform: "uppercase",
    lineHeight: 12,
  },
  fechaTextos: {
    flex: 1,
  },
  reservaFecha: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    letterSpacing: 0.5,
  },
  reservaHora: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  estadoContainer: {
    alignItems: "flex-end",
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  estadoTexto: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  reservaDetalle: {
    marginBottom: 16,
  },
  detalleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detalleItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: theme.surface,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  detalleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  detalleLabel: {
    fontSize: 11,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detalleValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.text,
    marginTop: 2,
  },
  comentariosContainer: {
    backgroundColor: theme.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  comentariosHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  comentariosLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  comentariosTexto: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 20,
    fontStyle: "italic",
  },
  accionesContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
  },
  cancelarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.background === "#121212" ? "rgba(199, 54, 47, 0.2)" : "#FFEBEE",
    gap: 4,
  },
  cancelarTexto: {
    color: "#C7362F",
    fontSize: 14,
    fontWeight: "600",
  },
  editarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.surface,
    gap: 4,
  },
  editarTexto: {
    color: theme.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: theme.textMuted,
    flex: 1,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(55, 115, 143, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  modalForm: {
    padding: 20,
  },
  modalErrorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalErrorText: {
    color: '#C7362F',
    fontSize: 14,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  textAreaContainer: {
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 12,
    backgroundColor: theme.surface,
    padding: 16,
  },
  formTextArea: {
    fontSize: 16,
    color: theme.text,
    textAlignVertical: "top",
    minHeight: 80,
  },
  characterCount: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  horariosContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
  },
  horarioButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    minWidth: 70,
    alignItems: "center",
  },
  horarioSeleccionado: {
    backgroundColor: "#61B1BA",
    borderColor: "#61B1BA",
  },
  horarioTexto: {
    fontSize: 14,
    color: theme.textMuted,
    fontWeight: "600",
  },
  horarioTextoSeleccionado: {
    color: "#FFF",
  },
  personasContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    gap: 20,
  },
  personasButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#61B1BA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  personasButtonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  personasDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  personasTexto: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.text,
  },
  personasLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.border,
  },
  cancelModalButtonText: {
    fontSize: 16,
    color: theme.textMuted,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#61B1BA",
    gap: 8,
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  fechaButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: theme.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fechaButtonSelected: {
    borderColor: "#61B1BA",
  },
  fechaButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fechaButtonText: {
    fontSize: 15,
    color: theme.textMuted,
    flex: 1,
    marginLeft: 12,
  },
  fechaButtonTextSelected: {
    color: theme.text,
    fontWeight: "500",
  },
  calendarioOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarioContainer: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  calendarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarioNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.surface,
  },
  calendarioYearButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: theme.surface,
    minWidth: 30,
    alignItems: 'center',
  },
  calendarioYearText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
  },
  calendarioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    textAlign: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  diasSemanaContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  diaSemanaLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: theme.textMuted,
    paddingVertical: 8,
  },
  diasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  diaButton: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    position: 'relative',
  },
  diaVacio: {},
  diaDeshabilitado: {
    opacity: 0.3,
  },
  diaSeleccionado: {
    backgroundColor: "#37738F",
    borderRadius: 20,
  },
  diaConReserva: {
    backgroundColor: "rgba(212, 134, 137, 0.3)",
    borderRadius: 20,
  },
  diaTexto: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "500",
  },
  diaTextoDeshabilitado: {
    color: theme.textMuted,
    opacity: 0.5,
  },
  diaTextoSeleccionado: {
    color: "#FFF",
    fontWeight: "bold",
  },
  indicadorReserva: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D48689',
  },
  calendarioLeyenda: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leyendaColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  leyendaTexto: {
    fontSize: 12,
    color: theme.textMuted,
  },
  calendarioActions: {
    marginTop: 20,
    alignItems: "center",
  },
  calendarioCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  calendarioCancelText: {
    fontSize: 14,
    color: theme.textMuted,
    fontWeight: "500",
  },
});