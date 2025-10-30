"use client";

import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// SVG Icons
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SteeringWheelIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#666" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2" fill="none" />
    <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="#666" strokeWidth="2" />
  </svg>
);

const CabinIcon = ({ status, cabinNumber }) => {
  let fillColor = "#f0f0f0";
  let strokeColor = "#ccc";
  let textColor = "#666";

  if (status === "occupied") {
    fillColor = "#e0e0e0";
    strokeColor = "#999";
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  } else if (status === "unselected") {
    fillColor = "#ffffff";
  }

  return (
    <View style={styles.cabinContainer}>
      <svg width="40" height="40" viewBox="0 0 32 32">
        {/* Main cabin room */}
        <rect
          x="4"
          y="6"
          width="24"
          height="16"
          rx="2"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Bed representation */}
        <rect
          x="6"
          y="8"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <rect
          x="6"
          y="14"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        {/* Door */}
        <rect
          x="4"
          y="22"
          width="24"
          height="4"
          rx="1"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {status === "occupied" && (
          <path d="M8 10L24 22M24 10L8 22" stroke="#999" strokeWidth="2" />
        )}
        {status === "selected" && (
          <path
            d="M10 16L14 20L22 12"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>
      <Text style={[styles.cabinNumber, { color: textColor }]}>
        {cabinNumber}
      </Text>
    </View>
  );
};

const SeatIcon = ({ status, seatNumber }) => {
  let fillColor = "#f0f0f0";
  let strokeColor = "#ccc";
  let textColor = "#666";

  if (status === "occupied") {
    fillColor = "#e0e0e0";
    strokeColor = "#999";
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  }

  return (
    <View style={styles.seatContainer}>
      <svg width="40" height="40" viewBox="0 0 32 32">
        {/* Main cabin room */}
        <rect
          x="4"
          y="6"
          width="24"
          height="16"
          rx="2"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Bed representation */}
        <rect
          x="6"
          y="8"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <rect
          x="6"
          y="14"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        {/* Door */}
        <rect
          x="4"
          y="22"
          width="24"
          height="4"
          rx="1"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {status === "occupied" && (
          <path d="M8 10L24 22M24 10L8 22" stroke="#999" strokeWidth="2" />
        )}
        {status === "selected" && (
          <path
            d="M10 16L14 20L22 12"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>
      <Text style={[styles.seatNumber, { color: textColor }]}>
        {seatNumber}
      </Text>
    </View>
  );
};

const CabinIcon_22 = ({ status, cabinNumber }) => {
  let fillColor = "#f0f0f0";
  let strokeColor = "#ccc";
  let textColor = "#666";

  if (status === "occupied") {
    fillColor = "#e0e0e0";
    strokeColor = "#999";
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  } else if (status === "unselected") {
    fillColor = "#ffffff";
  }

  return (
    <View style={styles.cabinContainer}>
      <svg width="40" height="40" viewBox="0 0 32 32">
        {/* Main cabin room */}
        <rect
          x="4"
          y="6"
          width="24"
          height="16"
          rx="2"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Bed representation */}
        <rect
          x="6"
          y="8"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <rect
          x="6"
          y="14"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        {/* Door */}
        <rect
          x="4"
          y="22"
          width="24"
          height="4"
          rx="1"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {status === "occupied" && (
          <path d="M8 10L24 22M24 10L8 22" stroke="#999" strokeWidth="2" />
        )}
        {status === "selected" && (
          <path
            d="M10 16L14 20L22 12"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        )}
      </svg>
      <Text style={[styles.cabinNumber, { color: textColor }]}>
        {cabinNumber}
      </Text>
    </View>
  );
};

export default function SeatSelectionScreen({ navigation, route }) {
  const { trip } = route.params;
  const [selectedCabins, setSelectedCabins] = useState([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);

  const is34SingleRooms = trip.busType.includes("34 Phòng");
  const is24DoubleRooms = trip.busType.includes("Limousine 24 phòng đôi");
  const is22DoubleRooms = trip.busType.includes("Limousine 22 phòng đôi");
  const is32SingleRooms = trip.busType.includes("Limousine 32 phòng đơn");

  const generateSeats = () => {
    if (is34SingleRooms) {
      // 34 single rooms layout - 17 per floor
      const lowerFloor = [];
      const upperFloor = [];

      // Lower floor - 17 seats (2 columns, some rows have 3)
      for (let i = 1; i <= 17; i++) {
        const seatNumber = `A${i}`;
        let status = "available";
        if (["A3", "A7", "A12", "A15"].includes(seatNumber)) {
          status = "occupied";
        }
        lowerFloor.push({
          id: `lower-${seatNumber}`,
          number: seatNumber,
          status,
          floor: "lower",
        });
      }

      // Upper floor - 17 seats
      for (let i = 1; i <= 17; i++) {
        const seatNumber = `B${i}`;
        let status = "available";
        if (["B2", "B8", "B14", "B16"].includes(seatNumber)) {
          status = "occupied";
        }
        upperFloor.push({
          id: `upper-${seatNumber}`,
          number: seatNumber,
          status,
          floor: "upper",
        });
      }

      return { lowerFloor, upperFloor };
    }
    if (is32SingleRooms) {
      // 32 single rooms layout
      const lowerFloor = [];
      const upperFloor = [];

      // Lower floor
      for (let i = 1; i <= 16; i++) {
        const seatNumber = `A${i}`;
        let status = "available";
        if (["A3", "A7", "A12", "A15"].includes(seatNumber)) {
          status = "occupied";
        }
        lowerFloor.push({
          id: `lower-${seatNumber}`,
          number: seatNumber,
          status,
          floor: "lower",
        });
      }

      // Upper floor -
      for (let i = 1; i <= 16; i++) {
        const seatNumber = `B${i}`;
        let status = "available";
        if (["B2", "B8", "B14", "B16"].includes(seatNumber)) {
          status = "occupied";
        }
        upperFloor.push({
          id: `upper-${seatNumber}`,
          number: seatNumber,
          status,
          floor: "upper",
        });
      }

      return { lowerFloor, upperFloor };
    }
    if (is24DoubleRooms) {
      // 24 double rooms layout (existing code)
      const lowerFloor = [];
      const upperFloor = [];

      // Lower floor - 2 columns, 6 rows = 12 cabins
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 2; col++) {
          const cabinNumber = `A${row * 2 + col + 1}`;
          let status = "available";

          if (["A2", "A5", "A8"].includes(cabinNumber)) {
            status = "occupied";
          }

          lowerFloor.push({
            id: `lower-${cabinNumber}`,
            number: cabinNumber,
            status,
            floor: "lower",
            row,
            col,
          });
        }
      }

      // Upper floor - 2 columns, 6 rows = 12 cabins
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 2; col++) {
          const cabinNumber = `B${row * 2 + col + 1}`;
          let status = "available";

          if (["B3", "B7", "B10"].includes(cabinNumber)) {
            status = "occupied";
          }

          upperFloor.push({
            id: `upper-${cabinNumber}`,
            number: cabinNumber,
            status,
            floor: "upper",
            row,
            col,
          });
        }
      }

      return { lowerFloor, upperFloor };
    }

    if (is22DoubleRooms) {
      const lowerFloor = [];
      const upperFloor = [];

      // Lower floor - 2 columns × 5 rows = 10 cabins
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 2; col++) {
          const cabinNumber = `A${row * 2 + col + 1}`;
          let status = "available";

          if (["A3", "A4", "A5"].includes(cabinNumber)) {
            status = "occupied";
          }

          lowerFloor.push({
            id: `lower-${cabinNumber}`,
            number: cabinNumber,
            status,
            floor: "lower",
            row,
            col,
          });
        }
      }

      // Upper floor - 2 columns × 6 rows = 12 cabins
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 2; col++) {
          const cabinNumber = `B${row * 2 + col + 1}`;
          let status = "available";

          if (["B1", "B2", "B3"].includes(cabinNumber)) {
            status = "occupied";
          }

          upperFloor.push({
            id: `upper-${cabinNumber}`,
            number: cabinNumber,
            status,
            floor: "upper",
            row,
            col,
          });
        }
      }

      return { lowerFloor, upperFloor };
    }
  };

  const { lowerFloor, upperFloor } = generateSeats();
  console.log("Lower:", lowerFloor.length); // mong đợi = 10
  console.log("Upper:", upperFloor.length); // mong đợi = 12

  const handleCabinPress = (cabin) => {
    if (cabin.status === "occupied") return;

    const isSelected = selectedCabins.some((c) => c.id === cabin.id);

    if (isSelected) {
      setSelectedCabins(selectedCabins.filter((c) => c.id !== cabin.id));
    } else {
      if (is34SingleRooms) {
        // For 34 single rooms, directly select with fixed price
        const cabinWithRoom = {
          ...cabin,
          roomType: "single",
          price: 220000, // Fixed price for single rooms
        };
        setSelectedCabins([...selectedCabins, cabinWithRoom]);
      }
      if (is32SingleRooms) {
        // For 32 single rooms, directly select with fixed price
        const cabinWithRoom = {
          ...cabin,
          roomType: "single",
          price: 220000, // Fixed price for single rooms
        };
        setSelectedCabins([...selectedCabins, cabinWithRoom]);
      }
      if (is24DoubleRooms) {
        // For 24 double rooms, show modal for room type selection
        setSelectedCabin(cabin);
        setShowRoomModal(true);
      }
      if (is22DoubleRooms) {
        // For 22 double rooms, show modal for room type selection
        setSelectedCabin(cabin);
        setShowRoomModal(true);
      }
    }
  };

  const handleRoomTypeSelect = (roomType) => {
    const price = roomType === "double" ? 360000 : 250000;
    const cabinWithRoom = {
      ...selectedCabin,
      roomType,
      price,
    };
    setSelectedCabins([...selectedCabins, cabinWithRoom]);
    setShowRoomModal(false);
    setSelectedCabin(null);
  };

  const handleContinue = () => {
    if (selectedCabins.length > 0) {
      navigation.navigate("PickupPointScreen", {
        trip,
        selectedSeats: selectedCabins,
      });
    }
  };

  const getCabinStatus = (cabin) => {
    if (cabin.status === "occupied") return "occupied";
    if (selectedCabins.some((c) => c.id === cabin.id)) return "selected";
    return "available";
  };

  const renderFloor = (seats, title) => {
    if (is34SingleRooms) {
      // 34 single rooms layout - grid arrangement
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          {title === "TẦNG DƯỚI" && (
            <View style={styles.steeringWheelContainer}>
              {/* <SteeringWheelIcon /> */}
            </View>
          )}
          <View style={styles.seatGrid34}>
            {seats.map((seat, index) => (
              <TouchableOpacity
                key={seat.id}
                onPress={() => handleCabinPress(seat)}
                disabled={seat.status === "occupied"}
                style={styles.seatItem}
              >
                <SeatIcon
                  status={getCabinStatus(seat)}
                  seatNumber={seat.number}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    if (is32SingleRooms) {
      // 32 single rooms layout - grid arrangement
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          {title === "TẦNG DƯỚI" && (
            <View style={styles.steeringWheelContainer}>
              {/* <SteeringWheelIcon /> */}
            </View>
          )}
          <View style={styles.seatGrid34}>
            {seats.map((seat, index) => (
              <TouchableOpacity
                key={seat.id}
                onPress={() => handleCabinPress(seat)}
                disabled={seat.status === "occupied"}
                style={styles.seatItem}
              >
                <SeatIcon
                  status={getCabinStatus(seat)}
                  seatNumber={seat.number}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    if (is24DoubleRooms) {
      // 24 double rooms layout (existing code)
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          {title === "TẦNG DƯỚI" && (
            <View style={styles.steeringWheelContainer}>
              {/* <SteeringWheelIcon /> */}
            </View>
          )}
          <View style={styles.cabinGrid}>
            {Array.from({ length: 6 }, (_, row) => (
              <View key={row} style={styles.cabinRow}>
                {seats
                  .filter((cabin) => cabin.row === row)
                  .map((cabin) => (
                    <TouchableOpacity
                      key={cabin.id}
                      onPress={() => handleCabinPress(cabin)}
                      disabled={cabin.status === "occupied"}
                    >
                      <CabinIcon
                        status={getCabinStatus(cabin)}
                        cabinNumber={cabin.number}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        </View>
      );
    }
    if (is22DoubleRooms) {
      // 22 double rooms layout (existing code)
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          {title === "TẦNG DƯỚI" && (
            <View style={styles.steeringWheelContainer}>
              {/* <SteeringWheelIcon /> */}
            </View>
          )}
          <View style={styles.cabinGrid}>
            {Array.from({ length: 6 }, (_, row) => (
              <View key={row} style={styles.cabinRow}>
                {seats
                  .filter((cabin) => cabin.row === row)
                  .map((cabin) => (
                    <TouchableOpacity
                      key={cabin.id}
                      onPress={() => handleCabinPress(cabin)}
                      disabled={cabin.status === "occupied"}
                    >
                      <CabinIcon_22
                        status={getCabinStatus(cabin)}
                        cabinNumber={cabin.number}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  const totalPrice = selectedCabins.reduce(
    (sum, cabin) => sum + (cabin.price || 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{trip.company}</Text>
          <Text style={styles.headerSubtitle}>23:00 • T3, 23/09/2025</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Chi tiết xe</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <Text style={styles.activeStepText}>Chọn chỗ</Text>
      </View>

      {/* <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.activeStepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.activeStepText}>Chọn chỗ</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepNumber}>2</Text>
          </View>
          <Text style={styles.inactiveStepText}>Chọn điểm đón</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepNumber}>3</Text>
          </View>
          <Text style={styles.inactiveStepText}>Chọn đón trả</Text>
        </View>
      </View> */}

      {/* Notice */}
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>ℹ️ Quy định cần lưu ý khi đi xe</Text>
        <TouchableOpacity>
          <Text style={styles.detailsLink}>Chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="unselected" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="available" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Ghế không bán</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="selected" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Đang chọn</Text>
        </View>
      </View>

      {(is24DoubleRooms || is22DoubleRooms) && (
        <View style={styles.pricingContainer}>
          <View style={styles.pricingItem}>
            <View style={styles.pricingCheckbox} />
            <View>
              <Text style={styles.pricingTitle}>Giường phòng đôi</Text>
              <Text style={styles.pricingPrice}>360.000đ</Text>
            </View>
          </View>
          <View style={styles.pricingItem}>
            <View style={styles.pricingCheckbox} />
            <View>
              <Text style={styles.pricingTitle}>Giường phòng đơn</Text>
              <Text style={styles.pricingPrice}>250.000đ</Text>
            </View>
          </View>
        </View>
      )}

      {/* Cabin Layout */}
      <ScrollView style={styles.seatLayout}>
        <View style={styles.floorsContainer}>
          {renderFloor(lowerFloor, "TẦNG DƯỚI")}
          {renderFloor(upperFloor, "TẦNG TRÊN")}
        </View>
      </ScrollView>

      {/* Trip Info */}

      {/* Selected Seats Info */}
      {selectedCabins.length > 0 && (
        <View style={styles.selectedSeatsInfo}>
          <Text style={styles.selectedSeatsTitle}>Ghế đã chọn:</Text>
          <View style={styles.selectedSeatsContainer}>
            {selectedCabins.map((cabin, index) => (
              <View key={index} style={styles.selectedSeatItem}>
                <Text style={styles.selectedSeatNumber}>
                  {cabin.floor === "lower" ? "D" : "T"}-{cabin.number}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.selectedSeatsText}>
            Đã chọn {selectedCabins.length} chỗ
          </Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCabins.length === 0 && styles.disabledButton,
          ]}
          disabled={selectedCabins.length === 0}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      {(is24DoubleRooms || is22DoubleRooms) && (
        <Modal
          visible={showRoomModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRoomModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Mã giường: {selectedCabin?.number}
                </Text>
                <TouchableOpacity onPress={() => setShowRoomModal(false)}>
                  <Text style={styles.modalCloseButton}>Đóng</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                Đây là giường có thể nằm tối đa 2 khách.{"\n"}
                Giá vé sẽ tương ứng với số lượng khách.
              </Text>

              <View style={styles.roomTypeContainer}>
                <TouchableOpacity
                  style={styles.roomTypeButton}
                  onPress={() => handleRoomTypeSelect("double")}
                >
                  <Text style={styles.roomTypeTitle}>Giường phòng đôi</Text>
                  <Text style={styles.roomTypePrice}>360.000đ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roomTypeButton}
                  onPress={() => handleRoomTypeSelect("single")}
                >
                  <Text style={styles.roomTypeTitle}>Giường phòng đơn</Text>
                  <Text style={styles.roomTypePrice}>250.000đ</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowRoomModal(false)}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selectedCabins.length > 0 && (
        <View style={styles.nextStepInfo}>
          <Text style={styles.nextStepText}>
            Bạn sẽ chọn điểm đón trả ở bước tiếp theo
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  progressContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressStep: {
    alignItems: "center",
  },
  activeStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  inactiveStepNumber: {
    color: "white",
    fontSize: 12,
  },
  activeStepText: {
    color: "#4A90E2",
    fontSize: 18,
    marginTop: 4,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  inactiveStepText: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  noticeContainer: {
    backgroundColor: "#e3f2fd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  noticeText: {
    color: "#1976d2",
    fontSize: 14,
    flex: 1,
  },
  detailsLink: {
    color: "#4A90E2",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  legendContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  legendItem: {
    alignItems: "center",
  },
  legendIcon: {
    marginBottom: 4,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  seatLayout: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
  },
  floorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    gap: 20,
  },
  floorContainer: {
    flex: 1,
    maxWidth: 150,
    alignItems: "center",
  },
  floorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  steeringWheelContainer: {
    alignItems: "center",
    // marginBottom: 12,
  },
  cabinGrid: {
    alignItems: "center",
    width: "100%",
  },
  cabinRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    gap: 8,
  },
  cabinContainer: {
    alignItems: "center",
    width: 52,
    marginHorizontal: 4,
  },
  cabinNumber: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
  },
  pricingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
  },
  pricingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pricingCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
    borderRadius: 2,
  },
  pricingTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  pricingPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    fontSize: 16,
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
  },
  roomTypeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  roomTypeButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
  },
  roomTypeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  roomTypePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  priceContainer: {
    flex: 1,
  },
  selectedSeatsText: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  nextStepInfo: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nextStepText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  seatGrid34: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 140,
    gap: 4,
  },
  seatItem: {
    margin: 2,
  },
  seatContainer: {
    alignItems: "center",
    width: 36,
  },
  seatNumber: {
    fontSize: 8,
    marginTop: 2,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedSeatsInfo: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 16,
  },
  selectedSeatsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  selectedSeatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedSeatItem: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedSeatNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  selectedSeatPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A90E2",
  },
});
