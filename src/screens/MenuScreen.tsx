import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

interface PlatoMenu {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagen: string;
  ingredientes: string[];
  tiempo: string;
  popular: boolean;
}

const categorias = [
  { id: "todos", nombre: "Todos", icono: "restaurant" },
  { id: "menu-completo", nombre: "Menú del Día", icono: "lunch-dining" },
  { id: "sopas", nombre: "Sopas", icono: "local-dining" },
  { id: "segundos", nombre: "Segundos", icono: "dinner-dining" },
  { id: "postres", nombre: "Postres", icono: "cake" },
  { id: "extras", nombre: "Extras", icono: "local-offer" },
];

const platosMenu: PlatoMenu[] = [
  // Menú completo del día (Lo que incluye la pensión)
  {
    id: "menu-1",
    nombre: "Menú del Día",
    descripcion: "Menú completo: 1 sopa + 1 segundo + 1 postre a elegir",
    precio: 0, // Incluido en la pensión
    categoria: "menu-completo",
    disponible: true,
    imagen: "🍽️",
    ingredientes: [
      "1 Sopa a elegir",
      "1 Segundo a elegir",
      "1 Postre a elegir",
    ],
    tiempo: "30 min",
    popular: true,
  },

  // Sopas disponibles
  {
    id: "sopa-1",
    nombre: "Sopa de Maní",
    descripcion: "Sopa tradicional con maní, verduras y carne",
    precio: 0, // Incluido en menú
    categoria: "sopas",
    disponible: true,
    imagen: "🍲",
    ingredientes: ["Maní", "Carne", "Verduras", "Papa"],
    tiempo: "20 min",
    popular: true,
  },
  {
    id: "sopa-2",
    nombre: "Sopa de Quinua",
    descripcion: "Nutritiva sopa con quinua real y verduras",
    precio: 0, // Incluido en menú
    categoria: "sopas",
    disponible: true,
    imagen: "🥣",
    ingredientes: ["Quinua real", "Verduras", "Carne", "Apio"],
    tiempo: "25 min",
    popular: false,
  },

  // Segundos disponibles
  {
    id: "segundo-1",
    nombre: "Pique Macho",
    descripcion: "Plato tradicional con carne, papa, chorizo y verduras",
    precio: 0, // Incluido en menú
    categoria: "segundos",
    disponible: true,
    imagen: "🥩",
    ingredientes: ["Carne de res", "Papa", "Chorizo", "Huevo", "Tomate"],
    tiempo: "25 min",
    popular: true,
  },
  {
    id: "segundo-2",
    nombre: "Silpancho",
    descripcion: "Milanesa con arroz, papa, huevo frito y ensalada",
    precio: 0, // Incluido en menú
    categoria: "segundos",
    disponible: true,
    imagen: "🍽️", // Emoji corregido
    ingredientes: ["Milanesa", "Arroz", "Papa", "Huevo", "Ensalada"],
    tiempo: "20 min",
    popular: true,
  },
  {
    id: "segundo-3",
    nombre: "Fricase de Cerdo",
    descripcion: "Guiso tradicional de cerdo con mote y verduras",
    precio: 0, // Incluido en menú
    categoria: "segundos",
    disponible: true,
    imagen: "🍛",
    ingredientes: ["Carne de cerdo", "Mote", "Ají amarillo", "Cebolla"],
    tiempo: "30 min",
    popular: false,
  },

  // Postres disponibles
  {
    id: "postre-1",
    nombre: "Sopaipillas",
    descripcion: "Postre frito tradicional con miel de caña",
    precio: 0, // Incluido en menú
    categoria: "postres",
    disponible: true,
    imagen: "🍯", // Emoji corregido
    ingredientes: ["Harina", "Zapallo", "Miel de caña"],
    tiempo: "15 min",
    popular: true,
  },
  {
    id: "postre-2",
    nombre: "Helado de Canela",
    descripcion: "Helado artesanal con sabor a canela",
    precio: 0, // Incluido en menú
    categoria: "postres",
    disponible: true,
    imagen: "🍨",
    ingredientes: ["Leche", "Canela", "Azúcar", "Vainilla"],
    tiempo: "5 min",
    popular: false,
  },

  // Platos extras (tienen costo adicional)
  {
    id: "extra-1",
    nombre: "Salteñas (2 unidades)",
    descripcion: "Empanadas jugosas bolivianas - COSTO ADICIONAL",
    precio: 16,
    categoria: "extras",
    disponible: true,
    imagen: "🥟",
    ingredientes: ["Masa", "Carne", "Papa", "Arveja", "Caldo"],
    tiempo: "15 min",
    popular: true,
  },
  {
    id: "extra-2",
    nombre: "Api con Pastel",
    descripcion: "Bebida de maíz morado con pastel - COSTO ADICIONAL",
    precio: 12,
    categoria: "extras",
    disponible: true,
    imagen: "☕",
    ingredientes: ["Maíz morado", "Canela", "Clavo", "Pastel"],
    tiempo: "10 min",
    popular: false,
  },
  {
    id: "extra-3",
    nombre: "Refresco Natural",
    descripcion: "Bebida natural del día - COSTO ADICIONAL",
    precio: 8,
    categoria: "extras",
    disponible: true,
    imagen: "🥤",
    ingredientes: ["Fruta natural", "Agua", "Azúcar", "Hielo"],
    tiempo: "5 min",
    popular: false,
  },
];

export default function MenuScreen() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const { usuario } = useAuth();

  // Estado para el menú personalizado
  const [menuPersonalizado, setMenuPersonalizado] = useState({
    sopas: null as PlatoMenu | null,
    segundos: null as PlatoMenu | null,
    postres: null as PlatoMenu | null,
  });

  const platosFiltrados = platosMenu.filter(
    (plato) =>
      categoriaSeleccionada === "todos" ||
      plato.categoria === categoriaSeleccionada
  );

  // Crear el menú completo personalizado si tiene los 3 componentes
  const menuCompleto =
    menuPersonalizado.sopas &&
    menuPersonalizado.segundos &&
    menuPersonalizado.postres
      ? ({
          id: "menu-personalizado",
          nombre: "Mi Menú Personalizado",
          descripcion: `${menuPersonalizado.sopas.nombre} + ${menuPersonalizado.segundos.nombre} + ${menuPersonalizado.postres.nombre}`,
          precio: 0,
          categoria: "menu-completo",
          disponible: true,
          imagen: "🍽️",
          ingredientes: [
            `Sopa: ${menuPersonalizado.sopas.nombre}`,
            `Segundo: ${menuPersonalizado.segundos.nombre}`,
            `Postre: ${menuPersonalizado.postres.nombre}`,
          ],
          tiempo: "45 min",
          popular: true,
        } as PlatoMenu)
      : null;

  // Filtrar platos según categoría y agregar menú personalizado si corresponde
  const platosParaMostrar = (() => {
    let platos = platosFiltrados;

    if (categoriaSeleccionada === "menu-completo") {
      // Solo mostrar el menú básico y el personalizado (si existe)
      platos = platos.filter((p) => p.id === "menu-1");
      if (menuCompleto) {
        platos = [menuCompleto, ...platos];
      }
    }

    return platos;
  })();

  const seleccionarComponenteMenu = (plato: PlatoMenu) => {
    const tipo = plato.categoria as keyof typeof menuPersonalizado;

    Alert.alert(
      "Seleccionar para menú",
      `¿Deseas agregar ${plato.nombre} como ${tipo.slice(
        0,
        -1
      )} de tu menú personalizado?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Seleccionar",
          onPress: () => {
            setMenuPersonalizado((prev) => ({
              ...prev,
              [tipo]: plato,
            }));

            // Mensaje de confirmación
            const nuevoMenu = { ...menuPersonalizado, [tipo]: plato };
            const componentes = Object.values(nuevoMenu).filter(Boolean).length;

            if (componentes === 3) {
              Alert.alert(
                "¡Menú Completo! 🎉",
                'Has completado tu menú personalizado. Ve a la categoría "Menú del Día" para confirmarlo.',
                [
                  {
                    text: "Ver Menú",
                    onPress: () => setCategoriaSeleccionada("menu-completo"),
                  },
                ]
              );
            } else {
              Alert.alert(
                "Componente agregado",
                `${plato.nombre} agregado como ${tipo.slice(
                  0,
                  -1
                )}. Te faltan ${3 - componentes} componentes más.`
              );
            }
          },
        },
      ]
    );
  };

  const manejarPedido = (plato: PlatoMenu) => {
    if (!plato.disponible) {
      Alert.alert(
        "No disponible",
        "Este plato no está disponible en este momento"
      );
      return;
    }

    // Si es un componente individual (sopa, segundo, postre), permitir seleccionarlo para el menú
    if (["sopas", "segundos", "postres"].includes(plato.categoria)) {
      seleccionarComponenteMenu(plato);
      return;
    }

    if (plato.precio === 0) {
      // Es parte del menú incluido
      if (plato.categoria === "menu-completo") {
        if (plato.id === "menu-personalizado") {
          // Confirmar el menú personalizado
          Alert.alert(
            "Confirmar Mi Menú Personalizado",
            `¿Deseas ordenar tu menú personalizado?\n\n🍲 ${menuPersonalizado.sopas?.nombre}\n🍽️ ${menuPersonalizado.segundos?.nombre}\n🍰 ${menuPersonalizado.postres?.nombre}\n\nSe descontará 1 menú de tu saldo disponible.`,
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Confirmar",
                onPress: () => {
                  Alert.alert(
                    "¡Menú Confirmado! 🎉",
                    "Tu menú personalizado ha sido ordenado exitosamente."
                  );
                  // Limpiar selección para permitir crear un nuevo menú
                  setMenuPersonalizado({
                    sopas: null,
                    segundos: null,
                    postres: null,
                  });
                },
              },
            ]
          );
        } else {
          // Menú básico del día
          Alert.alert(
            "Confirmar Menú del Día",
            `¿Deseas ordenar el menú completo?\n\nEsto incluye:\n• 1 Sopa a elegir\n• 1 Segundo a elegir\n• 1 Postre a elegir\n\nSe descontará 1 menú de tu saldo disponible.`,
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Confirmar",
                onPress: () => {
                  Alert.alert(
                    "Menú confirmado",
                    "Tu menú del día ha sido ordenado. Ahora puedes elegir tus platos específicos."
                  );
                },
              },
            ]
          );
        }
      } else {
        Alert.alert(
          "Seleccionar plato",
          `¿Deseas elegir ${plato.nombre}?\n\nEste plato es parte de tu menú del día incluido.`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Elegir",
              onPress: () => {
                Alert.alert(
                  "Plato seleccionado",
                  `${plato.nombre} ha sido agregado a tu menú.`
                );
              },
            },
          ]
        );
      }
    } else {
      // Es un extra con costo adicional
      Alert.alert(
        "Confirmar Extra",
        `¿Deseas agregar ${plato.nombre}?\n\n💰 Costo adicional: Bs. ${plato.precio}\n\nEste plato tiene un costo extra y se cobrará por separado.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Agregar Extra",
            onPress: () => {
              Alert.alert(
                "Extra agregado",
                `${plato.nombre} ha sido agregado como extra por Bs. ${plato.precio}`
              );
            },
          },
        ]
      );
    }
  };

  const renderPlato = ({ item }: { item: PlatoMenu }) => (
    <TouchableOpacity
      style={[styles.platoCard, !item.disponible && styles.platoNoDisponible]}
      onPress={() => manejarPedido(item)}
      activeOpacity={0.9}
    >
      {/* Header de la tarjeta con imagen y info principal */}
      <View style={styles.platoHeader}>
        <View style={styles.platoImageContainer}>
          <Text style={styles.platoEmoji}>{item.imagen}</Text>
          {item.popular && (
            <View style={styles.popularBadgeTop}>
              <MaterialIcons name="star" size={14} color="#FFF" />
            </View>
          )}
          {/* Indicador de selección para menú personalizado */}
          {["sopas", "segundos", "postres"].includes(item.categoria) &&
            menuPersonalizado[item.categoria as keyof typeof menuPersonalizado]
              ?.id === item.id && (
              <View style={styles.seleccionadoBadge}>
                <MaterialIcons name="check" size={12} color="#FFF" />
              </View>
            )}
        </View>
        <View style={styles.platoInfo}>
          <View style={styles.platoTitleRow}>
            <Text
              style={[
                styles.platoNombre,
                !item.disponible && styles.textoNoDisponible,
              ]}
            >
              {item.nombre}
            </Text>
            <View
              style={[
                styles.precioBadge,
                item.precio === 0
                  ? styles.precioBadgeIncluido
                  : styles.precioBadgeExtra,
              ]}
            >
              <Text
                style={[
                  styles.precioText,
                  item.precio === 0
                    ? styles.precioTextIncluido
                    : styles.precioTextExtra,
                ]}
              >
                {item.precio === 0 ? "Incluido" : `Bs. ${item.precio}`}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.platoDescripcion,
              !item.disponible && styles.textoNoDisponible,
            ]}
          >
            {item.descripcion}
          </Text>

          {/* Meta información */}
          <View style={styles.platoMeta}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={14} color="#61B1BA" />
              <Text style={styles.metaText}>{item.tiempo}</Text>
            </View>
            {item.popular && (
              <View style={styles.metaItem}>
                <MaterialIcons name="trending-up" size={14} color="#D47877" />
                <Text style={styles.metaTextPopular}>Popular</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Ingredientes en formato más compacto */}
      <View style={styles.ingredientesContainer}>
        <View style={styles.ingredientesHeader}>
          <MaterialIcons name="restaurant" size={16} color="#5F98A6" />
          <Text style={styles.ingredientesTitle}>Ingredientes</Text>
        </View>
        <Text style={styles.ingredientesText}>
          {item.ingredientes.join(" • ")}
        </Text>
      </View>

      {/* Estado no disponible */}
      {!item.disponible && (
        <View style={styles.noDisponibleOverlay}>
          <View style={styles.noDisponibleBadge}>
            <MaterialIcons name="block" size={16} color="#F44336" />
            <Text style={styles.noDisponibleText}>No disponible</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#37738F" />
      
      {/* Header estático mejorado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextSection}>
            <Text style={styles.headerTitle}>🍽️ Menú del Día</Text>
            <Text style={styles.headerSubtitle}>
              Tienes {usuario?.saldoPlatos} menús disponibles
            </Text>
          </View>
          <View style={styles.headerIconSection}>
            <MaterialIcons name="restaurant" size={32} color="#E8E6CD" />
          </View>
        </View>

        {/* Indicador de progreso del menú personalizado */}
        {(menuPersonalizado.sopas ||
          menuPersonalizado.segundos ||
          menuPersonalizado.postres) && (
          <View style={styles.progresoMenuContainer}>
            <Text style={styles.progresoMenuTitulo}>
              Mi Menú Personalizado:
            </Text>
            <View style={styles.progresoMenuItems}>
              <View
                style={[
                  styles.progresoItem,
                  menuPersonalizado.sopas && styles.progresoItemCompleto,
                ]}
              >
                <MaterialIcons
                  name={
                    menuPersonalizado.sopas
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={16}
                  color={menuPersonalizado.sopas ? "#4CAF50" : "#FFE0D1"}
                />
                <Text style={styles.progresoTexto}>
                  {menuPersonalizado.sopas
                    ? menuPersonalizado.sopas.nombre
                    : "Sopa"}
                </Text>
              </View>
              <View
                style={[
                  styles.progresoItem,
                  menuPersonalizado.segundos && styles.progresoItemCompleto,
                ]}
              >
                <MaterialIcons
                  name={
                    menuPersonalizado.segundos
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={16}
                  color={menuPersonalizado.segundos ? "#4CAF50" : "#FFE0D1"}
                />
                <Text style={styles.progresoTexto}>
                  {menuPersonalizado.segundos
                    ? menuPersonalizado.segundos.nombre
                    : "Segundo"}
                </Text>
              </View>
              <View
                style={[
                  styles.progresoItem,
                  menuPersonalizado.postres && styles.progresoItemCompleto,
                ]}
              >
                <MaterialIcons
                  name={
                    menuPersonalizado.postres
                      ? "check-circle"
                      : "radio-button-unchecked"
                  }
                  size={16}
                  color={menuPersonalizado.postres ? "#4CAF50" : "#FFE0D1"}
                />
                <Text style={styles.progresoTexto}>
                  {menuPersonalizado.postres
                    ? menuPersonalizado.postres.nombre
                    : "Postre"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ScrollView con el contenido */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categorías mejoradas y más pequeñas */}
        <View style={styles.categoriasSection}>
          <View style={styles.categoriasSectionHeader}>
            <Text style={styles.categoriasSectionTitle}>Categorías</Text>
            {Object.values(menuPersonalizado).filter(Boolean).length < 3 && (
              <Text style={styles.instruccionesTexto}>
                {Object.values(menuPersonalizado).filter(Boolean).length === 0
                  ? "Selecciona 1 sopa, 1 segundo y 1 postre para crear tu menú"
                  : `Te faltan ${
                      3 - Object.values(menuPersonalizado).filter(Boolean).length
                    } platos`}
              </Text>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriasContainer}
            contentContainerStyle={styles.categoriasContent}
          >
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.categoriaButton,
                  categoriaSeleccionada === categoria.id &&
                    styles.categoriaSeleccionada,
                ]}
                onPress={() => setCategoriaSeleccionada(categoria.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.categoriaIconContainer,
                    categoriaSeleccionada === categoria.id &&
                      styles.categoriaIconContainerSelected,
                  ]}
                >
                  <MaterialIcons
                    name={categoria.icono as any}
                    size={18} // 🔥 Reducido de 24 a 18
                    color={
                      categoriaSeleccionada === categoria.id ? "#FF6B35" : "#666"
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.categoriaTexto,
                    categoriaSeleccionada === categoria.id &&
                      styles.categoriaTextoSeleccionada,
                  ]}
                >
                  {categoria.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de platos */}
        <View style={styles.platosContainer}>
          <FlatList
            data={platosParaMostrar}
            renderItem={renderPlato}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Deshabilitado porque está dentro del ScrollView principal
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEDD3",
  },
  // 🔥 Header estático (fuera del ScrollView)
  header: {
    backgroundColor: "#37738F",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  headerTextSection: {
    flex: 1,
  },
  headerIconSection: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E8E6CD",
    fontWeight: "500",
  },
  // 🔥 ScrollContent con padding superior aumentado
  scrollContent: {
    paddingTop: 20, // 🔥 Espacio del header
  },
  // 🔥 Categorías más pequeñas y compactas
  categoriasSection: {
    backgroundColor: "#FFF",
    paddingVertical: 16, // 🔥 Reducido de 20 a 16
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriasSectionTitle: {
    fontSize: 18, // 🔥 Reducido de 20 a 18
    fontWeight: "bold",
    color: "#37738F",
    marginBottom: 4,
  },
  categoriasSectionHeader: {
    marginHorizontal: 16, // 🔥 Reducido de 20 a 16
    marginBottom: 12, // 🔥 Reducido de 16 a 12
  },
  instruccionesTexto: {
    fontSize: 13, // 🔥 Reducido de 14 a 13
    color: "#5F98A6",
    fontStyle: "italic",
    marginTop: 4,
  },
  categoriasContainer: {
    paddingBottom: 4, // 🔥 Reducido de 20 a 4
  },
  categoriasContent: {
    paddingHorizontal: 16, // 🔥 Reducido de 20 a 16
  },
  categoriaButton: {
    alignItems: "center",
    paddingHorizontal: 12, // 🔥 Reducido de 16 a 12
    paddingVertical: 8, // 🔥 Reducido de 12 a 8
    marginRight: 8, // 🔥 Reducido de 12 a 8
    borderRadius: 12, // 🔥 Reducido de 16 a 12
    backgroundColor: "#E8E6CD",
    minWidth: 70, // 🔥 Reducido de 90 a 70
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoriaSeleccionada: {
    backgroundColor: "#61B1BA",
    borderColor: "#4B7D96",
    transform: [{ scale: 1.02 }],
    shadowColor: "#61B1BA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoriaIconContainer: {
    width: 32, // 🔥 Reducido de 40 a 32
    height: 32, // 🔥 Reducido de 40 a 32
    borderRadius: 16, // 🔥 Reducido de 20 a 16
    backgroundColor: "#E8CDB8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6, // 🔥 Reducido de 8 a 6
  },
  categoriaIconContainerSelected: {
    backgroundColor: "#E8DAC2",
  },
  categoriaTexto: {
    fontSize: 11, // 🔥 Reducido de 12 a 11
    color: "#37738F",
    fontWeight: "600",
    textAlign: "center",
  },
  categoriaTextoSeleccionada: {
    color: "#FFF",
    fontWeight: "700",
  },
  // 🔥 Container de platos ajustado
  platosContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  platoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  platoNoDisponible: {
    opacity: 0.7,
    backgroundColor: "#F8F8F8",
  },
  platoHeader: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  platoImageContainer: {
    position: "relative",
    marginRight: 16,
    alignItems: "center",
  },
  platoEmoji: {
    fontSize: 48,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  popularBadgeTop: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#D47877",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D47877",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  seleccionadoBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#56A099",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#56A099",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  platoInfo: {
    flex: 1,
  },
  platoTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  platoNombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37738F",
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  precioBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 70,
    alignItems: "center",
  },
  precioBadgeIncluido: {
    backgroundColor: "#E8E6CD",
    borderWidth: 1,
    borderColor: "#56A099",
  },
  precioBadgeExtra: {
    backgroundColor: "#E7B7A8",
    borderWidth: 1,
    borderColor: "#C7362F",
  },
  precioText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  precioTextIncluido: {
    color: "#56A099",
  },
  precioTextExtra: {
    color: "#C7362F",
  },
  platoDescripcion: {
    fontSize: 15,
    color: "#5F98A6",
    lineHeight: 22,
    marginBottom: 12,
  },
  platoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  metaTextPopular: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "600",
  },
  ingredientesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  ingredientesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  ingredientesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  ingredientesText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  noDisponibleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 248, 248, 0.9)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  noDisponibleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F44336",
    gap: 4,
  },
  noDisponibleText: {
    fontSize: 12,
    color: "#F44336",
    fontWeight: "600",
  },
  textoNoDisponible: {
    color: "#999",
  },
  // Estilos para el indicador de progreso del menú personalizado
  progresoMenuContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  progresoMenuTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFE0D1",
    marginBottom: 8,
  },
  progresoMenuItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progresoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  progresoItemCompleto: {
    opacity: 1,
  },
  progresoTexto: {
    fontSize: 12,
    color: "#FFE0D1",
    marginLeft: 4,
    flex: 1,
  },
});