import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Location = {
  _id: string;
  tenDiaDiem: string;
};
type SearchButtonProps = {
  departureLocation: Location | null;
  destination: Location | null;
  departureDate: string | null;
  returnDate: string | null;
  isRoundTrip: boolean;
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
  onDateSelect: (date: string) => void;
  onDepartureSelect: (location: Location) => void;
  onDestinationSelect: (destination: Location) => void;
};

export default function SearchButton({
  departureLocation,
  destination,
  departureDate,
  returnDate,
  isRoundTrip,
  navigation,
  onDateSelect,
  onDepartureSelect,
  onDestinationSelect,
}: SearchButtonProps) {
  const handleSearch = () => {
    if (departureLocation == null) {
      navigation.navigate("DepartureScreen", {
        onSelect: onDepartureSelect,
      });
      return;
    }

    if (destination == null) {
      navigation.navigate("DestinationScreen", {
        onSelect: onDestinationSelect,
      });
      return;
    }

    if (departureDate == null || departureDate.trim() === "") {
      navigation.navigate("DateSelectionScreen", {
        departureLocation,
        destination,
        departureDate,
        returnDate,
        isRoundTrip,
        onSelect: onDateSelect,
      });
      return;
    }

    if (isRoundTrip && (returnDate == null || returnDate.trim() === "")) {
      navigation.navigate("DateSelectionScreen", {
        departureLocation,
        destination,
        departureDate,
        returnDate,
        isRoundTrip,
        onSelect: onDateSelect,
      });
      return;
    }

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
