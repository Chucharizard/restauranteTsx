import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNotifications } from "../context/NotificationsContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext"; // ✅ Agregar el hook de tema

const { width, height } = Dimensions.get("window");

export default function NotificationSidebar() {
  const {
    notificaciones,
    sidebarVisible,
    ocultarSidebar,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
  } = useNotifications();
  
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme(); // ✅ Usar el tema
  
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (sidebarVisible) {
      // Animación de entrada más suave y elegante
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 350,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animación de salida más rápida pero suave
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [sidebarVisible]);

  const handleNotificacionPress = (notificacion: any) => {
    // Marcar como leída
    if (!notificacion.leida) {
      marcarComoLeida(notificacion.id);
    }

    // Ejecutar acción si existe
    if (notificacion.accion) {
      if (notificacion.accion.tipo === "navegar" && notificacion.accion.destino) {
        ocultarSidebar();
        navigation.navigate(notificacion.accion.destino as never);
      }
    }
  };

  const formatearTiempo = (fecha: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 1) return "Ahora";
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    return `${dias}d`;
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "pedido": return "#56A099"; // Verde turquesa
      case "reserva": return theme.primary; // ✅ Usar color del tema
      case "saldo": return "#D47877"; // Rosa coral
      case "promocion": return "#C79591"; // Rojo suave
      default: return theme.tertiary; // ✅ Usar color del tema
    }
  };

  const getEmojiTipo = (tipo: string) => {
    switch (tipo) {
      case "pedido": return "🍽️";
      case "reserva": return "📅";
      case "saldo": return "💰";
      case "promocion": return "🎉";
      default: return "🔔";
    }
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "pedido": return "restaurant";
      case "reserva": return "event";
      case "saldo": return "account-balance-wallet";
      case "promocion": return "local-offer";
      default: return "notifications";
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  // Función para cerrar con animación suave
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      ocultarSidebar();
    });
  };

  // ✅ Crear estilos dinámicos basados en el tema
  const styles = createStyles(theme, isDarkMode);

  return (
    <Modal
      visible={sidebarVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={false}
    >
      {/* Backdrop con animación separada para más control */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity 
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Container principal con animación de slide */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {/* Sidebar animado */}
        <Animated.View 
          style={[
            styles.sidebar,
            {
              transform: [{ 
                translateX: slideAnim.interpolate({
                  inputRange: [0, width],
                  outputRange: [0, width],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}
        >
          {/* Indicador de swipe mejorado */}
          <Animated.View style={[
            styles.swipeIndicator,
            {
              opacity: overlayOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              })
            }
          ]}>
            <View style={styles.swipeHandle} />
          </Animated.View>

          <SafeAreaView style={styles.sidebarContent}>
            {/* Header del sidebar mejorado */}
            <Animated.View style={[
              styles.sidebarHeader,
              {
                opacity: overlayOpacity,
                transform: [{
                  translateY: overlayOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  })
                }]
              }
            ]}>
              <View style={styles.headerTop}>
                <View style={styles.headerTitleContainer}>
                  <View style={styles.headerIconContainer}>
                    <MaterialIcons name="notifications" size={28} color={theme.textInverse} />
                    {notificacionesNoLeidas > 0 && (
                      <Animated.View style={[
                        styles.headerNotificationBadge,
                        {
                          transform: [{
                            scale: overlayOpacity.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            })
                          }]
                        }
                      ]}>
                        <Text style={styles.headerNotificationBadgeText}>
                          {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
                        </Text>
                      </Animated.View>
                    )}
                  </View>
                  
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.sidebarTitle}>🔔 Notificaciones</Text>
                    <Text style={styles.sidebarSubtitle}>
                      {notificacionesNoLeidas > 0 
                        ? `${notificacionesNoLeidas} sin leer de ${notificaciones.length} total`
                        : `${notificaciones.length} notificaciones`
                      }
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="close" size={24} color={theme.textInverse} />
                </TouchableOpacity>
              </View>

              {/* Acciones rápidas */}
              {notificacionesNoLeidas > 0 && (
                <Animated.View style={[
                  styles.headerActions,
                  {
                    opacity: overlayOpacity,
                    transform: [{
                      translateY: overlayOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      })
                    }]
                  }
                ]}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={marcarTodasComoLeidas}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="done-all" size={16} color="#56A099" />
                    <Text style={styles.actionButtonText}>Marcar todas como leídas</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>

            {/* Lista de notificaciones con animación escalonada */}
            <Animated.View style={[
              styles.notificacionesList,
              {
                opacity: overlayOpacity,
                transform: [{
                  translateY: overlayOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                }]
              }
            ]}>
              <ScrollView 
                contentContainerStyle={styles.notificacionesListContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
              >
                {notificaciones.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                      <MaterialIcons name="notifications-none" size={80} color={theme.tertiary} />
                    </View>
                    <Text style={styles.emptyText}>📭 Sin notificaciones</Text>
                    <Text style={styles.emptySubtext}>
                      Te notificaremos sobre pedidos, reservas y promociones especiales
                    </Text>
                    
                    {/* Features esperadas */}
                    <View style={styles.emptyFeatures}>
                      <View style={styles.emptyFeature}>
                        <Text style={styles.emptyFeatureIcon}>🍽️</Text>
                        <Text style={styles.emptyFeatureText}>Confirmaciones de pedidos</Text>
                      </View>
                      <View style={styles.emptyFeature}>
                        <Text style={styles.emptyFeatureIcon}>📅</Text>
                        <Text style={styles.emptyFeatureText}>Recordatorios de reservas</Text>
                      </View>
                      <View style={styles.emptyFeature}>
                        <Text style={styles.emptyFeatureIcon}>🎉</Text>
                        <Text style={styles.emptyFeatureText}>Ofertas especiales</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  notificaciones.map((notificacion, index) => (
                    <Animated.View
                      key={notificacion.id}
                      style={[
                        {
                          opacity: overlayOpacity,
                          transform: [{
                            translateY: overlayOpacity.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20 + (index * 5), 0],
                            })
                          }]
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.notificacionCard,
                          !notificacion.leida && styles.notificacionNoLeida,
                          index === 0 && styles.notificacionCardFirst
                        ]}
                        onPress={() => handleNotificacionPress(notificacion)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.notificacionContent}>
                          {/* Icono mejorado con emoji + icono */}
                          <View style={styles.notificacionIconContainer}>
                            <View style={[
                              styles.notificacionIcon,
                              { 
                                backgroundColor: getColorTipo(notificacion.tipo) + "15",
                                borderColor: getColorTipo(notificacion.tipo) + "30"
                              }
                            ]}>
                              <Text style={styles.notificacionEmoji}>
                                {getEmojiTipo(notificacion.tipo)}
                              </Text>
                              <MaterialIcons 
                                name={getIconoTipo(notificacion.tipo) as any} 
                                size={16} 
                                color={getColorTipo(notificacion.tipo)}
                                style={styles.notificacionIconOverlay}
                              />
                            </View>
                            {!notificacion.leida && (
                              <View style={styles.unreadDot} />
                            )}
                          </View>

                          {/* Contenido principal */}
                          <View style={styles.notificacionTexto}>
                            <View style={styles.notificacionHeader}>
                              <Text style={[
                                styles.notificacionTitulo,
                                !notificacion.leida && styles.notificacionTituloNoLeida
                              ]}>
                                {notificacion.titulo}
                              </Text>
                              
                              <View style={styles.notificacionMeta}>
                                <Text style={styles.notificacionTiempo}>
                                  {formatearTiempo(notificacion.fecha)}
                                </Text>
                                {!notificacion.leida && (
                                  <View style={styles.unreadIndicator} />
                                )}
                              </View>
                            </View>
                            
                            <Text style={styles.notificacionMensaje}>
                              {notificacion.mensaje}
                            </Text>

                            {/* Acción si existe */}
                            {notificacion.accion && (
                              <View style={styles.notificacionAction}>
                                <MaterialIcons name="arrow-forward" size={12} color={getColorTipo(notificacion.tipo)} />
                                <Text style={[styles.notificacionActionText, { color: getColorTipo(notificacion.tipo) }]}>
                                  Tocar para ver más
                                </Text>
                              </View>
                            )}
                          </View>

                          {/* Botón eliminar mejorado */}
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              eliminarNotificacion(notificacion.id);
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={styles.deleteButtonContainer}>
                              <MaterialIcons name="close" size={16} color={theme.textMuted} />
                            </View>
                          </TouchableOpacity>
                        </View>

                        {/* Línea de progreso para no leídas */}
                        {!notificacion.leida && (
                          <View style={[
                            styles.progressLine,
                            { backgroundColor: getColorTipo(notificacion.tipo) }
                          ]} />
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  ))
                )}
              </ScrollView>
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ✅ Función para crear estilos dinámicos basados en el tema
const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  // Backdrop separado para mejor control
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)", // ✅ Dinámico
  },
  backdropTouch: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.88,
    maxWidth: 400,
    backgroundColor: theme.background, // ✅ Dinámico
    shadowColor: isDarkMode ? theme.primary : "#000", // ✅ Dinámico
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: isDarkMode ? 0.4 : 0.3, // ✅ Dinámico
    shadowRadius: 15,
    elevation: 20,
  },
  swipeIndicator: {
    position: "absolute",
    left: 8,
    top: "50%",
    transform: [{ translateY: -20 }],
    zIndex: 1000,
  },
  swipeHandle: {
    width: 4,
    height: 40,
    backgroundColor: theme.primary + "50", // ✅ Dinámico con transparencia
    borderRadius: 2,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    backgroundColor: theme.primary, // ✅ Dinámico
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    shadowColor: theme.primary, // ✅ Dinámico
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconContainer: {
    position: "relative",
    marginRight: 16,
  },
  headerNotificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#C7362F",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.primary, // ✅ Dinámico
  },
  headerNotificationBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.textInverse, // ✅ Dinámico
    marginBottom: 2,
  },
  sidebarSubtitle: {
    fontSize: 13,
    color: theme.accent, // ✅ Dinámico
    fontWeight: "500",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.accent, // ✅ Dinámico
  },
  notificacionesList: {
    flex: 1,
  },
  notificacionesListContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.surface, // ✅ Dinámico
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: theme.border, // ✅ Dinámico
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text, // ✅ Dinámico
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.textSecondary, // ✅ Dinámico
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyFeatures: {
    width: "100%",
    gap: 16,
  },
  emptyFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card, // ✅ Dinámico
    padding: 16,
    borderRadius: 12,
    shadowColor: isDarkMode ? theme.primary : "#000", // ✅ Dinámico
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border, // ✅ Dinámico
  },
  emptyFeatureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emptyFeatureText: {
    fontSize: 14,
    color: theme.text, // ✅ Dinámico
    fontWeight: "500",
    flex: 1,
  },
  notificacionCard: {
    backgroundColor: theme.card, // ✅ Dinámico
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: isDarkMode ? theme.primary : "#000", // ✅ Dinámico
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.15 : 0.08, // ✅ Dinámico
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: theme.border, // ✅ Dinámico
  },
  notificacionCardFirst: {
    marginTop: 0,
  },
  notificacionNoLeida: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary, // ✅ Dinámico
    backgroundColor: isDarkMode ? theme.surface : "#FAFBFF", // ✅ Dinámico
  },
  notificacionContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  notificacionIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  notificacionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
  },
  notificacionEmoji: {
    fontSize: 20,
    position: "absolute",
    top: -2,
    left: -2,
  },
  notificacionIconOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: theme.card, // ✅ Dinámico
    borderRadius: 8,
    padding: 1,
  },
  unreadDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C7362F",
    borderWidth: 2,
    borderColor: theme.card, // ✅ Dinámico
  },
  notificacionTexto: {
    flex: 1,
  },
  notificacionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  notificacionTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.text, // ✅ Dinámico
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  notificacionTituloNoLeida: {
    fontWeight: "bold",
    color: theme.primary, // ✅ Dinámico
  },
  notificacionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notificacionTiempo: {
    fontSize: 11,
    color: theme.textMuted, // ✅ Dinámico
    fontWeight: "500",
  },
  unreadIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.primary, // ✅ Dinámico
  },
  notificacionMensaje: {
    fontSize: 13,
    color: theme.textSecondary, // ✅ Dinámico
    lineHeight: 18,
    marginBottom: 8,
  },
  notificacionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  notificacionActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.surface, // ✅ Dinámico
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border, // ✅ Dinámico
  },
  progressLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.6,
  },
});

// 