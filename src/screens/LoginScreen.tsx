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
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

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
    
    // Feedback visual
    Alert.alert(
      "✅ Credenciales Cargadas",
      `Se han cargado las credenciales de ${tipo === "paneton" ? "Paneton" : "Buñuelito"}. ¡Ya puedes iniciar sesión!`,
      [{ text: "Entendido" }]
    );
  };

  const getInputStyle = (inputName: string) => [
    styles.inputContainer,
    focusedInput === inputName && styles.inputFocused
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <MaterialIcons name="restaurant" size={40} color="#37738F" />
            <ActivityIndicator 
              size="large" 
              color="#61B1BA" 
              style={styles.loadingSpinner}
            />
          </View>
          <Text style={styles.loadingTitle}>Iniciando sesión...</Text>
          <Text style={styles.loadingSubtext}>Verificando credenciales</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFEDD3" />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header mejorado */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <MaterialIcons name="restaurant" size={48} color="#37738F" />
              </View>
              <View style={styles.logoAccent} />
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>🍽️ Restaurante</Text>
              <Text style={styles.titleAccent}>Pensionados</Text>
              <Text style={styles.subtitle}>
                Sistema especial para pensionados en Bolivia
              </Text>
              <View style={styles.welcomeBadge}>
                <MaterialIcons name="verified" size={16} color="#56A099" />
                <Text style={styles.welcomeText}>Bienvenido de vuelta</Text>
              </View>
            </View>
          </View>

          {/* Formulario de login mejorado */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Iniciar Sesión</Text>
              <Text style={styles.formSubtitle}>Accede a tu cuenta de pensionado</Text>
            </View>

            {/* Input de Email mejorado */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <MaterialIcons name="email" size={14} color="#37738F" />
                {" "}Correo Electrónico
              </Text>
              <View style={getInputStyle("email")}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="email" size={20} color="#5F98A6" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#999"
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
                    <MaterialIcons name="clear" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Input de Contraseña mejorado */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <MaterialIcons name="lock" size={14} color="#37738F" />
                {" "}Contraseña
              </Text>
              <View style={getInputStyle("password")}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="lock" size={20} color="#5F98A6" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#999"
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
                    color="#5F98A6"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón de login mejorado */}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <MaterialIcons name="login" size={20} color="#FFF" />
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o usa una cuenta demo</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botones de demo mejorados */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>
                🎭 Cuentas de Demostración
              </Text>
              <Text style={styles.demoSubtitle}>
                Prueba la aplicación con estas cuentas de ejemplo
              </Text>
              
              <View style={styles.demoCards}>
                <TouchableOpacity
                  style={styles.demoCard}
                  onPress={() => fillDemoCredentials("paneton")}
                  activeOpacity={0.8}
                >
                  <View style={styles.demoCardHeader}>
                    <View style={[styles.demoAvatar, { backgroundColor: "#E8F5E8" }]}>
                      <MaterialIcons name="person" size={24} color="#56A099" />
                    </View>
                    <View style={styles.demoBadge}>
                      <Text style={styles.demoBadgeText}>DEMO</Text>
                    </View>
                  </View>
                  <Text style={styles.demoCardName}>Paneton</Text>
                  <Text style={styles.demoCardDetails}>18 menús disponibles</Text>
                  <View style={styles.demoCardFooter}>
                    <MaterialIcons name="restaurant-menu" size={14} color="#5F98A6" />
                    <Text style={styles.demoCardStatus}>Activo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.demoCard}
                  onPress={() => fillDemoCredentials("carlos")}
                  activeOpacity={0.8}
                >
                  <View style={styles.demoCardHeader}>
                    <View style={[styles.demoAvatar, { backgroundColor: "#FFF3E0" }]}>
                      <MaterialIcons name="person" size={24} color="#D48689" />
                    </View>
                    <View style={styles.demoBadge}>
                      <Text style={styles.demoBadgeText}>DEMO</Text>
                    </View>
                  </View>
                  <Text style={styles.demoCardName}>Buñuelito</Text>
                  <Text style={styles.demoCardDetails}>25 menús disponibles</Text>
                  <View style={styles.demoCardFooter}>
                    <MaterialIcons name="restaurant-menu" size={14} color="#5F98A6" />
                    <Text style={styles.demoCardStatus}>Activo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer mejorado */}
          <View style={styles.footer}>
            <View style={styles.footerCard}>
              <MaterialIcons name="help-outline" size={20} color="#61B1BA" />
              <View style={styles.footerTextContainer}>
                <Text style={styles.footerTitle}>¿Necesitas ayuda?</Text>
                <Text style={styles.footerText}>
                  Contacta con el restaurante para obtener tu cuenta
                </Text>
              </View>
            </View>
            
            <View style={styles.footerInfo}>
              <Text style={styles.footerInfoText}>
                📱 Versión 1.0.0 • 🇧🇴 Hecho en Bolivia
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEDD3",
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEDD3",
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
    color: "#37738F",
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#5F98A6",
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
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#37738F",
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
    backgroundColor: "#61B1BA",
    borderWidth: 3,
    borderColor: "#EFEDD3",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#37738F",
    textAlign: "center",
  },
  titleAccent: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#61B1BA",
    textAlign: "center",
    marginTop: -4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5F98A6",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  welcomeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  welcomeText: {
    fontSize: 12,
    color: "#37738F",
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
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
    color: "#37738F",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#5F98A6",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#37738F",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8CDB8",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 4,
    height: 56,
  },
  inputFocused: {
    borderColor: "#61B1BA",
    backgroundColor: "#FFF",
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#37738F",
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
    backgroundColor: "#37738F",
    borderRadius: 12,
    height: 56,
    marginTop: 8,
    gap: 8,
    shadowColor: "#37738F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: "#FFF",
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
    backgroundColor: "#E8CDB8",
  },
  dividerText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  demoContainer: {
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#37738F",
    marginBottom: 4,
    textAlign: "center",
  },
  demoSubtitle: {
    fontSize: 13,
    color: "#5F98A6",
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
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8CDB8",
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
    backgroundColor: "#61B1BA",
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
    color: "#37738F",
    marginBottom: 2,
  },
  demoCardDetails: {
    fontSize: 12,
    color: "#5F98A6",
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
    color: "#56A099",
    fontWeight: "600",
  },
  footer: {
    gap: 16,
  },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
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
    color: "#37738F",
    marginBottom: 2,
  },
  footerText: {
    fontSize: 13,
    color: "#5F98A6",
    lineHeight: 18,
  },
  footerInfo: {
    alignItems: "center",
  },
  footerInfoText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});