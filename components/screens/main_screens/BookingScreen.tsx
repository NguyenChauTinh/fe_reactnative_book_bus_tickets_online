"use client";

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BookingScreen = ({ navigation }) => {
  const [departure, setDeparture] = useState("Hải Phòng");
  const [destination, setDestination] = useState("Hà Nội");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const currentDate = new Date("2025-08-31T14:07:00+07:00"); // Current date: 02:07 PM +07, 31/08/2025

  const isButtonEnabled = () => {
    if (!departureDate) return false;
    if (isRoundTrip && !returnDate) return false;
    return new Date(departureDate) >= currentDate;
  };

  const handleSwap = () => {
    setDeparture(destination);
    setDestination(departure);
  };

  const handleDateSelected = (date) => {
    if (isRoundTrip && !departureDate) {
      setDepartureDate(date);
    } else if (isRoundTrip && departureDate) {
      setReturnDate(date);
    } else {
      setDepartureDate(date);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>vexere</Text>
        <Text style={styles.greeting}>Chào Ng 9</Text>
      </View>

      {/* Promo Message */}
      <View style={styles.promo}>
        <Text style={styles.promoText}>
          Cảm kết hoàn 150% nếu không có chuyến
        </Text>
        <Text style={styles.promoText}>cùng cập dịch vụ ưu đãi (*)</Text>
      </View>

      {/* Transport Options */}
      <View style={styles.transportOptions}>
        <TouchableOpacity style={styles.transportButton}>
          <Text style={styles.transportIcon}>🚍</Text>
          <Text style={styles.transportText}>Xe khách</Text>
        </TouchableOpacity>
      </View>

      {/* Search Form */}
      <View style={styles.searchForm}>
        <View style={styles.locationRow}>
          <View style={styles.locationItem}>
            <Text style={styles.label}>Nơi xuất phát</Text>
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() =>
                navigation.navigate("SelectLocation", {
                  setLocation: setDeparture,
                })
              }
            >
              <Text>{departure}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
            <Text style={styles.swapIcon}>↕</Text>
          </TouchableOpacity>
          <View style={styles.locationItem}>
            <Text style={styles.label}>Bạn muốn đi đâu?</Text>
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() =>
                navigation.navigate("SelectLocation", {
                  setLocation: setDestination,
                })
              }
            >
              <Text>{destination}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.label}>Ngày đi</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() =>
                navigation.navigate("DatePickerScreen", {
                  type: "departure",
                  minDate: currentDate,
                  onDateSelected: handleDateSelected,
                })
              }
              disabled={isRoundTrip && !returnDate}
            >
              <Text>{departureDate || "Chọn ngày"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.label}>Khứ hồi</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsRoundTrip(!isRoundTrip)}
            >
              <Text>{isRoundTrip ? "Bật" : "Tắt"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isRoundTrip && (
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.label}>Ngày về</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() =>
                  navigation.navigate("DatePickerScreen", {
                    type: "return",
                    minDate: departureDate
                      ? new Date(departureDate)
                      : currentDate,
                    onDateSelected: handleDateSelected,
                  })
                }
                disabled={!departureDate}
              >
                <Text>{returnDate || "Chọn ngày"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          !isButtonEnabled() && styles.disabledButton,
        ]}
        onPress={() =>
          navigation.navigate("SearchResults", {
            departure,
            destination,
            departureDate,
            returnDate,
            isRoundTrip,
          })
        }
        disabled={!isButtonEnabled()}
      >
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {/* Recent Searches */}
      <View style={styles.recentSearches}>
        <Text style={styles.recentTitle}>Tìm kiếm gần ngày</Text>
        <TouchableOpacity
          style={styles.recentItem}
          onPress={() => {
            setDeparture("Hải Phòng");
            setDestination("Hà Nội");
            setDepartureDate("2025-08-28");
            setReturnDate("");
            setIsRoundTrip(false);
          }}
        >
          <Text style={styles.recentText}>• Hải Phòng</Text>
          <Text style={styles.recentText}>• Hà Nội</Text>
          <Text style={styles.recentDate}>TS, 28/08/2025</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E90FF",
    padding: 16,
    alignItems: "center",
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  promo: {
    backgroundColor: "#1E90FF",
    padding: 8,
    alignItems: "center",
  },
  promoText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  transportOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  transportButton: {
    alignItems: "center",
  },
  transportIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  transportText: {
    fontSize: 14,
    color: "#333333",
  },
  searchForm: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 8,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  locationItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#F9F9F9",
  },
  swapButton: {
    padding: 8,
    alignItems: "center",
  },
  swapIcon: {
    fontSize: 20,
    color: "#666666",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  searchButton: {
    backgroundColor: "#FFC107",
    padding: 12,
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  recentSearches: {
    padding: 16,
  },
  recentTitle: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 14,
    color: "#333333",
  },
  recentDate: {
    fontSize: 12,
    color: "#666666",
  },
});

export default BookingScreen;
