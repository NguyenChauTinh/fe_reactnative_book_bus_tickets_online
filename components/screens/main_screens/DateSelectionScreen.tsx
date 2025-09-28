"use client";

import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar from "../../components/Calendar";

export default function DateSelectionScreen({ navigation, route }: any) {
  const {
    isRoundTrip: initialRoundTrip,
    departureDate,
    returnDate,
    onSelect,
  } = route.params;

  // Tạo ngày hiện tại làm mặc định
  const getCurrentDateString = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    const dayOfWeek = today.getDay() || 7; // Chủ nhật = 7
    return `T${dayOfWeek}, ${day}/${month}/${year}`;
  };

  const [isRoundTrip, setIsRoundTrip] = useState(initialRoundTrip);
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(
    departureDate || getCurrentDateString()
  );
  const [selectedReturnDate, setSelectedReturnDate] = useState(returnDate);

  const handleConfirm = () => {
    onSelect(
      selectedDepartureDate,
      isRoundTrip ? selectedReturnDate : null,
      isRoundTrip
    );
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRoundTripToggle = () => {
    const newRoundTrip = !isRoundTrip;
    setIsRoundTrip(newRoundTrip);

    if (!newRoundTrip) {
      setSelectedReturnDate(null);
    } else {
      setSelectedReturnDate(null);
    }

    onSelect(selectedDepartureDate, null, newRoundTrip);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      <View style={styles.fixedHeader}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chọn ngày</Text>
          <View style={styles.roundTripContainer}>
            <Text style={styles.roundTripLabel}>Khứ hồi</Text>
            <TouchableOpacity
              style={[styles.toggle, isRoundTrip && styles.toggleActive]}
              onPress={handleRoundTripToggle}
            >
              <View
                style={[
                  styles.toggleThumb,
                  isRoundTrip && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateHeader}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Ngày đi</Text>
            <Text style={styles.dateValue}>{selectedDepartureDate}</Text>
          </View>
          {isRoundTrip && (
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Ngày về</Text>
              <Text style={styles.dateValue}>
                {selectedReturnDate || "Chọn ngày về"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.weekDays}>
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Calendar
          isRoundTrip={isRoundTrip}
          selectedDepartureDate={selectedDepartureDate}
          selectedReturnDate={selectedReturnDate}
          onDepartureDateSelect={setSelectedDepartureDate}
          onReturnDateSelect={setSelectedReturnDate}
        />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  fixedHeader: {
    backgroundColor: "#4A90E2",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  roundTripContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundTripLabel: {
    color: "white",
    fontSize: 14,
    marginRight: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  routeInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  routeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dateHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  dateValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  weekDays: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  confirmButton: {
    backgroundColor: "#2C3E50",
    margin: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
