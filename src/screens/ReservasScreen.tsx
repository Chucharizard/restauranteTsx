import React, { useState } from "react";
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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
}

const reservasActuales: Reserva[] = [
  {
    id: "1",
    fecha: "2025-06-15",
    hora: "12:30",
    personas: 2,
    mesa: "Mesa 5",
    estado: "confirmada",
    comentarios: "Mesa cerca de la ventana",
  },
  {
    id: "2",
    fecha: "2025-06-18",
    hora: "19:00",
    personas: 4,
    mesa: "Mesa 12",
    estado: "pendiente",
    comentarios: "Celebración familiar",
  },
];

const horariosDisponibles = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export default function ReservasScreen() {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [reservas, setReservas] = useState<Reserva[]>(reservasActuales);
  const [modalVisible, setModalVisible] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [personasSeleccionadas, setPersonasSeleccionadas] = useState(2);
  const [comentarios, setComentarios] = useState("");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const { usuario } = useAuth();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "#56A099";
      case "pendiente":
        return "#D48689";
      case "cancelada":
        return "#C7362F";
      default:
        return "#5F98A6";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "check-circle";
      case "pendiente":
        return "schedule";
      case "cancelada":
        return "cancel";
      default:
        return "help";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "cancelada":
        return "Cancelada";
      default:
        return "Desconocido";
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Funciones del calendario
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

  const seleccionarFecha = (fecha: Date) => {
    setFechaSeleccionada(formatearFechaCalendario(fecha));
    setMostrarCalendario(false);
  };

  const cambiarMes = (direccion: number) => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + direccion, 1));
  };

  const nombreMes = mesActual.toLocaleDateString("es-BO", { month: "long", year: "numeric" });

  const cancelarReserva = (id: string) => {
    Alert.alert(
      "🚫 Cancelar Reserva",
      "¿Estás seguro de que deseas cancelar esta reserva?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => {
            setReservas((prev) =>
              prev.map((reserva) =>
                reserva.id === id
                  ? { ...reserva, estado: "cancelada" }
                  : reserva
              )
            );
            Alert.alert(
              "✅ Reserva cancelada",
              "Tu reserva ha sido cancelada exitosamente"
            );
          },
        },
      ]
    );
  };

  const crearReserva = () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      Alert.alert("⚠️ Error", "Por favor selecciona fecha y hora para tu reserva");
      return;
    }
    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      personas: personasSeleccionadas,
      mesa: `Mesa ${Math.floor(Math.random() * 20) + 1}`,
      estado: "pendiente",
      comentarios: comentarios,
    };
    setReservas((prev) => [...prev, nuevaReserva]);
    setModalVisible(false);
    setFechaSeleccionada("");
    setHoraSeleccionada("");
    setPersonasSeleccionadas(2);
    setComentarios("");
    Alert.alert(
      "🎉 ¡Reserva creada!",
      "Tu reserva ha sido creada y está pendiente de confirmación"
    );
  };

  const reservasConfirmadas = reservas.filter(r => r.estado === "confirmada").length;
  const reservasPendientes = reservas.filter(r => r.estado === "pendiente").length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#37738F" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextSection}>
            <Text style={styles.headerTitle}>🍽️ Mis Reservas</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona tus reservas como pensionado
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{reservasConfirmadas}</Text>
              <Text style={styles.miniStatLabel}>Confirmadas</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{reservasPendientes}</Text>
              <Text style={styles.miniStatLabel}>Pendientes</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.nuevaReservaButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
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
        <View style={styles.reservasContainer}>
          <Text style={styles.sectionTitle}>📅 Próximas Reservas</Text>
          {reservas.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <MaterialIcons name="event-available" size={60} color="#61B1BA" />
              </View>
              <Text style={styles.emptyText}>No tienes reservas</Text>
              <Text style={styles.emptySubtext}>
                Crea tu primera reserva usando el botón de arriba
              </Text>
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyActionText}>Hacer Reserva</Text>
              </TouchableOpacity>
            </View>
          ) : (
            reservas.map((reserva) => (
              <View key={reserva.id} style={styles.reservaCard}>
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
                      onPress={() => cancelarReserva(reserva.id)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="cancel" size={16} color="#C7362F" />
                      <Text style={styles.cancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editarButton}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="edit" size={16} color="#5F98A6" />
                      <Text style={styles.editarTexto}>Modificar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color="#61B1BA" />
            <Text style={styles.infoTitle}>ℹ️ Información importante</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="star" size={16} color="#D48689" />
              <Text style={styles.infoText}>Prioridad en reservas como pensionado</Text>
            </View>            <View style={styles.infoItem}>
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
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>              <View style={styles.modalTitleContainer}>
                <MaterialIcons name="event-available" size={24} color={theme.primary} />
                <Text style={styles.modalTitle}>📝 Nueva Reserva</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Fecha con calendario */}
              <View style={styles.formGroup}>                <Text style={styles.formLabel}>
                  <MaterialIcons name="calendar-today" size={16} color={theme.primary} />
                  {" "}Fecha de la reserva
                </Text>
                <TouchableOpacity 
                  style={styles.fechaButton}
                  onPress={() => setMostrarCalendario(true)}
                  activeOpacity={0.8}
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
                {/* Modal Calendario */}
                <Modal
                  visible={mostrarCalendario}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setMostrarCalendario(false)}
                >
                  <View style={styles.calendarioOverlay}>
                    <View style={styles.calendarioContainer}>
                      <View style={styles.calendarioHeader}>
                        <TouchableOpacity 
                          onPress={() => cambiarMes(-1)}
                          style={styles.calendarioNavButton}
                        >
                          <MaterialIcons name="chevron-left" size={24} color="#37738F" />
                        </TouchableOpacity>
                        <Text style={styles.calendarioTitulo}>
                          {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
                        </Text>
                        <TouchableOpacity 
                          onPress={() => cambiarMes(1)}
                          style={styles.calendarioNavButton}
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
                        {obtenerDiasDelMes(mesActual).map((fecha, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.diaButton,
                              !fecha && styles.diaVacio,
                              fecha && !esFechaHabilitada(fecha) && styles.diaDeshabilitado,
                              fecha && fechaSeleccionada === formatearFechaCalendario(fecha) && styles.diaSeleccionado
                            ]}
                            onPress={() => fecha && esFechaHabilitada(fecha) && seleccionarFecha(fecha)}
                            disabled={!fecha || !esFechaHabilitada(fecha)}
                            activeOpacity={0.7}
                          >
                            {fecha && (
                              <Text style={[
                                styles.diaTexto,
                                !esFechaHabilitada(fecha) && styles.diaTextoDeshabilitado,
                                fechaSeleccionada === formatearFechaCalendario(fecha) && styles.diaTextoSeleccionado
                              ]}>
                                {fecha.getDate()}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={styles.calendarioActions}>
                        <TouchableOpacity 
                          style={styles.calendarioCancelButton}
                          onPress={() => setMostrarCalendario(false)}
                        >
                          <Text style={styles.calendarioCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              {/* Hora */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="schedule" size={16} color="#37738F" />
                  {" "}Hora preferida
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
                  {" "}Número de personas
                </Text>
                <View style={styles.personasContainer}>
                  <TouchableOpacity
                    style={styles.personasButton}
                    onPress={() =>
                      setPersonasSeleccionadas(Math.max(1, personasSeleccionadas - 1))
                    }
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="remove" size={20} color="#FFF" />
                  </TouchableOpacity>
                  <View style={styles.personasDisplay}>
                    <Text style={styles.personasTexto}>{personasSeleccionadas}</Text>
                    <Text style={styles.personasLabel}>
                      persona{personasSeleccionadas !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.personasButton}
                    onPress={() =>
                      setPersonasSeleccionadas(Math.min(8, personasSeleccionadas + 1))
                    }
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="add" size={20} color="#FFF" />
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
                    placeholder="Ej: Mesa cerca de la ventana, celebración especial, etc."
                    value={comentarios}
                    onChangeText={setComentarios}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={crearReserva}
                activeOpacity={0.8}
              >
                <MaterialIcons name="check" size={20} color="#FFF" />
                <Text style={styles.createButtonText}>Crear Reserva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
  },  sectionTitle: {
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
  },  fechaCircle: {
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
  },  detalleItem: {
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
  },  detalleValor: {
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
  },  cancelarButton: {
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
  },  modalContent: {
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
  },  modalTitle: {
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 12,
    backgroundColor: theme.surface,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  formInput: {
    flex: 1,
    fontSize: 16,    color: theme.text,
    paddingVertical: 12,
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
    backgroundColor: "#F8F9FA",
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
  personasDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  personasTexto: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#37738F",
  },
  personasLabel: {
    fontSize: 12,
    color: "#5F98A6",
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8CDB8",
  },
  cancelModalButtonText: {
    fontSize: 16,
    color: "#5F98A6",
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
  createButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  fechaButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fechaButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fechaButtonText: {
    fontSize: 15,
    color: "#999",
    flex: 1,
    marginLeft: 12,
  },  fechaButtonTextSelected: {
    color: theme.primary,
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
  calendarioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    textAlign: "center",
    flex: 1,
  },
  diasSemanaContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },  diaSemanaLabel: {
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
  },
  diaVacio: {},
  diaDeshabilitado: {
    opacity: 0.3,
  },
  diaSeleccionado: {
    backgroundColor: "#37738F",
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
  calendarioActions: {
    marginTop: 20,
    alignItems: "center",
  },
  calendarioCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.surface,
    borderRadius: 20,
  },
  calendarioCancelText: {
    fontSize: 14,
    color: theme.textMuted,
    fontWeight: "500",
  },
});