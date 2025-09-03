import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import DepartureIcon from "./icons/DepartureIcon"
import DestinationIcon from "./icons/DestinationIcon"
import ArrowRightIcon from "./icons/ArrowRightIcon"

export default function RecentSearches() {
  const searches = [
    {
      from: "Hồ Chí Minh",
      to: "An Giang",
      date: "T7, 30/08/2025",
    },
    {
      from: "Hồ Chí Minh",
      to: "An Giang",
      date: "T3, 02/09/2025",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tìm kiếm gần đây</Text>
        <TouchableOpacity>
          <Text style={styles.clearAll}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {searches.map((search, index) => (
        <TouchableOpacity key={index} style={styles.searchItem}>
          <View style={styles.routeContainer}>
            <View style={styles.locationContainer}>
              <DepartureIcon size={16} />
              <Text style={styles.locationText}>{search.from}</Text>
            </View>

            <ArrowRightIcon />

            <View style={styles.locationContainer}>
              <DestinationIcon size={16} />
              <Text style={styles.locationText}>{search.to}</Text>
            </View>
          </View>

          <Text style={styles.dateText}>{search.date}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  clearAll: {
    fontSize: 14,
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  searchItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: "#2C3E50",
    marginLeft: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
})
