import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { usuario } = useAuth();
  const navigation = useNavigation();

  // Funciones de navegación para las acciones rápidas
  const handleAccionRapida = (accion: string) => {
    switch (accion) {
      case "Ver Menú":
        navigation.navigate("Menu" as never);
        break;
      case "Hacer Reserva":
        navigation.navigate("Reservas" as never);
        break;
      case "Mi Historial":
        Alert.alert(
          "📊 Historial de Comidas",
          "Aquí podrás ver tu historial completo de comidas consumidas.\n\n🚧 Funcionalidad próximamente disponible.",
          [{ text: "Entendido" }]
        );
        break;
      case "Recargar Saldo":
        Alert.alert(
          "💳 Recargar Saldo",
          "Para recargar tu saldo de menús, contacta con el restaurante o visita nuestras oficinas.\n\n📞 También puedes llamar para más información.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Llamar ahora", onPress: handleContacto }
          ]
        );
        break;
      default:
        break;
    }
  };

  // Función para mostrar detalles del saldo
  const handleSaldoClick = () => {
    const saldo = getSaldoNumero() || 0;
    let mensaje = `Tienes ${saldo} menús completos disponibles.\n\n`;
    
    if (saldo > 15) {
      mensaje += "🟢 Excelente saldo\nPuedes disfrutar sin preocupaciones.";
    } else if (saldo > 10) {
      mensaje += "🟡 Buen saldo\nTienes suficientes menús para las próximas semanas.";
    } else if (saldo > 5) {
      mensaje += "🟠 Saldo moderado\nConsidera recargar pronto.";
    } else {
      mensaje += "🔴 Saldo bajo\nTe recomendamos recargar tu membresía.";
    }

    Alert.alert(
      "💰 Detalles de tu Saldo",
      mensaje,
      [
        { text: "Recargar", onPress: () => handleAccionRapida("Recargar Saldo") },
        { text: "Cerrar" }
      ]
    );
  };

  // Función para manejar click en estadísticas
  const handleEstadisticaClick = (tipo: string) => {
    switch (tipo) {
      case "Menús este mes":
        Alert.alert(
          "🍽️ Menús Consumidos",
          "Has consumido 8 menús completos este mes.\n\nDesglose:\n🥣 Sopas: 8\n🍖 Segundos: 8\n🍰 Postres: 8",
          [{ text: "Entendido" }]
        );
        break;
      case "Reservas activas":
        navigation.navigate("Reservas" as never);
        break;
      case "Plato favorito":
        Alert.alert(
          "⭐ Tu Plato Favorito",
          "¡El Pique Macho es tu plato favorito!\n\n🏆 Lo has pedido 3 veces este mes. Un excelente plato tradicional boliviano.",
          [
            { text: "Ver Menú", onPress: () => navigation.navigate("Menu" as never) },
            { text: "Cerrar" }
          ]
        );
        break;
      default:
        break;
    }
  };

  const handleContacto = () => {
    Alert.alert(
      "📞 Contactar Restaurante",
      "Teléfono: +591 2 123-4567\n🕐 Horarios: Lun-Sáb 8:00 AM - 8:00 PM\n\n¿Deseas marcar el número?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Llamar", onPress: () => Alert.alert("📱 Función de llamada no implementada en demo") }
      ]
    );
  };

  const getTipoMembresiaTexto = () => {
    return "Pensionado por Menús";
  };

  const getSaldoTexto = () => {
    return `${usuario?.saldoPlatos} menús completos disponibles`;
  };

  const getSaldoNumero = () => {
    return usuario?.saldoPlatos;
  };

  const getColorEstado = () => {
    const saldo = getSaldoNumero() || 0;
    if (saldo > 10) return "#56A099"; // Verde turquesa
    if (saldo > 5) return "#D48689"; // Rosa coral
    return "#C7362F"; // Rojo coral
  };

  const getEstadoIcon = () => {
    const saldo = getSaldoNumero() || 0;
    if (saldo > 10) return "sentiment-very-satisfied";
    if (saldo > 5) return "sentiment-satisfied";
    return "sentiment-dissatisfied";
  };

  const statsData = [
    {
      icon: "restaurant-menu",
      title: "Menús este mes",
      value: "8",
      color: "#61B1BA",
      subtitle: "comidas",
    },
    {
      icon: "event",
      title: "Reservas activas",
      value: "2",
      color: "#D47877",
      subtitle: "pendientes",
    },
    {
      icon: "star",
      title: "Plato favorito",
      value: "Pique Macho",
      color: "#5F98A6",
      subtitle: "3 veces",
    },
  ];

  const accionesRapidas = [
    {
      icon: "restaurant",
      title: "Ver Menú",
      subtitle: "Platos disponibles hoy",
      color: "#56A099",
      emoji: "🍽️",
    },
    {
      icon: "event-available",
      title: "Hacer Reserva",
      subtitle: "Reserva tu mesa",
      color: "#37738F",
      emoji: "📅",
    },
    {
      icon: "history",
      title: "Mi Historial",
      subtitle: "Comidas anteriores",
      color: "#D47877",
      emoji: "📊",
    },
    {
      icon: "payment",
      title: "Recargar Saldo",
      subtitle: "Agregar más menús",
      color: "#5F98A6",
      emoji: "💳",
    },
  ];

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#37738F" />
      
      {/* Header estático mejorado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.saludoSection}>
            <Text style={styles.saludo}>{obtenerSaludo()}, {usuario?.nombre}! 👋</Text>
            <Text style={styles.fechaHoy}>
              {new Date().toLocaleDateString("es-BO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBackground}>
              <MaterialIcons name="person" size={32} color="#37738F" />
            </View>
            <View style={styles.statusIndicator} />
          </View>
        </View>
      </View>

      {/* ScrollView para el contenido */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tarjeta de saldo principal mejorada con mejor espaciado */}
        <TouchableOpacity 
          style={[styles.saldoCard, { borderLeftColor: getColorEstado() }]}
          onPress={handleSaldoClick}
          activeOpacity={0.9}
        >
          <View style={styles.saldoHeader}>
            <View style={styles.membershipInfo}>
              <View style={styles.membershipBadge}>
                <MaterialIcons name="verified" size={16} color="#56A099" />
                <Text style={styles.tipoMembresia}>{getTipoMembresiaTexto()}</Text>
              </View>
              <Text style={styles.estadoTexto}>Estado: Activo ✅</Text>
            </View>
            <View style={styles.walletIconContainer}>
              <MaterialIcons name={getEstadoIcon() as any} size={24} color={getColorEstado()} />
            </View>
          </View>

          <View style={styles.saldoContent}>
            <View style={styles.saldoDisplay}>
              <Text style={[styles.saldoNumero, { color: getColorEstado() }]}>
                {getSaldoNumero()}
              </Text>
              <MaterialIcons 
                name="account-balance-wallet" 
                size={32} 
                color={getColorEstado()} 
                style={styles.walletIcon}
              />
            </View>
            <Text style={styles.saldoTexto}>{getSaldoTexto()}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((getSaldoNumero() || 0) * 3.33, 100)}%`,
                    backgroundColor: getColorEstado(),
                  },
                ]}
              />
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {(getSaldoNumero() || 0) > 5
                  ? "🟢 Saldo suficiente"
                  : "🟠 Considera recargar pronto"}
              </Text>
              <MaterialIcons name="info" size={14} color="#999" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Estadísticas rápidas mejoradas */}
        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Resumen del Mes</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todo</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#61B1BA" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.statCard}
                onPress={() => handleEstadisticaClick(stat.title)}
                activeOpacity={0.8}
              >
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                  <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Acciones rápidas mejoradas */}
        <View style={styles.accionesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          </View>
          
          <View style={styles.accionesGrid}>
            {accionesRapidas.map((accion, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.accionCard}
                onPress={() => handleAccionRapida(accion.title)}
                activeOpacity={0.8}
              >
                <View style={styles.accionHeader}>
                  <View style={[styles.accionIcon, { backgroundColor: accion.color }]}>
                    <MaterialIcons name={accion.icon as any} size={20} color="#FFF" />
                  </View>
                  <Text style={styles.accionEmoji}>{accion.emoji}</Text>
                </View>
                <Text style={styles.accionTitle}>{accion.title}</Text>
                <Text style={styles.accionSubtitle}>{accion.subtitle}</Text>
                <View style={styles.accionFooter}>
                  <MaterialIcons name="arrow-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información de contacto mejorada */}
        <View style={styles.contactoCard}>
          <View style={styles.contactoHeader}>
            <View style={styles.contactoIconContainer}>
              <MaterialIcons name="support-agent" size={24} color="#61B1BA" />
            </View>
            <View style={styles.contactoTextContainer}>
              <Text style={styles.contactoTitle}>¿Necesitas ayuda? 🤝</Text>
              <Text style={styles.contactoTexto}>
                Contacta con el restaurante para cualquier consulta sobre tu membresía
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.contactoButton}
            onPress={handleContacto}
            activeOpacity={0.8}
          >
            <MaterialIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.contactoButtonText}>Llamar ahora</Text>
            <MaterialIcons name="call" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Footer informativo */}
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>💡 ¿Sabías que...?</Text>
          <Text style={styles.footerText}>
            Como pensionado tienes descuentos especiales en menús extras y prioridad en reservas durante días festivos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEDD3",
  },
  // Header estático (fuera del ScrollView)
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
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  saludoSection: {
    flex: 1,
  },
  saludo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  fechaHoy: {
    fontSize: 14,
    color: "#E8E6CD",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#56A099",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  // 🔥 ScrollContent con padding superior aumentado
  scrollContent: {
    paddingTop: 30, // 🔥 CAMBIO PRINCIPAL: Aumentado de 20 a 30
    paddingBottom: 20,
  },
  // 🔥 Tarjeta de saldo con margen superior corregido
  saldoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  saldoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
    gap: 6,
  },
  tipoMembresia: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#37738F",
  },
  estadoTexto: {
    fontSize: 13,
    color: "#5F98A6",
    fontWeight: "500",
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  saldoContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  saldoDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  saldoNumero: {
    fontSize: 56,
    fontWeight: "bold",
    lineHeight: 56,
  },
  walletIcon: {
    opacity: 0.8,
  },
  saldoTexto: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statsContainer: {
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37738F",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#61B1BA",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#FFF",
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  statTitle: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },
  statSubtitle: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 2,
  },
  accionesContainer: {
    margin: 20,
    marginTop: 0,
  },
  accionesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  accionCard: {
    backgroundColor: "#FFF",
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  accionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  accionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  accionEmoji: {
    fontSize: 24,
  },
  accionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  accionSubtitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 12,
  },
  accionFooter: {
    alignItems: "flex-end",
  },
  contactoCard: {
    backgroundColor: "#FFF",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  contactoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  contactoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  contactoTextContainer: {
    flex: 1,
  },
  contactoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  contactoTexto: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  contactoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#61B1BA",
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  contactoButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerCard: {
    backgroundColor: "#F0F8FF",
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#61B1BA",
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#37738F",
    marginBottom: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#5F98A6",
    lineHeight: 18,
  },
});