import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style, 
  showLabel = true, 
  size = 'medium' 
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const translateX = useRef(new Animated.Value(isDarkMode ? 22 : 2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Configuraciones de tamaño
  const sizeConfig = {
    small: { width: 44, height: 24, buttonSize: 20, iconSize: 12, labelSize: 14 },
    medium: { width: 52, height: 28, buttonSize: 24, iconSize: 16, labelSize: 16 },
    large: { width: 60, height: 32, buttonSize: 28, iconSize: 18, labelSize: 18 },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDarkMode ? config.width - config.buttonSize - 2 : 2,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  }, [isDarkMode, config.width, config.buttonSize]);
  const handlePress = async () => {
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
  
  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <MaterialIcons 
            name={isDarkMode ? "dark-mode" : "light-mode"} 
            size={config.iconSize + 4} 
            color={theme.text} 
          />          <Text style={[styles.label, { color: theme.text, fontSize: config.labelSize }]}>
            {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
          </Text>
        </View>
      )}
      
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.toggleContainer,
            { 
              width: config.width,
              height: config.height,
              backgroundColor: isDarkMode ? theme.primary : theme.border,
              borderColor: theme.separator,
            }
          ]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              styles.toggleButton,
              {
                width: config.buttonSize,
                height: config.buttonSize,
                backgroundColor: theme.card,
                transform: [{ translateX }],
                shadowColor: isDarkMode ? theme.primary : '#000',
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
});
