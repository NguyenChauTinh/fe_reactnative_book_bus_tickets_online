import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DepartureIcon from "./icons/DepartureIcon";
import DestinationIcon from "./icons/DestinationIcon";

interface LocationSelectorProps {
  departureLocation: string;
  destination: string;
  onDeparturePress: () => void;
  onDestinationPress: () => void;
  onSwap: () => void;
}

export default function LocationSelector({
  departureLocation,
  destination,
  onDeparturePress,
  onDestinationPress,
  onSwap,
}: LocationSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationRow} onPress={onDeparturePress}>
        <DepartureIcon />
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Nơi xuất phát</Text>
          <Text style={styles.locationValue}>{departureLocation}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.locationRow} onPress={onDestinationPress}>
        <DestinationIcon />
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Bạn muốn đi đâu?</Text>
          <Text style={styles.locationValue}>{destination}</Text>
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
        <SwapIcon />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginLeft: 40,
  },
  swapButton: {
    position: "absolute",
    right: 16,
    top: "43%",
    transform: [{ translateY: -12 }],
    backgroundColor: "#F8F9FA",
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
