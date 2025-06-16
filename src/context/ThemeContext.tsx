import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definición de colores para tema claro
export const lightTheme = {
  // Colores principales de tu paleta actual
  primary: '#37738F',        // Azul principal
  secondary: '#61B1BA',      // Turquesa
  tertiary: '#5F98A6',       // Azul turquesa
  
  // Backgrounds
  background: '#EFEDD3',     // Beige claro
  surface: '#E8E6CD',       // Beige más claro
  card: '#FFFFFF',          // Blanco para cards
  
  // Acentos y estados
  accent: '#56A099',        // Verde turquesa
  warning: '#D48689',       // Rosa coral
  error: '#C7362F',         // Rojo coral
  success: '#56A099',       // Verde turquesa
  
  // Textos
  text: '#37738F',          // Azul para texto principal
  textSecondary: '#5F98A6', // Azul turquesa para texto secundario
  textMuted: '#999999',     // Gris para texto deshabilitado
  textInverse: '#FFFFFF',   // Blanco para texto sobre fondos oscuros
  
  // Bordes y separadores
  border: '#E8DAC2',        // Beige más oscuro
  separator: '#F0F0F0',     // Gris muy claro
  
  // Específicos de la app
  tabBar: '#EFEDD3',        // Beige claro para barra inferior
  header: '#37738F',        // Azul para headers
  notification: '#FF6B35',  // Naranja para notificaciones
};

// Definición de colores para tema oscuro
export const darkTheme = {
  // Colores principales adaptados para modo oscuro
  primary: '#4A8BA3',        // Azul más claro
  secondary: '#7AC3CC',      // Turquesa más brillante
  tertiary: '#73A8B6',       // Azul turquesa más claro
  
  // Backgrounds oscuros
  background: '#1A1A1A',     // Negro suave
  surface: '#2D2D2D',       // Gris oscuro
  card: '#3A3A3A',          // Gris más claro para cards
  
  // Acentos y estados para modo oscuro
  accent: '#66B0A9',        // Verde turquesa más brillante
  warning: '#E49599',       // Rosa coral más suave
  error: '#D7453F',         // Rojo coral más brillante
  success: '#66B0A9',       // Verde turquesa más brillante
  
  // Textos para modo oscuro
  text: '#FFFFFF',          // Blanco para texto principal
  textSecondary: '#B0B0B0', // Gris claro para texto secundario
  textMuted: '#808080',     // Gris medio para texto deshabilitado
  textInverse: '#1A1A1A',   // Negro para texto sobre fondos claros
  
  // Bordes y separadores
  border: '#404040',        // Gris para bordes
  separator: '#333333',     // Gris oscuro para separadores
  
  // Específicos de la app en modo oscuro
  tabBar: '#2D2D2D',        // Gris oscuro para barra inferior
  header: '#4A8BA3',        // Azul más claro para headers
  notification: '#FF8C5A',  // Naranja más suave para notificaciones
};

export type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Detectar tema del sistema por defecto
  const systemColorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia guardada y configurar listener del sistema
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_preference');
        if (savedTheme !== null) {
          // Usuario tiene una preferencia guardada
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // No hay preferencia guardada, usar tema del sistema
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.log('Error cargando preferencia de tema:', error);
        // En caso de error, usar tema del sistema
        setIsDarkMode(systemColorScheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  // Escuchar cambios en el tema del sistema (solo si no hay preferencia guardada)
  useEffect(() => {
    const subscription = Appearance.addChangeListener(async ({ colorScheme }) => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_preference');
        // Solo cambiar automáticamente si no hay preferencia manual guardada
        if (savedTheme === null) {
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.log('Error verificando preferencia de tema:', error);
      }
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      // Guardar preferencia del usuario
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error guardando preferencia de tema:', error);
    }
  };

  const setTheme = async (isDark: boolean) => {
    try {
      setIsDarkMode(isDark);
      // Guardar preferencia del usuario
      await AsyncStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error guardando preferencia de tema:', error);
    }
  };

  // Función para resetear a tema del sistema
  const resetToSystemTheme = async () => {
    try {
      await AsyncStorage.removeItem('theme_preference');
      const currentSystemTheme = Appearance.getColorScheme();
      setIsDarkMode(currentSystemTheme === 'dark');
    } catch (error) {
      console.log('Error reseteando tema:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  // Mostrar un loading muy breve mientras carga la preferencia
  if (isLoading) {
    return null; // O un componente de loading si prefieres
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
