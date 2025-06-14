# Restaurante Pensionados App 🍽️

Una aplicación móvil desarrollada en React Native con Expo para un sistema de restaurante dirigido específicamente a clientes pensionados en Bolivia.

## 📱 Descripción

Esta aplicación permite a los pensionados (clientes que pagan por adelantado su comida mensualmente o por cierta cantidad de platos) acceder a un sistema especializado donde pueden:

- 🔐 Iniciar sesión con credenciales únicas
- 📊 Ver su dashboard con saldo de comidas/platos disponibles
- 🍽️ Explorar el menú del restaurante
- 📅 Hacer y gestionar reservas
- 👤 Administrar su perfil personal

## 🏗️ Arquitectura

- **Frontend**: React Native con Expo
- **Navegación**: React Navigation (Stack + Bottom Tabs)
- **Gestión de Estado**: Context API
- **Iconos**: @expo/vector-icons (Material Icons)
- **Estilo**: StyleSheet de React Native

## 📱 Pantallas Principales

### 🔐 Login
- Autenticación para pensionados
- Cuentas de demostración incluidas
- Interfaz amigable con validaciones

### 📊 Dashboard
- Saludo personalizado con fecha actual
- Información de saldo de comidas/platos
- Estadísticas del mes
- Acciones rápidas
- Información de contacto

### 🍽️ Menú
- Categorías de platos (Entradas, Principales, Bebidas, Postres)
- Información detallada de cada plato
- Indicadores de disponibilidad
- Platos populares destacados
- Sistema de pedidos para pensionados

### 📅 Reservas
- Crear nuevas reservas
- Ver reservas actuales
- Gestionar estado de reservas
- Cancelación de reservas
- Información importante para pensionados

### 👤 Perfil
- Información personal del usuario
- Estadísticas de membresía
- Configuración de la cuenta
- Opciones de soporte
- Cerrar sesión

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil o emulador para pruebas

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd restauranteTsx
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Ejecutar en dispositivo**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (requiere macOS)
   - **Web**: `npm run web`

## 🧪 Cuentas de Demostración

Para probar la aplicación, puedes usar estas cuentas:

### Pensionado por Menús
- **Email**: paneton@ejemplo.com
- **Contraseña**: 123456
- **Tipo**: Pensionado con 18 menús completos disponibles

### Pensionado por Menús
- **Email**: carlos@ejemplo.com
- **Contraseña**: 123456
- **Tipo**: Pensionado con 25 menús completos disponibles

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Context API para gestión de estado
│   └── AuthContext.tsx # Contexto de autenticación
├── navigation/         # Configuración de navegación
│   ├── AppNavigator.tsx
│   └── TabNavigator.tsx
└── screens/           # Pantallas principales
    ├── LoginScreen.tsx
    ├── DashboardScreen.tsx
    ├── MenuScreen.tsx
    ├── ReservasScreen.tsx
    └── PerfilScreen.tsx
```

## 🎨 Características de Diseño

- **Colores principales**: Naranja (#FF6B35) y grises
- **Tipografía**: Sistema nativo de cada plataforma
- **Iconografía**: Material Icons
- **Componentes**: Cards, botones redondeados, sombras sutiles
- **Responsive**: Adaptado para diferentes tamaños de pantalla

## 🔧 Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desarrollo
- **React Navigation**: Navegación entre pantallas
- **TypeScript**: Tipado estático (en archivos .tsx)
- **Context API**: Gestión de estado global
- **Material Icons**: Iconografía consistente

## 📋 Funcionalidades

### Sistema de Pensionados
- Dos tipos de membresía: Mensual y por Platos
- Seguimiento de saldo disponible
- Indicadores visuales de estado
- Historial de consumo

### Gestión de Reservas
- Crear reservas con fecha y hora específica
- Selección de número de personas
- Comentarios especiales
- Estado de reservas (confirmada, pendiente, cancelada)

### Menú Interactivo
- Categorización de platos
- Información nutricional y de ingredientes
- Tiempo de preparación
- Disponibilidad en tiempo real

## 🚧 Desarrollo Futuro

### Características Planificadas
- [ ] Integración con API backend real
- [ ] Notificaciones push
- [ ] Pagos en línea
- [ ] Historial detallado de comidas
- [ ] Sistema de calificación de platos
- [ ] Modo offline

### Mejoras Técnicas
- [ ] Implementación de tests unitarios
- [ ] Optimización de rendimiento
- [ ] Implementación de CI/CD
- [ ] Soporte para modo oscuro

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para soporte o consultas sobre el proyecto, contacta con el equipo de desarrollo.

---

**Nota**: Esta aplicación está diseñada específicamente para el contexto boliviano y el sistema de pensionados en restaurantes locales.
