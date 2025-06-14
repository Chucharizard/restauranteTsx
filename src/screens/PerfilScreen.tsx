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
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth, UsuarioPensionado } from "../context/AuthContext";

const { width } = Dimensions.get("window");

export default function PerfilScreen() {
  const { usuario, logout, updateUsuario } = useAuth();
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [usuarioEditado, setUsuarioEditado] =
    useState<UsuarioPensionado | null>(null);

  const handleLogout = () => {
    Alert.alert(
      "🚪 Cerrar Sesión", 
      "¿Estás seguro de que deseas cerrar sesión?", 
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const iniciarEdicion = () => {
    if (usuario) {
      setUsuarioEditado({ ...usuario });
      setModalEditarVisible(true);
    }
  };

  const guardarCambios = () => {
    if (usuarioEditado) {
      updateUsuario(usuarioEditado);
      setModalEditarVisible(false);
      Alert.alert(
        "✅ Perfil actualizado",
        "Tus datos han sido actualizados exitosamente"
      );
    }
  };

  const calcularDiasMiembro = () => {
    if (!usuario?.fechaRegistro) return 0;
    const fechaRegistro = new Date(usuario.fechaRegistro);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaRegistro.getTime();
    return Math.floor(diferencia / (1000 * 3600 * 24));
  };

  const obtenerProximoVencimiento = () => {
    if (!usuario?.fechaRegistro) return "No disponible";
    const fechaRegistro = new Date(usuario.fechaRegistro);
    const proximoVencimiento = new Date(fechaRegistro);
    proximoVencimiento.setMonth(proximoVencimiento.getMonth() + 1);

    return proximoVencimiento.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOpcionClick = (opcionId: string) => {
    switch (opcionId) {
      case "notificaciones":
        Alert.alert(
          "🔔 Notificaciones",
          "Configuración de notificaciones próximamente disponible.\n\n• Recordatorios de comidas\n• Alertas de saldo bajo\n• Confirmaciones de reservas",
          [{ text: "Entendido" }]
        );
        break;
      case "historial":
        Alert.alert(
          "📊 Historial de Comidas",
          "Aquí podrás ver todo tu historial de comidas.\n\n🚧 Funcionalidad en desarrollo",
          [{ text: "Entendido" }]
        );
        break;
      case "pagos":
        Alert.alert(
          "💳 Historial de Pagos",
          "Consulta todos tus pagos y recargas de membresía.\n\n🚧 Funcionalidad en desarrollo",
          [{ text: "Entendido" }]
        );
        break;
      case "ayuda":
        Alert.alert(
          "🆘 Ayuda y Soporte",
          "¿Necesitas ayuda?\n\n📞 Teléfono: +591 2 123-4567\n📧 Email: soporte@restaurante.com\n🕐 Horarios: Lun-Sáb 8:00-20:00",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Llamar", onPress: () => Alert.alert("📱 Función de llamada no implementada en demo") }
          ]
        );
        break;
    }
  };

  const opcionesConfiguracion = [
    {
      id: "notificaciones",
      titulo: "Notificaciones",
      subtitulo: "Configurar alertas y recordatorios",
      icono: "notifications",
      color: "#61B1BA",
      emoji: "🔔",
    },
    {
      id: "historial",
      titulo: "Historial de Comidas",
      subtitulo: "Ver tu historial completo",
      icono: "history",
      color: "#56A099",
      emoji: "📊",
    },
    {
      id: "pagos",
      titulo: "Historial de Pagos",
      subtitulo: "Consultar tus pagos anteriores",
      icono: "payment",
      color: "#D48689",
      emoji: "💳",
    },
    {
      id: "ayuda",
      titulo: "Ayuda y Soporte",
      subtitulo: "Obtener ayuda con la aplicación",
      icono: "help",
      color: "#D47877",
      emoji: "🆘",
    },
  ];

  const getEstadoMembresia = () => {
    const saldo = usuario?.saldoPlatos || 0;
    if (saldo > 15) return { texto: "Excelente", color: "#56A099", emoji: "🟢" };
    if (saldo > 10) return { texto: "Bueno", color: "#61B1BA", emoji: "🟡" };
    if (saldo > 5) return { texto: "Regular", color: "#D48689", emoji: "🟠" };
    return { texto: "Bajo", color: "#C7362F", emoji: "🔴" };
  };

  const estadoMembresia = getEstadoMembresia();

  if (!usuario) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#37738F" />
      
      {/* Header mejorado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBackground}>
                <MaterialIcons name="person" size={48} color="#37738F" />
              </View>
              <View style={styles.statusIndicator}>
                <Text style={styles.statusEmoji}>{estadoMembresia.emoji}</Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.nombreUsuario}>
                👋 {usuario.nombre} {usuario.apellidos}
              </Text>
              <View style={styles.membershipBadge}>
                <MaterialIcons name="verified" size={16} color="#56A099" />
                <Text style={styles.tipoMiembro}>Pensionado Verificado</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={iniciarEdicion}
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información del perfil mejorada */}
        <View style={styles.perfilCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="person-outline" size={20} color="#37738F" />
              <Text style={styles.cardTitle}>Información Personal</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="email" size={18} color="#61B1BA" />
              </View>
              <View style={styles.infoTexto}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{usuario.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="phone" size={18} color="#61B1BA" />
              </View>
              <View style={styles.infoTexto}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{usuario.telefono}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="calendar-today" size={18} color="#61B1BA" />
              </View>
              <View style={styles.infoTexto}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>
                  {new Date(usuario.fechaRegistro).toLocaleDateString("es-BO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Estadísticas de membresía mejoradas */}
        <View style={styles.estadisticasCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="analytics" size={20} color="#37738F" />
              <Text style={styles.cardTitle}>📊 Estadísticas de Membresía</Text>
            </View>
            <View style={[styles.estadoBadge, { backgroundColor: estadoMembresia.color }]}>
              <Text style={styles.estadoTexto}>{estadoMembresia.texto}</Text>
            </View>
          </View>

          <View style={styles.estadisticasGrid}>
            <View style={styles.estadisticaCard}>
              <View style={styles.estadisticaIconContainer}>
                <MaterialIcons name="event" size={24} color="#61B1BA" />
              </View>
              <Text style={styles.estadisticaNumero}>
                {calcularDiasMiembro()}
              </Text>
              <Text style={styles.estadisticaLabel}>Días como miembro</Text>
            </View>
            
            <View style={styles.estadisticaCard}>
              <View style={styles.estadisticaIconContainer}>
                <MaterialIcons name="restaurant-menu" size={24} color="#D48689" />
              </View>
              <Text style={[styles.estadisticaNumero, { color: estadoMembresia.color }]}>
                {usuario.saldoPlatos}
              </Text>
              <Text style={styles.estadisticaLabel}>Menús restantes</Text>
            </View>
          </View>

          <View style={styles.vencimientoContainer}>
            <View style={styles.vencimientoHeader}>
              <MaterialIcons name="event" size={16} color="#5F98A6" />
              <Text style={styles.vencimientoLabel}>Próximo vencimiento</Text>
            </View>
            <Text style={styles.vencimientoTexto}>
              📅 {obtenerProximoVencimiento()}
            </Text>
          </View>
        </View>

        {/* Opciones de configuración mejoradas - Grid 2x2 CORREGIDO */}
        <View style={styles.opcionesCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="settings" size={20} color="#37738F" />
              <Text style={styles.cardTitle}>⚙️ Configuración</Text>
            </View>
          </View>

          <View style={styles.opcionesGrid}>
            {opcionesConfiguracion.map((opcion) => (
              <TouchableOpacity 
                key={opcion.id} 
                style={styles.opcionCard}
                onPress={() => handleOpcionClick(opcion.id)}
                activeOpacity={0.8}
              >
                <View style={styles.opcionHeader}>
                  <View style={[styles.opcionIcono, { backgroundColor: opcion.color }]}>
                    <MaterialIcons
                      name={opcion.icono as any}
                      size={20}
                      color="#FFF"
                    />
                  </View>
                  <Text style={styles.opcionEmoji}>{opcion.emoji}</Text>
                </View>
                
                <View style={styles.opcionContent}>
                  <Text style={styles.opcionTitulo}>{opcion.titulo}</Text>
                  <Text style={styles.opcionSubtitulo}>{opcion.subtitulo}</Text>
                </View>
                
                <View style={styles.opcionFooter}>
                  <MaterialIcons name="arrow-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información de la app mejorada */}
        <View style={styles.infoAppCard}>
          <View style={styles.infoAppHeader}>
            <MaterialIcons name="info-outline" size={24} color="#61B1BA" />
            <Text style={styles.cardTitle}>📱 Información de la App</Text>
          </View>
          
          <View style={styles.infoAppContent}>
            <View style={styles.infoAppItem}>
              <Text style={styles.infoAppLabel}>Versión</Text>
              <Text style={styles.infoAppValue}>1.0.0</Text>
            </View>
            <View style={styles.infoAppItem}>
              <Text style={styles.infoAppLabel}>Desarrollado por</Text>
              <Text style={styles.infoAppValue}>Restaurante Pensionados Bolivia</Text>
            </View>
            <View style={styles.infoAppItem}>
              <Text style={styles.infoAppLabel}>Copyright</Text>
              <Text style={styles.infoAppValue}>© 2025 Todos los derechos reservados</Text>
            </View>
          </View>
        </View>

        {/* Botón de cerrar sesión mejorado */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={20} color="#FFF" />
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
          <MaterialIcons name="exit-to-app" size={16} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de edición mejorado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarVisible}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <MaterialIcons name="edit" size={24} color="#37738F" />
                <Text style={styles.modalTitle}>✏️ Editar Perfil</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalEditarVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="person" size={14} color="#37738F" />
                  {" "}Nombre
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.nombre || ""}
                    onChangeText={(text) =>
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, nombre: text } : null
                      )
                    }
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor="#999"
                  />
                  <MaterialIcons name="person-outline" size={18} color="#61B1BA" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="family-restroom" size={14} color="#37738F" />
                  {" "}Apellidos
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.apellidos || ""}
                    onChangeText={(text) =>
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, apellidos: text } : null
                      )
                    }
                    placeholder="Ingresa tus apellidos"
                    placeholderTextColor="#999"
                  />
                  <MaterialIcons name="person-outline" size={18} color="#61B1BA" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="email" size={14} color="#37738F" />
                  {" "}Email
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.email || ""}
                    onChangeText={(text) =>
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, email: text } : null
                      )
                    }
                    placeholder="Ingresa tu email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <MaterialIcons name="email" size={18} color="#61B1BA" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="phone" size={14} color="#37738F" />
                  {" "}Teléfono
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.telefono || ""}
                    onChangeText={(text) =>
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, telefono: text } : null
                      )
                    }
                    placeholder="Ingresa tu teléfono"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                  <MaterialIcons name="phone" size={18} color="#61B1BA" />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalEditarVisible(false)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={18} color="#5F98A6" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={guardarCambios}
                activeOpacity={0.8}
              >
                <MaterialIcons name="save" size={18} color="#FFF" />
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEDD3",
  },
  header: {
    backgroundColor: "#37738F",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#37738F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#37738F",
  },
  statusEmoji: {
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
  },
  nombreUsuario: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 6,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 4,
  },
  tipoMiembro: {
    fontSize: 12,
    color: "#E8E6CD",
    fontWeight: "600",
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  perfilCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37738F",
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTexto: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#5F98A6",
    marginBottom: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: "#37738F",
    fontWeight: "500",
  },
  estadisticasCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoTexto: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  estadisticasGrid: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  estadisticaCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  estadisticaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  estadisticaNumero: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#61B1BA",
    marginBottom: 4,
  },
  estadisticaLabel: {
    fontSize: 11,
    color: "#5F98A6",
    textAlign: "center",
    fontWeight: "600",
  },
  vencimientoContainer: {
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#61B1BA",
  },
  vencimientoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  vencimientoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#37738F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  vencimientoTexto: {
    fontSize: 14,
    color: "#5F98A6",
    fontWeight: "500",
  },
  opcionesCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  // 🔥 ESTILOS CORREGIDOS PARA GRID 2x2 GARANTIZADO
  opcionesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  opcionCard: {
    width: "47%", // Un poco menos del 50% para dar espacio
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minHeight: 120,
    marginBottom: 12,
  },
  // 🔥 FIN DE CORRECCIÓN
  opcionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  opcionIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  opcionEmoji: {
    fontSize: 20,
  },
  opcionContent: {
    flex: 1,
    marginBottom: 8,
  },
  opcionTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#37738F",
    marginBottom: 4,
    lineHeight: 16,
  },
  opcionSubtitulo: {
    fontSize: 11,
    color: "#5F98A6",
    lineHeight: 14,
  },
  opcionFooter: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  infoAppCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  infoAppHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  infoAppContent: {
    gap: 12,
  },
  infoAppItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoAppLabel: {
    fontSize: 14,
    color: "#5F98A6",
    fontWeight: "500",
  },
  infoAppValue: {
    fontSize: 14,
    color: "#37738F",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C7362F",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#C7362F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal styles mejorados
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(55, 115, 143, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37738F",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#37738F",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8CDB8",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    color: "#37738F",
    paddingVertical: 12,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E8CDB8",
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#5F98A6",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#61B1BA",
    gap: 6,
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});