"use client";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Giả sử bạn có file api service này
import { api_booking_service } from "../../../apis/api_booking_service";

// SVG Icons (Giữ nguyên không thay đổi)
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
      <svg width="40" height="40" viewBox="0 0 32 32">
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
    textColor = "#999";
  } else if (status === "selected") {
    fillColor = "#4CAF50";
    strokeColor = "#4CAF50";
    textColor = "white";
  }

  return (
    <View style={styles.seatContainer}>
      <svg width="40" height="40" viewBox="0 0 32 32">
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

// Hàm tiện ích để chuyển đổi chuỗi giá thành số
const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(String(priceString).replace(/\D/g, ""), 10) || 0;
};

export default function SeatSelectionScreen({ navigation, route }) {
  const { trip, departureLocation, destination, departureDate, returnDate } =
    route.params;
  const [selectedCabins, setSelectedCabins] = useState([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- BẮT ĐẦU THAY ĐỔI ---
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
        // Thay thế bằng service API thực tế của bạn
        const response = await api_booking_service.getTicketsByChuyenXeId(
          tripId
        );
        // Dữ liệu giả lập để test
        // const response = {
        //   success: true,
        //   data: [
        //     { chiTiet: [{ maChoNgoi: "1C" }] },
        //     { chiTiet: [{ maChoNgoi: "1D" }] },
        //     { chiTiet: [{ maChoNgoi: "2A" }, { maChoNgoi: "3B" }] },
        //   ],
        // };

        if (response.success && response.data) {
          // Dùng flatMap để lấy tất cả maChoNgoi từ các chi tiết vé
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
      setLoading(false); // Nếu không có trip id, dừng loading
    }
  }, [trip?._id]);

  // --- KẾT THÚC THAY ĐỔI ---

  const is24DoubleRooms = trip.busType.includes("Limousine 24 phòng đôi");
  const is32SingleRooms = trip.busType.includes("Limousine 34 phòng đơn");

  // --- BẮT ĐẦU THAY ĐỔI ---
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
          // Kiểm tra nếu ghế có trong danh sách đã đặt
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
  // --- KẾT THÚC THAY ĐỔI ---

  const handleCabinPress = (cabin) => {
    if (cabin.status === "occupied") return;

    const isSelected = selectedCabins.some((c) => c.id === cabin.id);

    if (isSelected) {
      setSelectedCabins(selectedCabins.filter((c) => c.id !== cabin.id));
    } else {
      if (is32SingleRooms) {
        const cabinWithRoom = {
          ...cabin,
          roomType: "single",
          price: parsePrice(trip.price),
        };
        setSelectedCabins([...selectedCabins, cabinWithRoom]);
      } else if (is24DoubleRooms) {
        setSelectedCabin(cabin);
        setShowRoomModal(true);
      }
    }
  };

  const handleRoomTypeSelect = (roomType) => {
    const price =
      roomType === "double" ? parsePrice(trip.price1) : parsePrice(trip.price);
    const cabinWithRoom = {
      ...selectedCabin,
      roomType,
      price,
    };
    setSelectedCabins([...selectedCabins, cabinWithRoom]);
    setShowRoomModal(false);
    setSelectedCabin(null);
  };

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

  // --- BẮT ĐẦU THAY ĐỔI ---
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>Đang tải sơ đồ ghế...</Text>
      </View>
    );
  }
  // --- KẾT THÚC THAY ĐỔI ---

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // <-- Hiển thị khi đang tải
      ) : (
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
              <Text style={styles.headerTitle}>
                {departureLocation.tenDiaDiem} → {destination.tenDiaDiem}
              </Text>
              <Text style={styles.headerSubtitle}>{departureDate}</Text>
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.progressContainer}>
            <Text style={styles.activeStepText}>Chọn chỗ</Text>
          </View>

          {/* Notice */}
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeText}>
              ℹ️ Quy định cần lưu ý khi đi xe
            </Text>
            <TouchableOpacity>
              <Text style={styles.detailsLink}>Chi tiết</Text>
            </TouchableOpacity>
          </View>

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

          {/* Pricing Info for Double Rooms */}
          {is24DoubleRooms && (
            <View style={styles.pricingContainer}>
              <View style={styles.pricingItem}>
                <View>
                  <Text style={styles.pricingTitle}>Giường phòng đôi</Text>
                  <Text style={styles.pricingPrice}>{trip.price1}</Text>
                </View>
              </View>
              <View style={styles.pricingItem}>
                <View>
                  <Text style={styles.pricingTitle}>Giường phòng đơn</Text>
                  <Text style={styles.pricingPrice}>{trip.price}</Text>
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

          {/* Selected Seats Info */}
          {selectedCabins.length > 0 && (
            <View style={styles.selectedSeatsInfo}>
              <Text style={styles.selectedSeatsTitle}>Ghế đã chọn:</Text>
              <View style={styles.selectedSeatsContainer}>
                {selectedCabins.map((cabin, index) => (
                  <View key={index} style={styles.selectedSeatItem}>
                    <Text style={styles.selectedSeatNumber}>
                      {cabin.number}
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
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString("vi-VN")}đ
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

          {/* Room Type Selection Modal */}
          {is24DoubleRooms && (
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
                      <Text style={styles.roomTypePrice}>{trip.price1}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.roomTypeButton}
                      onPress={() => handleRoomTypeSelect("single")}
                    >
                      <Text style={styles.roomTypeTitle}>Giường phòng đơn</Text>
                      <Text style={styles.roomTypePrice}>{trip.price}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </SafeAreaView>
      )}
    </View>
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
  activeStepText: {
    color: "#4A90E2",
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
