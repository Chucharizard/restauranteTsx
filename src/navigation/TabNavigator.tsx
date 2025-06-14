import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import MenuScreen from "../screens/MenuScreen";
import ReservasScreen from "../screens/ReservasScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case "Dashboard":
              iconName = "dashboard";
              break;
            case "Menu":
              iconName = "restaurant-menu";
              break;
            case "Reservas":
              iconName = "event";
              break;
            case "Perfil":
              iconName = "person";
              break;
            default:
              iconName = "help";
          }

          return (
            <MaterialIcons name={iconName as any} size={size} color={color} />
          );
        },        tabBarActiveTintColor: "#37738F", // Azul principal de la paleta
        tabBarInactiveTintColor: "#C79591", // Rojo/naranja suave
        tabBarStyle: {
          backgroundColor: "#EFEDD3", // Beige claro
          borderTopWidth: 1,
          borderTopColor: "#E8DAC2", // Beige más oscuro
          paddingVertical: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Inicio",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: "Menú",
        }}
      />
      <Tab.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{
          tabBarLabel: "Reservas",
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}
