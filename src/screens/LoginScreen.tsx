import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Importar el hook de tema
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { theme, isDarkMode } = useTheme(); // ✅ Usar el tema

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "⚠️ Campos Requeridos", 
        "Por favor ingresa tu email y contraseña para continuar"
      );
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert(
        "🔐 Error de Autenticación",
        "Email o contraseña incorrectos.\n\n💡 Para la demo usa:\n📧 Email: paneton@ejemplo.com o carlos@ejemplo.com\n🔑 Contraseña: 123456"
      );
    }
  };

  const fillDemoCredentials = (tipo: "paneton" | "carlos") => {
    if (tipo === "paneton") {
      setEmail("paneton@ejemplo.com");
    } else {
      setEmail("carlos@ejemplo.com");
    }
    setPassword("123456");
    
    Alert.alert(
      "✅ Credenciales Cargadas",
      `Se han cargado las credenciales de ${tipo === "paneton" ? "Paneton" : "Buñuelito"}. ¡Ya puedes iniciar sesión!`,
      [{ text: "Entendido" }]
    );
  };

  const getInputStyle = (inputName: string) => [
    [styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.surface }],
    focusedInput === inputName && [styles.inputFocused, { borderColor: theme.secondary, backgroundColor: theme.card }]
  ];

  // ✅ Crear estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    loadingContainer: {
      backgroundColor: theme.background,
    },
    loadingTitle: {
      color: theme.text,
    },
    loadingSubtext: {
      color: theme.textSecondary,
    },
    title: {
      color: theme.text,
    },
    titleAccent: {
      color: theme.secondary,
    },
    subtitle: {
      color: theme.textSecondary,
    },
    welcomeBadge: {
      backgroundColor: isDarkMode ? theme.surface : '#F0F8FF',
    },
    welcomeText: {
      color: theme.text,
    },
    formContainer: {
      backgroundColor: theme.card,
      shadowColor: isDarkMode ? theme.primary : '#000',
    },
    formTitle: {
      color: theme.text,
    },
    formSubtitle: {
      color: theme.textSecondary,
    },
    inputLabel: {
      color: theme.text,
    },
    inputIconContainer: {
      backgroundColor: isDarkMode ? theme.surface : '#F0F8FF',
    },
    input: {
      color: theme.text,
    },
    loginButton: {
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
    },
    demoTitle: {
      color: theme.text,
    },
    demoSubtitle: {
      color: theme.textSecondary,
    },
    demoCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    demoCardName: {
      color: theme.text,
    },
    demoCardDetails: {
      color: theme.textSecondary,
    },
    footerCard: {
      backgroundColor: theme.card,
      shadowColor: isDarkMode ? theme.primary : '#000',
    },
    footerTitle: {
      color: theme.text,
    },
    footerText: {
      color: theme.textSecondary,
    },
    dividerLine: {
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textMuted,
    },
    footerInfoText: {
      color: theme.textMuted,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, dynamicStyles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <MaterialIcons name="restaurant" size={40} color={theme.primary} />
            <ActivityIndicator 
              size="large" 
              color={theme.secondary} 
              style={styles.loadingSpinner}
            />
          </View>
          <Text style={[styles.loadingTitle, dynamicStyles.loadingTitle]}>Iniciando sesión...</Text>
          <Text style={[styles.loadingSubtext, dynamicStyles.loadingSubtext]}>Verificando credenciales</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoBackground, { backgroundColor: theme.card }]}>
                <MaterialIcons name="restaurant" size={48} color={theme.primary} />
              </View>
              <View style={[styles.logoAccent, { backgroundColor: theme.secondary, borderColor: theme.background }]} />
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={[styles.title, dynamicStyles.title]}>🍽️ Restaurante</Text>
              <Text style={[styles.titleAccent, dynamicStyles.titleAccent]}>Pensionados</Text>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
                Sistema especial para pensionados en Bolivia
              </Text>
              <View style={[styles.welcomeBadge, dynamicStyles.welcomeBadge]}>
                <MaterialIcons name="verified" size={16} color={theme.accent} />
                <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>Bienvenido de vuelta</Text>
              </View>
            </View>
          </View>

          {/* Formulario de login */}
          <View style={[styles.formContainer, dynamicStyles.formContainer]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, dynamicStyles.formTitle]}>Iniciar Sesión</Text>
              <Text style={[styles.formSubtitle, dynamicStyles.formSubtitle]}>Accede a tu cuenta de pensionado</Text>
            </View>

            {/* Input de Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                <MaterialIcons name="email" size={14} color={theme.primary} />
                {" "}Correo Electrónico
              </Text>
              <View style={getInputStyle("email")}>
                <View style={[styles.inputIconContainer, dynamicStyles.inputIconContainer]}>
                  <MaterialIcons name="email" size={20} color={theme.tertiary} />
                </View>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
                {email.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setEmail("")}
                    style={styles.clearButton}
                  >
                    <MaterialIcons name="clear" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Input de Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                <MaterialIcons name="lock" size={14} color={theme.primary} />
                {" "}Contraseña
              </Text>
              <View style={getInputStyle("password")}>
                <View style={[styles.inputIconContainer, dynamicStyles.inputIconContainer]}>
                  <MaterialIcons name="lock" size={20} color={theme.tertiary} />
                </View>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={theme.tertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón de login */}
            <TouchableOpacity 
              style={[styles.loginButton, dynamicStyles.loginButton]} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <MaterialIcons name="login" size={20} color={theme.textInverse} />
              <Text style={[styles.loginButtonText, { color: theme.textInverse }]}>Iniciar Sesión</Text>
              <MaterialIcons name="arrow-forward" size={20} color={theme.textInverse} />
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
              <Text style={[styles.dividerText, dynamicStyles.dividerText]}>o usa una cuenta demo</Text>
              <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
            </View>

            {/* Botones de demo */}
            <View style={styles.demoContainer}>
              <Text style={[styles.demoTitle, dynamicStyles.demoTitle]}>
                🎭 Cuentas de Demostración
              </Text>
              <Text style={[styles.demoSubtitle, dynamicStyles.demoSubtitle]}>
                Prueba la aplicación con estas cuentas de ejemplo
              </Text>
              
              <View style={styles.demoCards}>
                <TouchableOpacity
                  style={[styles.demoCard, dynamicStyles.demoCard]}
                  onPress={() => fillDemoCredentials("paneton")}
                  activeOpacity={0.8}
                >
                  <View style={styles.demoCardHeader}>
                    <View style={[styles.demoAvatar, { backgroundColor: isDarkMode ? theme.surface : "#E8F5E8" }]}>
                      <MaterialIcons name="person" size={24} color={theme.accent} />
                    </View>
                    <View style={[styles.demoBadge, { backgroundColor: theme.secondary }]}>
                      <Text style={styles.demoBadgeText}>DEMO</Text>
                    </View>
                  </View>
                  <Text style={[styles.demoCardName, dynamicStyles.demoCardName]}>Paneton</Text>
                  <Text style={[styles.demoCardDetails, dynamicStyles.demoCardDetails]}>18 menús disponibles</Text>
                  <View style={styles.demoCardFooter}>
                    <MaterialIcons name="restaurant-menu" size={14} color={theme.tertiary} />
                    <Text style={[styles.demoCardStatus, { color: theme.accent }]}>Activo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoCard, dynamicStyles.demoCard]}
                  onPress={() => fillDemoCredentials("carlos")}
                  activeOpacity={0.8}
                >
                  <View style={styles.demoCardHeader}>
                    <View style={[styles.demoAvatar, { backgroundColor: isDarkMode ? theme.surface : "#FFF3E0" }]}>
                      <MaterialIcons name="person" size={24} color={theme.warning} />
                    </View>
                    <View style={[styles.demoBadge, { backgroundColor: theme.secondary }]}>
                      <Text style={styles.demoBadgeText}>DEMO</Text>
                    </View>
                  </View>
                  <Text style={[styles.demoCardName, dynamicStyles.demoCardName]}>Buñuelito</Text>
                  <Text style={[styles.demoCardDetails, dynamicStyles.demoCardDetails]}>25 menús disponibles</Text>
                  <View style={styles.demoCardFooter}>
                    <MaterialIcons name="restaurant-menu" size={14} color={theme.tertiary} />
                    <Text style={[styles.demoCardStatus, { color: theme.accent }]}>Activo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={[styles.footerCard, dynamicStyles.footerCard]}>
              <MaterialIcons name="help-outline" size={20} color={theme.secondary} />
              <View style={styles.footerTextContainer}>
                <Text style={[styles.footerTitle, dynamicStyles.footerTitle]}>¿Necesitas ayuda?</Text>
                <Text style={[styles.footerText, dynamicStyles.footerText]}>
                  Contacta con el restaurante para obtener tu cuenta
                </Text>
              </View>
            </View>
            
            <View style={styles.footerInfo}>
              <Text style={[styles.footerInfoText, dynamicStyles.footerInfoText]}>
                📱 Versión 1.0.0 • 🇧🇴 Hecho en Bolivia
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ✅ Mantener solo los estilos que no dependen del tema
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingIconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  loadingSpinner: {
    position: "absolute",
    top: -10,
    left: -10,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoAccent: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleAccent: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  welcomeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 4,
    height: 56,
  },
  inputFocused: {
    // Los colores se manejan dinámicamente
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  eyeButton: {
    padding: 8,
    marginRight: 4,
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    height: 56,
    marginTop: 8,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "500",
  },
  demoContainer: {
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  demoSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
  },
  demoCards: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  demoCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  demoCardHeader: {
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  demoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  demoBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  demoBadgeText: {
    fontSize: 8,
    color: "#FFF",
    fontWeight: "bold",
  },
  demoCardName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  demoCardDetails: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  demoCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  demoCardStatus: {
    fontSize: 10,
    fontWeight: "600",
  },
  footer: {
    gap: 16,
  },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerInfo: {
    alignItems: "center",
  },
  footerInfoText: {
    fontSize: 12,
    textAlign: "center",
  },
});