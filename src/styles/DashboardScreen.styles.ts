import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEDD3", // Beige claro
  },
  header: {
    backgroundColor: "#37738F", // Azul principal
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#E8E6CD", // Beige más claro
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EFEDD3", // Beige claro
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // Tarjeta de saldo
  saldoCard: {
    backgroundColor: "#E8E6CD", // Beige claro
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#37738F",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  saldoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tipoMembresia: {
    fontSize: 14,
    color: "#5F98A6", // Azul turquesa
    fontWeight: "500",
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#EFEDD3", // Beige claro
  },
  saldoNumero: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 8,
  },
  saldoTexto: {
    fontSize: 16,
    color: "#5F98A6", // Azul turquesa
  },
  // Estadísticas
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37738F", // Azul principal
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#E8E6CD", // Beige claro
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#37738F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37738F", // Azul principal
  },
  statTitle: {
    fontSize: 12,
    color: "#5F98A6", // Azul turquesa
    textAlign: "center",
    marginTop: 4,
  },
  // Acciones rápidas
  accionesContainer: {
    marginBottom: 24,
  },
  accionesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  accionButton: {
    backgroundColor: "#E8E6CD", // Beige claro
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#37738F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  accionTexto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#37738F", // Azul principal
    textAlign: "center",
  },
  // Información adicional
  infoCard: {
    backgroundColor: "#E8E6CD", // Beige claro
    borderRadius: 12,
    padding: 16,
    shadowColor: "#37738F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#37738F", // Azul principal
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#5F98A6", // Azul turquesa
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#61B1BA", // Turquesa
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  contactText: {
    color: "#EFEDD3", // Beige claro
    fontWeight: "500",
    marginLeft: 8,
  },
});
