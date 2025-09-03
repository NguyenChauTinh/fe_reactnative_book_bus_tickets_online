import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SearchButton({
  departureLocation,
  destination,
  departureDate,
  returnDate,
  isRoundTrip,
  navigation,
  onDateSelect, // Added onDateSelect prop to pass to DateSelection screen
  onDepartureSelect, // Added onDepartureSelect prop
  onDestinationSelect, // Added onDestinationSelect prop
}) {
  const handleSearch = () => {
    // Check departure location first
    if (departureLocation != null && departureLocation.trim() === "") {
      navigation.navigate("DepartureScreen", {
        onSelect: onDepartureSelect,
      });
      return;
    }

    // Check destination
    if (destination != null && destination.trim() === "") {
      navigation.navigate("DestinationScreen", {
        onSelect: onDestinationSelect,
      });
      return;
    }

    // Check departure date
    if (departureDate == null || departureDate.trim() === "") {
      navigation.navigate("DateSelectionScreen", {
        departureLocation,
        destination,
        departureDate,
        returnDate,
        isRoundTrip,
        onSelect: onDateSelect, // Added missing onSelect parameter
      });
      return;
    }

    // Check return date for round trip
    if (isRoundTrip && (returnDate == null || returnDate.trim() === "")) {
      navigation.navigate("DateSelectionScreen", {
        departureLocation,
        destination,
        departureDate,
        returnDate,
        isRoundTrip,
        onSelect: onDateSelect, // Added missing onSelect parameter
      });
      return;
    }

    // All validation passed, proceed to search results
    navigation.navigate("SearchResultsScreen", {
      departureLocation,
      destination,
      departureDate,
      returnDate,
      isRoundTrip,
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSearch}>
      <Text style={styles.buttonText}>Tìm kiếm</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F1C40F",
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "600",
  },
});
