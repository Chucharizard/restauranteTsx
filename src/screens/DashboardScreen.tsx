import React, { useCallback } from "react";
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
import { useNotifications } from "../context/NotificationsContext";
import { useTheme } from "../context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import NotificationSidebar from "../components/NotificationSidebar";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { usuario } = useAuth();
  const { notificacionesNoLeidas, toggleSidebar } = useNotifications();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();

  // Generar estilos dinámicos basados en el tema
  const styles = createStyles(theme);

  // 🔥 Funciones optimizadas con useCallback
  const handleAccionRapida = useCallback((accion: string) => {
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
  }, [navigation]);

  const handleSaldoClick = useCallback(() => {
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
  }, [handleAccionRapida]);

  const handleEstadisticaClick = useCallback((tipo: string) => {
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
  }, [navigation]);

  const handleContacto = useCallback(() => {
    Alert.alert(
      "📞 Contactar Restaurante",
      "Teléfono: +591 2 123-4567\n🕐 Horarios: Lun-Sáb 8:00 AM - 8:00 PM\n\n¿Deseas marcar el número?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Llamar", onPress: () => Alert.alert("📱 Función de llamada no implementada en demo") }
      ]
    );
  }, []);

  // 🔥 Función optimizada para notificaciones
  const handleNotificationPress = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

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
    if (saldo > 10) return "#56A099";
    if (saldo > 5) return "#D48689";
    return "#C7362F";
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
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "light-content"} 
        backgroundColor={theme.primary} 
        translucent={false}
        animated={true}
      />
      
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
          
          <View style={styles.headerActions}>
            {/* Botón de notificaciones mejorado */}
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotificationPress}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="notifications" size={24} color="#E8E6CD" />
              {notificacionesNoLeidas > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Avatar mejorado */}
            <TouchableOpacity 
              style={styles.avatarContainer}
              activeOpacity={0.8}
              onPress={() => Alert.alert("👤 Perfil", "Funcionalidad de perfil próximamente disponible")}
            >
              <View style={styles.avatarBackground}>
                <MaterialIcons name="person" size={32} color="#37738F" />
              </View>
              <View style={styles.statusIndicator} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ScrollView con optimizaciones */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
        bounces={true}
        bouncesZoom={false}
      >
        {/* Tarjeta de saldo principal */}
        <TouchableOpacity 
          style={[styles.saldoCard, { borderLeftColor: getColorEstado() }]}
          onPress={handleSaldoClick}
          activeOpacity={0.95}
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

        {/* Resto del contenido sin cambios */}
        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Resumen del Mes</Text>
            <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.8}>
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
                activeOpacity={0.9}
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
                activeOpacity={0.9}
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
            activeOpacity={0.9}
          >
            <MaterialIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.contactoButtonText}>Llamar ahora</Text>
            <MaterialIcons name="call" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>💡 ¿Sabías que...?</Text>
          <Text style={styles.footerText}>
            Como pensionado tienes descuentos especiales en menús extras y prioridad en reservas durante días festivos.
          </Text>
        </View>
      </ScrollView>
      
      {/* Sidebar de notificaciones */}
      <NotificationSidebar />
    </View>
  );
}

// 🔥 Función para generar estilos dinámicos basados en el tema
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
  saludoSection: {
    flex: 1,
  },
  saludo: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.textInverse,
    marginBottom: 4,
  },
  fechaHoy: {
    fontSize: 14,
    color: theme.surface,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: theme.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.primary,
  },
  notificationBadgeText: {
    color: theme.textInverse,
    fontSize: 10,
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.card,
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
    backgroundColor: theme.success,
    borderWidth: 2,
    borderColor: theme.card,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  saldoCard: {
    backgroundColor: theme.card,
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
    backgroundColor: theme.surface,
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
    color: theme.primary,
  },
  estadoTexto: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: "500",
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
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
    color: theme.text,
  },
  walletIcon: {
    opacity: 0.8,
  },
  saldoTexto: {
    fontSize: 16,
    color: theme.textMuted,
    textAlign: "center",
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.separator,
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
    color: theme.textMuted,
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
    color: theme.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.secondary,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    backgroundColor: theme.card,
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
    color: theme.text,
    marginBottom: 4,
    textAlign: "center",
  },
  statTitle: {
    fontSize: 11,
    color: theme.textMuted,
    textAlign: "center",
    fontWeight: "600",
  },
  statSubtitle: {
    fontSize: 10,
    color: theme.textMuted,
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
    backgroundColor: theme.card,
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
    color: theme.text,
    marginBottom: 4,
  },
  accionSubtitle: {
    fontSize: 12,
    color: theme.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  accionFooter: {
    alignItems: "flex-end",
  },
  contactoCard: {
    backgroundColor: theme.card,
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
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  contactoTextContainer: {
    flex: 1,
  },
  contactoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  contactoTexto: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 20,
  },
  contactoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.secondary,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: theme.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  contactoButtonText: {
    color: theme.textInverse,
    fontWeight: "bold",
    fontSize: 16,
  },
  footerCard: {
    backgroundColor: theme.surface,
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.secondary,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 6,
  },
  footerText: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
});