import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
}) {
  const handleSearch = () => {
    // SỬA Ở ĐÂY: Kiểm tra nếu điểm đi CHƯA có thì mới điều hướng
    if (departureLocation == null) {
      navigation.navigate("DepartureScreen", {
        onSelect: onDepartureSelect,
      });
      return;
    }

    // SỬA Ở ĐÂY: Kiểm tra nếu điểm đến CHƯA có thì mới điều hướng
    if (destination == null) {
      navigation.navigate("DestinationScreen", {
        onSelect: onDestinationSelect,
      });
      return;
    }

    // Các kiểm tra bên dưới đã đúng logic
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

    // Khi tất cả thông tin hợp lệ, đi đến màn hình kết quả
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
