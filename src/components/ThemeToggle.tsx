import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// 🔧 Interfaces TypeScript corregidas
interface ThemeToggleProps {
  style?: ViewStyle; // ✅ Tipo específico en lugar de 'any'
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface SizeConfig {
  width: number;
  height: number;
  buttonSize: number;
  iconSize: number;
  labelSize: number;
}

interface SizeConfigs {
  small: SizeConfig;
  medium: SizeConfig;
  large: SizeConfig;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style, 
  showLabel = true, 
  size = 'medium' 
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const translateX = useRef(new Animated.Value(isDarkMode ? 22 : 2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // 🔧 Configuraciones de tamaño con tipos explícitos
  const sizeConfig: SizeConfigs = {
    small: { width: 44, height: 24, buttonSize: 20, iconSize: 12, labelSize: 14 },
    medium: { width: 52, height: 28, buttonSize: 24, iconSize: 16, labelSize: 16 },
    large: { width: 60, height: 32, buttonSize: 28, iconSize: 18, labelSize: 18 },
  };

  const config: SizeConfig = sizeConfig[size];

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDarkMode ? config.width - config.buttonSize - 2 : 2,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  }, [isDarkMode, config.width, config.buttonSize, translateX]);

  const handlePress = async (): Promise<void> => { // ✅ Tipo de retorno explícito
    // Animación de scale para feedback visual
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  // 🔧 Estilos dinámicos con tipos explícitos
  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  };

  const labelContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  };

  const labelStyles: TextStyle = {
    fontSize: config.labelSize,
    fontWeight: '500',
    marginLeft: 12,
    color: theme.text,
  };

  const toggleContainerStyles: ViewStyle = {
    width: config.width,
    height: config.height,
    borderRadius: config.height / 2,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: isDarkMode ? theme.primary : theme.border,
    borderColor: theme.border || '#E0E0E0', // ✅ Fallback para evitar undefined
  };

  const toggleButtonStyles: ViewStyle = {
    width: config.buttonSize,
    height: config.buttonSize,
    borderRadius: config.buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
    shadowColor: isDarkMode ? theme.primary : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  };
  
  return (
    <View style={[containerStyles, style]}>
      {showLabel && (
        <View style={labelContainerStyles}>
          <MaterialIcons 
            name={isDarkMode ? "dark-mode" : "light-mode"} 
            size={config.iconSize + 4} 
            color={theme.text} 
          />
          <Text style={labelStyles}>
            {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
          </Text>
        </View>
      )}
      
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={toggleContainerStyles}
          onPress={handlePress}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel={`Cambiar a ${isDarkMode ? 'modo claro' : 'modo oscuro'}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDarkMode }}
        >
          <Animated.View
            style={[
              toggleButtonStyles,
              {
                transform: [{ translateX }],
              }
            ]}
          >
            <MaterialIcons 
              name={isDarkMode ? "nights-stay" : "wb-sunny"} 
              size={config.iconSize} 
              color={isDarkMode ? theme.primary : '#FFB300'} 
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};



export default ThemeToggle;