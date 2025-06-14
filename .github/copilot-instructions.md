# Copilot Instructions - Restaurante Pensionados App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Este es un proyecto de React Native con Expo para una aplicación móvil de restaurante dirigida específicamente a clientes pensionados en Bolivia.

## Contexto del Sistema de Pensionados
- Los pensionados son clientes que pagan por adelantado su comida (mensualmente o cierta cantidad de platos)
- Tienen acceso especial al sistema a través de login
- Pueden ver su saldo de comidas/platos disponibles
- Pueden hacer reservas y ver el menú

## Arquitectura del Proyecto
- React Native con Expo
- Navegación con React Navigation (Stack + Bottom Tabs)
- Gestión de estado con Context API
- Pantallas principales: Login, Dashboard, Menú, Reservas, Perfil

## Convenciones de Código
- Usar componentes funcionales con hooks
- Comentarios en español
- Nombres de variables y funciones en español/inglés mixto
- Estilos con StyleSheet de React Native
- Iconos de @expo/vector-icons

## Características Específicas
- Sistema de autenticación para pensionados
- Dashboard con información de saldo de comidas
- Menú interactivo del restaurante
- Sistema de reservas
- Perfil del usuario pensionado
