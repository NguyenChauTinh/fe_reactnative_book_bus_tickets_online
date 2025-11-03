"use client";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarIcon from "./icons/CalendarIcon";

export default function DateSelector({
  isRoundTrip,
  setIsRoundTrip,
  departureDate,
  returnDate,
  onDatePress,
}) {
  return (
    <View style={styles.container}>
      {/* <View style={styles.roundTripContainer}>
        <Text style={styles.roundTripLabel}>Khứ hồi</Text>
        <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} />
      </View> */}

      <TouchableOpacity style={styles.dateRow} onPress={onDatePress}>
        <CalendarIcon />
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Ngày đi</Text>
          <Text style={styles.dateValue}>{departureDate}</Text>
        </View>
      </TouchableOpacity>

      {isRoundTrip && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.dateRow} onPress={onDatePress}>
            <CalendarIcon />
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Ngày về</Text>
              <Text style={styles.dateValue}>{returnDate}</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  roundTripContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roundTripLabel: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  dateInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginLeft: 40,
  },
});
