import React, { useState, useMemo, useCallback } from "react";
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
  Switch,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth, UsuarioPensionado } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

const { width } = Dimensions.get("window");

// 🔧 Interfaces TypeScript
interface CustomAvatarProps {
  nombre: string;
  apellidos: string;
  size?: number;
}

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

interface ConfiguracionAvanzadaProps {
  theme: any;
}

interface ValidationErrors {
  [key: string]: string;
}

interface OpcionConfiguracion {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: string;
  color: string;
  emoji: string;
}

interface EstadoMembresia {
  texto: string;
  color: string;
  emoji: string;
  progreso: number;
}

// Componente Avatar Personalizado con tipos correctos
const CustomAvatar: React.FC<CustomAvatarProps> = ({ nombre, apellidos, size = 80 }) => {
  const getInitials = (): string => {
    const firstInitial = nombre?.charAt(0) || '';
    const lastInitial = apellidos?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const getAvatarColor = (): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const nameLength = (nombre + apellidos).length;
    return colors[nameLength % colors.length];
  };

  const avatarStyles: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getAvatarColor(),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  };

  const initialsStyles: TextStyle = {
    fontSize: size * 0.35,
    color: '#FFF',
    fontWeight: 'bold',
  };

  return (
    <View style={avatarStyles}>
      <Text style={initialsStyles}>
        {getInitials()}
      </Text>
    </View>
  );
};

// Componente de Progreso Circular con tipos correctos
const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  progress, 
  size = 60, 
  strokeWidth = 6, 
  color = '#61B1BA' 
}) => {
  const progressContainerStyles: ViewStyle = {
    width: size,
    height: size,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyles: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
    borderColor: '#E0E0E0',
    position: 'absolute',
  };

  const foregroundStyles: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
    borderColor: color,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  };

  const textStyles: TextStyle = {
    fontSize: size * 0.2,
    fontWeight: 'bold',
    color: '#666',
    position: 'absolute',
  };

  return (
    <View style={progressContainerStyles}>
      <View style={backgroundStyles} />
      <View style={foregroundStyles} />
      <Text style={textStyles}>{Math.round(progress)}%</Text>
    </View>
  );
};

// Componente de Configuración Avanzada con tipos correctos
const ConfiguracionAvanzada: React.FC<ConfiguracionAvanzadaProps> = ({ theme }) => {
  const [notificacionesActivas, setNotificacionesActivas] = useState<boolean>(true);
  const [recordatoriosComida, setRecordatoriosComida] = useState<boolean>(true);
  const [alertasSaldo, setAlertasSaldo] = useState<boolean>(true);

  const configCardStyles: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  };

  const configItemStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border || "rgba(0,0,0,0.05)",
  };

  const configInfoStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  };

  const configTextsStyles: ViewStyle = {
    marginLeft: 12,
    flex: 1,
  };

  const configTitleStyles: TextStyle = {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: theme.text,
  };

  const configSubtitleStyles: TextStyle = {
    fontSize: 12,
    lineHeight: 16,
    color: theme.textMuted,
  };

  const sectionTitleStyles: TextStyle = {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 4,
    color: theme.text,
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={sectionTitleStyles}>🔧 Configuración Avanzada</Text>
      
      <View style={configCardStyles}>
        <View style={configItemStyles}>
          <View style={configInfoStyles}>
            <MaterialIcons name="notifications-active" size={20} color="#61B1BA" />
            <View style={configTextsStyles}>
              <Text style={configTitleStyles}>Notificaciones Generales</Text>
              <Text style={configSubtitleStyles}>Recibir todas las notificaciones</Text>
            </View>
          </View>
          <Switch
            value={notificacionesActivas}
            onValueChange={setNotificacionesActivas}
            trackColor={{ false: '#E0E0E0', true: '#61B1BA' }}
            thumbColor={notificacionesActivas ? '#FFF' : '#F4F3F4'}
          />
        </View>

        <View style={configItemStyles}>
          <View style={configInfoStyles}>
            <MaterialIcons name="restaurant" size={20} color="#D48689" />
            <View style={configTextsStyles}>
              <Text style={configTitleStyles}>Recordatorios de Comida</Text>
              <Text style={configSubtitleStyles}>Avisos antes de las horas de comida</Text>
            </View>
          </View>
          <Switch
            value={recordatoriosComida}
            onValueChange={setRecordatoriosComida}
            trackColor={{ false: '#E0E0E0', true: '#D48689' }}
            thumbColor={recordatoriosComida ? '#FFF' : '#F4F3F4'}
            disabled={!notificacionesActivas}
          />
        </View>

        <View style={configItemStyles}>
          <View style={configInfoStyles}>
            <MaterialIcons name="warning" size={20} color="#F39C12" />
            <View style={configTextsStyles}>
              <Text style={configTitleStyles}>Alertas de Saldo Bajo</Text>
              <Text style={configSubtitleStyles}>Cuando queden menos de 5 menús</Text>
            </View>
          </View>
          <Switch
            value={alertasSaldo}
            onValueChange={setAlertasSaldo}
            trackColor={{ false: '#E0E0E0', true: '#F39C12' }}
            thumbColor={alertasSaldo ? '#FFF' : '#F4F3F4'}
            disabled={!notificacionesActivas}
          />
        </View>
      </View>
    </View>
  );
};

const PerfilScreen: React.FC = () => {
  const { usuario, logout, updateUsuario } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  // Estados con tipos explícitos
  const [modalEditarVisible, setModalEditarVisible] = useState<boolean>(false);
  const [usuarioEditado, setUsuarioEditado] = useState<UsuarioPensionado | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validaciones en tiempo real
  const validateField = useCallback((field: string, value: string): boolean => {
    const errors: ValidationErrors = {};
    
    switch (field) {
      case 'nombre':
        if (!value.trim()) errors.nombre = 'El nombre es requerido';
        else if (value.length < 2) errors.nombre = 'El nombre debe tener al menos 2 caracteres';
        break;
      case 'apellidos':
        if (!value.trim()) errors.apellidos = 'Los apellidos son requeridos';
        else if (value.length < 2) errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errors.email = 'El email es requerido';
        else if (!emailRegex.test(value)) errors.email = 'Formato de email inválido';
        break;
      case 'telefono':
        if (!value.trim()) errors.telefono = 'El teléfono es requerido';
        else if (value.length < 8) errors.telefono = 'El teléfono debe tener al menos 8 dígitos';
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  }, []);

  const handleLogout = useCallback((): void => {
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
  }, [logout]);

  const iniciarEdicion = useCallback((): void => {
    if (usuario) {
      setUsuarioEditado({ ...usuario });
      setValidationErrors({});
      setModalEditarVisible(true);
    }
  }, [usuario]);

  const guardarCambios = useCallback(async (): Promise<void> => {
    if (!usuarioEditado) return;

    // Validar todos los campos
    const camposValidos = [
      validateField('nombre', usuarioEditado.nombre),
      validateField('apellidos', usuarioEditado.apellidos),
      validateField('email', usuarioEditado.email),
      validateField('telefono', usuarioEditado.telefono),
    ];

    if (!camposValidos.every(Boolean)) {
      Alert.alert('❌ Error', 'Por favor corrige los errores antes de guardar');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateUsuario(usuarioEditado);
      setModalEditarVisible(false);
      
      Alert.alert(
        "✅ ¡Perfil actualizado!",
        "Tus datos han sido guardados exitosamente",
        [{ text: "Excelente", style: "default" }]
      );
    } catch (error) {
      Alert.alert(
        "❌ Error",
        "No se pudo actualizar el perfil. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, [usuarioEditado, validateField, updateUsuario]);

  const calcularDiasMiembro = useCallback((): number => {
    if (!usuario?.fechaRegistro) return 0;
    const fechaRegistro = new Date(usuario.fechaRegistro);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaRegistro.getTime();
    return Math.floor(diferencia / (1000 * 3600 * 24));
  }, [usuario?.fechaRegistro]);

  const calcularProgresoMensual = useCallback((): number => {
    const totalDiasEnMes = 30;
    const diasTranscurridos = new Date().getDate();
    return (diasTranscurridos / totalDiasEnMes) * 100;
  }, []);

  const obtenerProximoVencimiento = useCallback((): string => {
    if (!usuario?.fechaRegistro) return "No disponible";
    const fechaRegistro = new Date(usuario.fechaRegistro);
    const proximoVencimiento = new Date(fechaRegistro);
    proximoVencimiento.setMonth(proximoVencimiento.getMonth() + 1);

    return proximoVencimiento.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [usuario?.fechaRegistro]);

  const handleOpcionClick = useCallback((opcionId: string): void => {
    switch (opcionId) {
      case "historial":
        Alert.alert(
          "📊 Historial de Comidas",
          "Aquí podrás ver todo tu historial:\n\n• Últimas 30 comidas\n• Comidas favoritas\n• Estadísticas mensuales\n• Tendencias de consumo\n\n🚧 Funcionalidad en desarrollo",
          [{ text: "Entendido" }]
        );
        break;
      case "pagos":
        Alert.alert(
          "💳 Gestión de Pagos",
          "Funciones disponibles:\n\n• Ver historial de pagos\n• Recargar saldo\n• Configurar auto-recarga\n• Descargar recibos\n\n🚧 Próximamente disponible",
          [{ text: "Entendido" }]
        );
        break;
      case "ayuda":
        Alert.alert(
          "🆘 Centro de Ayuda",
          "¿Cómo podemos ayudarte?\n\n📞 Teléfono: +591 2 123-4567\n📧 Email: soporte@restaurante.com\n💬 Chat: Lun-Sáb 8:00-20:00\n🌐 Web: www.restaurante.com/ayuda",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Contactar", onPress: () => Alert.alert("📱 Redirigiendo al centro de contacto...") }
          ]
        );
        break;
      case "privacidad":
        Alert.alert(
          "🔒 Privacidad y Seguridad",
          "Configuraciones disponibles:\n\n• Cambiar contraseña\n• Configurar autenticación\n• Gestionar permisos\n• Políticas de privacidad\n\n🚧 En desarrollo",
          [{ text: "Entendido" }]
        );
        break;
    }
  }, []);

  const opcionesConfiguracion: OpcionConfiguracion[] = useMemo(() => [
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
      titulo: "Gestión de Pagos",
      subtitulo: "Pagos y recargas",
      icono: "payment",
      color: "#D48689",
      emoji: "💳",
    },
    {
      id: "ayuda",
      titulo: "Centro de Ayuda",
      subtitulo: "Soporte y contacto",
      icono: "help",
      color: "#61B1BA",
      emoji: "🆘",
    },
    {
      id: "privacidad",
      titulo: "Privacidad",
      subtitulo: "Seguridad de datos",
      icono: "security",
      color: "#8A2BE2",
      emoji: "🔒",
    },
  ], []);

  const getEstadoMembresia = useCallback((): EstadoMembresia => {
    const saldo = usuario?.saldoPlatos || 0;
    if (saldo > 15) return { texto: "Excelente", color: "#56A099", emoji: "🟢", progreso: 100 };
    if (saldo > 10) return { texto: "Bueno", color: "#61B1BA", emoji: "🟡", progreso: 75 };
    if (saldo > 5) return { texto: "Regular", color: "#D48689", emoji: "🟠", progreso: 50 };
    return { texto: "Bajo", color: "#C7362F", emoji: "🔴", progreso: 25 };
  }, [usuario?.saldoPlatos]);

  const estadoMembresia = useMemo(() => getEstadoMembresia(), [getEstadoMembresia]);
  const progresoMensual = useMemo(() => calcularProgresoMensual(), [calcularProgresoMensual]);
  const diasMiembro = useMemo(() => calcularDiasMiembro(), [calcularDiasMiembro]);
  const proximoVencimiento = useMemo(() => obtenerProximoVencimiento(), [obtenerProximoVencimiento]);

  if (!usuario) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      
      {/* Header mejorado con avatar personalizado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <CustomAvatar nombre={usuario.nombre} apellidos={usuario.apellidos} size={80} />
              <View style={styles.statusIndicator}>
                <Text style={styles.statusEmoji}>{estadoMembresia.emoji}</Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.nombreUsuario}>
                👋 {usuario.nombre} {usuario.apellidos}
              </Text>
              <View style={styles.membershipBadge}>
                <MaterialIcons name="verified" size={16} color={theme.accent} />
                <Text style={styles.tipoMiembro}>Pensionado Verificado</Text>
              </View>
              <Text style={styles.userSubtitle}>
                Miembro desde {new Date(usuario.fechaRegistro).getFullYear()}
              </Text>
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
        {/* Estadísticas mejoradas con progreso visual */}
        <View style={styles.estadisticasCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>              
              <MaterialIcons name="analytics" size={20} color={theme.primary} />
              <Text style={styles.cardTitle}>📊 Dashboard Personal</Text>
            </View>
            <View style={[styles.estadoBadge, { backgroundColor: estadoMembresia.color }]}>
              <Text style={styles.estadoTexto}>{estadoMembresia.texto}</Text>
            </View>
          </View>

          <View style={styles.estadisticasGrid}>
            <View style={styles.estadisticaCard}>
              <ProgressCircle progress={estadoMembresia.progreso} color={estadoMembresia.color} />
              <Text style={[styles.estadisticaNumero, { color: estadoMembresia.color }]}>
                {usuario.saldoPlatos}
              </Text>
              <Text style={styles.estadisticaLabel}>Menús restantes</Text>
            </View>
            
            <View style={styles.estadisticaCard}>
              <ProgressCircle progress={progresoMensual} color="#61B1BA" />
              <Text style={[styles.estadisticaNumero, { color: '#61B1BA' }]}>
                {diasMiembro}
              </Text>
              <Text style={styles.estadisticaLabel}>Días como miembro</Text>
            </View>
          </View>

          <View style={styles.vencimientoContainer}>
            <View style={styles.vencimientoHeader}>
              <MaterialIcons name="event" size={16} color="#5F98A6" />
              <Text style={styles.vencimientoLabel}>Próximo vencimiento</Text>
            </View>
            <Text style={styles.vencimientoTexto}>
              📅 {proximoVencimiento}
            </Text>
          </View>
        </View>

        {/* Información del perfil */}
        <View style={styles.perfilCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>              
              <MaterialIcons name="person-outline" size={20} color={theme.primary} />
              <Text style={styles.cardTitle}>👤 Información Personal</Text>
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

        {/* Configuración de Apariencia */}
        <View style={styles.opcionesCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>              
              <MaterialIcons name="palette" size={20} color={theme.primary} />
              <Text style={styles.cardTitle}>🎨 Apariencia</Text>
            </View>
          </View>
          
          <View style={styles.temaContainer}>
            <ThemeToggle />
          </View>
        </View>

        {/* Configuración Avanzada */}
        <ConfiguracionAvanzada theme={theme} />

        {/* Opciones de configuración */}
        <View style={styles.opcionesCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>              
              <MaterialIcons name="settings" size={20} color={theme.primary} />
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

        {/* Información de la app */}
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
              <Text style={styles.infoAppLabel}>Última actualización</Text>
              <Text style={styles.infoAppValue}>16 Jun 2025</Text>
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

        {/* Botón de cerrar sesión */}
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

      {/* Modal de edición */}
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
                <MaterialIcons name="edit" size={24} color={theme.primary} />
                <Text style={styles.modalTitle}>✏️ Editar Perfil</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalEditarVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Preview del Avatar */}
              <View style={styles.avatarPreview}>
                <Text style={styles.previewLabel}>Vista previa</Text>
                <CustomAvatar 
                  nombre={usuarioEditado?.nombre || usuario.nombre} 
                  apellidos={usuarioEditado?.apellidos || usuario.apellidos} 
                  size={60} 
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="person" size={14} color={theme.primary} />
                  <Text> Nombre *</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  { borderColor: validationErrors.nombre ? '#C7362F' : theme.border }
                ]}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.nombre || ""}
                    onChangeText={(text) => {
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, nombre: text } : null
                      );
                      validateField('nombre', text);
                    }}
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor={theme.textMuted}
                  />
                  <MaterialIcons name="person-outline" size={18} color="#61B1BA" />
                </View>
                {validationErrors.nombre && (
                  <Text style={styles.errorText}>{validationErrors.nombre}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="family-restroom" size={14} color={theme.primary} />
                  <Text> Apellidos *</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  { borderColor: validationErrors.apellidos ? '#C7362F' : theme.border }
                ]}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.apellidos || ""}
                    onChangeText={(text) => {
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, apellidos: text } : null
                      );
                      validateField('apellidos', text);
                    }}
                    placeholder="Ingresa tus apellidos"
                    placeholderTextColor={theme.textMuted}
                  />
                  <MaterialIcons name="person-outline" size={18} color="#61B1BA" />
                </View>
                {validationErrors.apellidos && (
                  <Text style={styles.errorText}>{validationErrors.apellidos}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="email" size={14} color={theme.primary} />
                  <Text> Email *</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  { borderColor: validationErrors.email ? '#C7362F' : theme.border }
                ]}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.email || ""}
                    onChangeText={(text) => {
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, email: text } : null
                      );
                      validateField('email', text);
                    }}
                    placeholder="Ingresa tu email"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <MaterialIcons name="email" size={18} color="#61B1BA" />
                </View>
                {validationErrors.email && (
                  <Text style={styles.errorText}>{validationErrors.email}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <MaterialIcons name="phone" size={14} color={theme.primary} />
                  <Text> Teléfono *</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  { borderColor: validationErrors.telefono ? '#C7362F' : theme.border }
                ]}>
                  <TextInput
                    style={styles.formInput}
                    value={usuarioEditado?.telefono || ""}
                    onChangeText={(text) => {
                      setUsuarioEditado((prev) =>
                        prev ? { ...prev, telefono: text } : null
                      );
                      validateField('telefono', text);
                    }}
                    placeholder="Ingresa tu teléfono"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                  />
                  <MaterialIcons name="phone" size={18} color="#61B1BA" />
                </View>
                {validationErrors.telefono && (
                  <Text style={styles.errorText}>{validationErrors.telefono}</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalEditarVisible(false)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={18} color={theme.textMuted} />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { opacity: isLoading ? 0.7 : 1 }]}
                onPress={guardarCambios}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.saveButtonText}>Guardando...</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="save" size={18} color="#FFF" />
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔧 Función createStyles con tipos explícitos y CORRECTA IDENTACIÓN
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
  userSubtitle: {
    fontSize: 12,
    marginTop: 2,
    color: 'rgba(255,255,255,0.8)',
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
    marginBottom: 4,
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
    backgroundColor: theme.card,
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
    color: theme.text,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTexto: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "500",
  },
  estadisticasCard: {
    backgroundColor: theme.card,
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
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  estadisticaNumero: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#61B1BA",
    marginTop: 8,
    marginBottom: 4,
  },
  estadisticaLabel: {
    fontSize: 11,
    color: theme.textMuted,
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
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  opcionesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  opcionCard: {
    width: "47%",
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 120,
    marginBottom: 12,
  },
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
    color: theme.text,
    marginBottom: 4,
    lineHeight: 16,
  },
  opcionSubtitulo: {
    fontSize: 11,
    color: theme.textMuted,
    lineHeight: 14,
  },
  opcionFooter: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  infoAppCard: {
    backgroundColor: theme.card,
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
  temaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(97, 177, 186, 0.1)',
    borderRadius: 12,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: theme.text,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 8,
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
    fontSize: 16,
    color: theme.text,
    paddingVertical: 12,
  },
  errorText: {
    color: '#C7362F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.textMuted,
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
  loadingSpinner: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#FFF',
    borderTopColor: 'transparent',
    borderRadius: 9,
  },
});

export default PerfilScreen;