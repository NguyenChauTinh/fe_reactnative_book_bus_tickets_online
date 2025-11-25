import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  // ✅ BỎ: Modal
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Rect, Svg } from "react-native-svg";
import { api_booking_service } from "../../../apis/api_booking_service";
import BookingTimeline from "../main_screens/BookingTimeline";
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CabinIcon = ({ status, cabinNumber }) => {
  let fillColor = "#f0f0f0";
  let strokeColor = "#ccc";
  let textColor = "#666";

  if (status === "occupied") {
    fillColor = "#e0e0e0";
    strokeColor = "#999";
    textColor = "#999"; // Làm mờ text của ghế đã đặt
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  } else if (status === "unselected") {
    fillColor = "#ffffff";
  }

  return (
    <View style={styles.cabinContainer}>
      {/* <svg> -> <Svg> */}
      <Svg width="40" height="40" viewBox="0 0 32 32">
        {/* <rect> -> <Rect> */}
        <Rect
          x="4"
          y="6"
          width="24"
          height="16"
          rx="2"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        <Rect
          x="6"
          y="8"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <Rect
          x="6"
          y="14"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <Rect
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
          // <path> -> <Path>
          <Path d="M8 10L24 22M24 10L8 22" stroke="#999" strokeWidth="2" />
        )}
        {status === "selected" && (
          // <path> -> <Path>
          <Path
            d="M10 16L14 20L22 12"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        )}
      </Svg>
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
    textColor = "#999";
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  }

  return (
    <View style={styles.seatContainer}>
      {/* <svg> -> <Svg> */}
      <Svg width="40" height="40" viewBox="0 0 32 32">
        {/* <rect> -> <Rect> */}
        <Rect
          x="4"
          y="6"
          width="24"
          height="16"
          rx="2"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
        />
        <Rect
          x="6"
          y="8"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <Rect
          x="6"
          y="14"
          width="20"
          height="4"
          rx="1"
          fill={strokeColor}
          opacity="0.3"
        />
        <Rect
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
          // <path> -> <Path>
          <Path d="M8 10L24 22M24 10L8 22" stroke="#999" strokeWidth="2" />
        )}
        {status === "selected" && (
          // <path> -> <Path>
          <Path
            d="M10 16L14 20L22 12"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        )}
      </Svg>
      <Text style={[styles.seatNumber, { color: textColor }]}>
        {seatNumber}
      </Text>
    </View>
  );
};

// Hàm tiện ích để chuyển đổi chuỗi giá thành số
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(String(priceString).replace(/\D/g, ""), 10) || 0;
};

export default function SeatSelectionScreen({ navigation, route }) {
  const { trip, departureLocation, destination, departureDate, returnDate } =
    route.params;
  const [selectedCabins, setSelectedCabins] = useState([]);

  // --- BẮT ĐẦU THAY ĐỔI: Bỏ state của modal ---
  // const [showRoomModal, setShowRoomModal] = useState(false);
  // const [selectedCabin, setSelectedCabin] = useState(null);
  // --- KẾT THÚC THAY ĐỔI ---

  const [loading, setLoading] = useState(true);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const handleContinue = () => {
    if (selectedCabins.length > 0) {
      navigation.navigate("PickupPointScreen", {
        trip,
        selectedSeats: selectedCabins,
        departureLocation,
        destination,
        departureDate,
        returnDate,
      });
    }
  };

  useEffect(() => {
    const fetchTickets = async (tripId) => {
      setLoading(true);
      try {
        const response = await api_booking_service.getTicketsByChuyenXeId(
          tripId
        );

        if (response.success && response.data) {
          const bookedSeatCodes = response.data.flatMap((ticket) =>
            ticket.chiTiet.map((detail) => detail.maChoNgoi)
          );
          setOccupiedSeats(bookedSeatCodes);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (trip?._id) {
      fetchTickets(trip._id);
    } else {
      setLoading(false);
    }
  }, [trip?._id]);

  const is24DoubleRooms = trip.busType.includes("Limousine 24 phòng đôi");
  const is32SingleRooms = trip.busType.includes("Limousine 34 phòng đơn");

  const generateSeats = (tripData, occupiedList) => {
    const lowerFloor = [];
    const upperFloor = [];

    if (!tripData?.loaiXe?.soDoGhe) {
      return { lowerFloor, upperFloor };
    }

    const seatsFromAPI = tripData.loaiXe.soDoGhe;

    seatsFromAPI.forEach((seat) => {
      if (seat.trangThai) {
        const newSeat = {
          id: `${seat.tang}-${seat.maSoGhe}`,
          number: seat.maSoGhe,
          status: occupiedList.includes(seat.maSoGhe)
            ? "occupied"
            : "available",
          floor: seat.tang,
          row: seat.hang,
          col: seat.day,
        };

        if (seat.tang === "lower") {
          lowerFloor.push(newSeat);
        } else if (seat.tang === "upper") {
          upperFloor.push(newSeat);
        }
      }
    });

    return { lowerFloor, upperFloor };
  };

  const { lowerFloor, upperFloor } = generateSeats(trip, occupiedSeats);

  const handleCabinPress = (cabin) => {
    if (cabin.status === "occupied") return;

    const isSelected = selectedCabins.some((c) => c.id === cabin.id);

    if (isSelected) {
      setSelectedCabins(selectedCabins.filter((c) => c.id !== cabin.id));
    } else {
      // --- BẮT ĐẦU THAY ĐỔI: Gộp logic 24 và 32 phòng ---
      if (is32SingleRooms || is24DoubleRooms) {
        const cabinWithRoom = {
          ...cabin,
          roomType: "single", // Luôn là 'single'
          price: parsePrice(trip.price), // Luôn lấy giá đơn
        };
        setSelectedCabins([...selectedCabins, cabinWithRoom]);
      }
      // --- KẾT THÚC THAY ĐỔI: Đã bỏ logic mở modal ---
    }
  };

  // --- BẮT ĐẦU THAY ĐỔI: Bỏ hàm xử lý modal ---
  // const handleRoomTypeSelect = (roomType) => {
  //   ...
  // };
  // --- KẾT THÚC THAY ĐỔI ---

  const getCabinStatus = (cabin) => {
    if (cabin.status === "occupied") return "occupied";
    if (selectedCabins.some((c) => c.id === cabin.id)) return "selected";
    return "available";
  };

  const renderFloor = (seats, title) => {
    if (!seats || seats.length === 0) return null;

    if (is32SingleRooms) {
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          <View style={styles.seatGrid34}>
            {seats.map((seat) => (
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
      const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);
      return (
        <View style={styles.floorContainer}>
          <Text style={styles.floorTitle}>{title}</Text>
          <View style={styles.cabinGrid}>
            {rows.map((row) => (
              <View key={row} style={styles.cabinRow}>
                {seats
                  .filter((cabin) => cabin.row === row)
                  .sort((a, b) => a.col - b.col)
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
    return null;
  };

  const totalPrice = selectedCabins.reduce(
    (sum, cabin) => sum + (cabin.price || 0),
    0
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Đang tải sơ đồ ghế...</Text>
      </View>
    );
  }

  // --- BẮT ĐẦU THAY ĐỔI: Sửa lỗi giao diện ---
  // Bỏ <View> ngoài cùng và ternary 'loading' không cần thiết
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {departureLocation.tenDiaDiem} → {destination.tenDiaDiem}
          </Text>
          <Text style={styles.headerSubtitle}>{departureDate}</Text>
        </View>
      </View>

      {/* Progress Steps */}
      <BookingTimeline currentStep={1} />
      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="unselected" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="occupied" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendIcon}>
            <CabinIcon status="selected" cabinNumber="" />
          </View>
          <Text style={styles.legendText}>Đang chọn</Text>
        </View>
      </View>

      {/* --- BẮT ĐẦU THAY ĐỔI: Bỏ bảng giá phòng đôi --- */}
      {/* {is24DoubleRooms && (
        <View style={styles.pricingContainer}>
         ...
        </View>
      )} */}
      {/* --- KẾT THÚC THAY ĐỔI --- */}

      {/* Cabin Layout */}
      <ScrollView style={styles.seatLayout}>
        <View style={styles.floorsContainer}>
          {renderFloor(lowerFloor, "TẦNG DƯỚI")}
          {renderFloor(upperFloor, "TẦNG TRÊN")}
        </View>
      </ScrollView>

      {/* Selected Seats Info */}
      {selectedCabins.length > 0 && (
        <View style={styles.selectedSeatsInfo}>
          <Text style={styles.selectedSeatsTitle}>Ghế đã chọn:</Text>
          <View style={styles.selectedSeatsContainer}>
            {selectedCabins.map((cabin, index) => (
              <View key={index} style={styles.selectedSeatItem}>
                <Text style={styles.selectedSeatNumber}>{cabin.number}</Text>
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
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString("vi-VN")}đ ▲
          </Text>
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

      {/* --- BẮT ĐẦU THAY ĐỔI: Bỏ Modal chọn phòng --- */}
      {/* {is24DoubleRooms && (
        <Modal
          visible={showRoomModal}
          ...
        >
         ...
        </Modal>
      )} */}
      {/* --- KẾT THÚC THAY ĐỔI --- */}
    </SafeAreaView>
  );
  // --- KẾT THÚC THAY ĐỔI: Đã đóng SafeAreaView ---
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#007AFF",
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
  activeStepText: {
    color: "#007AFF",
    fontSize: 18,
    marginTop: 4,
    fontWeight: "bold",
    textDecorationLine: "underline",
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
    borderColor: "#007AFF",
  },
  noticeText: {
    color: "#1976d2",
    fontSize: 14,
    flex: 1,
  },
  detailsLink: {
    color: "#007AFF",
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
    width: 20,
    height: 20,
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
    color: "#007AFF",
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
  bottomBar: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "flex-end",
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
    backgroundColor: "#FFC107",
    paddingHorizontal: 32,
    paddingVertical: 16,
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
  },
  selectedSeatNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
});
