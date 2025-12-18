import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { useAnalytics } from "../../../contexts/BookingAnalyticsContext";
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

const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#999" strokeWidth="2" />
    <Path d="m21 21-4.35-4.35" stroke="#999" strokeWidth="2" />
  </Svg>
);

const LocationIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" fill="#007AFF" />
    <Path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#007AFF" strokeWidth="2" />
  </Svg>
);

const MapIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" // Đây là đường viền của bản đồ
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 2v16" // Đây là đường gấp ở giữa
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 6v16" // Đây là đường gấp ở giữa
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hàm tiện ích để chuyển đổi phút sang định dạng HH:mm
const formatMinutesToHHMM = (totalMinutes) => {
  if (isNaN(totalMinutes)) return "00:00";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};

export default function PickupPointScreen({ navigation, route }) {
  const {
    trip,
    selectedSeats,
    departureLocation,
    destination,
    departureDate,
    returnDate,
  } = route.params;

  const [searchText, setSearchText] = useState("");
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' = Sớm nhất, 'desc' = Muộn nhất
  const [loading, setLoading] = useState(true);
  const { startTracking, logStep } = useAnalytics();

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    // --- BẮT ĐẦU SỬA LỖI ---
    // Sửa lại `chiTietsTuyen` thành `chiTietTuyen`
    if (trip?.tuyenDuong?.chiTietTuyen) {
      setLoading(true);
      // --- KẾT THÚC SỬA LỖI ---
      const departureTimeInMinutes = trip.gioKhoiHanh || 0;

      const sortedPickupPoints = trip.tuyenDuong.chiTietTuyen
        .filter((diem) => diem.loaiDiem === "don")
        .sort((a, b) => a.thuTu - b.thuTu);

      let cumulativeTime = 0;

      const formattedPoints = sortedPickupPoints.map((item, index) => {
        if (index > 0) {
          cumulativeTime += sortedPickupPoints[index - 1].thoiGianDuKien || 0;
        }
        return {
          id: item._id,
          time: formatMinutesToHHMM(departureTimeInMinutes + cumulativeTime),
          name: item.diaDiem.tenDiaDiem,
          address: `Địa chỉ chi tiết cho: ${item.diaDiem.tenDiaDiem}`,
        };
      });
      setLoading(false);

      setPickupPoints(formattedPoints);
    }
  }, [trip]);

  const sortedAndFilteredPickups = useMemo(() => {
    const sorted = [...pickupPoints].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.time.localeCompare(b.time);
      } else {
        return b.time.localeCompare(a.time);
      }
    });

    if (!searchText) {
      return sorted;
    }

    return sorted.filter(
      (pickup) =>
        pickup.name.toLowerCase().includes(searchText.toLowerCase()) ||
        pickup.address.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [pickupPoints, sortOrder, searchText]);

  const handlePickupSelect = (pickup) => {
    setSelectedPickup(pickup);
  };

  const handleContinue = () => {
    if (selectedPickup) {
      logStep(); // Bước 4
      navigation.navigate("DropoffPointScreen", {
        trip,
        selectedSeats,
        selectedPickup,
        departureLocation,
        destination,
        departureDate,
        returnDate,
      });
    }
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  const handleShowMap = (address) => {
    // Mã hóa địa chỉ để dùng trong URL
    const encodedAddress = encodeURIComponent(address);
    // Tạo URL đa nền tảng cho Google Maps
    const url = `https://maps.google.com/?q=${encodedAddress}`;

    Linking.openURL(url).catch((err) =>
      console.error("Không thể mở bản đồ", err)
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // <-- Hiển thị khi đang tải
      ) : (
        <SafeAreaView
          style={styles.container}
          edges={["bottom", "left", "right"]}
        >
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

          <BookingTimeline currentStep={2} />

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm điểm đón trong danh sách"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          <View style={styles.sortContainer}>
            <TouchableOpacity
              onPress={toggleSortOrder}
              style={styles.sortButton}
            >
              <Text style={styles.sortText}>Sắp xếp theo</Text>
              <Text style={styles.sortValue}>
                {sortOrder === "asc" ? "Sớm nhất ▼" : "Muộn nhất ▲"}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              {/* <Text style={styles.convenientText}>
                Điểm đón nào thuận tiện nhất?
              </Text>
              <TouchableOpacity>
                <Text style={styles.addressLink}>Nhập địa chỉ của bạn</Text>
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              *Lưu ý: Thời gian đón là dự kiến và có thể thay đổi.
            </Text>
          </View>

          <ScrollView style={styles.pickupList}>
            {sortedAndFilteredPickups.map((pickup) => (
              <TouchableOpacity
                key={pickup.id}
                style={[
                  styles.pickupItem,
                  selectedPickup?.id === pickup.id && styles.selectedPickupItem,
                ]}
                onPress={() => handlePickupSelect(pickup)}
              >
                <View style={styles.pickupContent}>
                  <View style={styles.pickupTime}>
                    <LocationIcon />
                    <Text style={styles.timeText}>{pickup.time}</Text>
                  </View>
                  <View style={styles.pickupDetails}>
                    <Text style={styles.pickupName}>{pickup.name}</Text>
                    <Text style={styles.pickupAddress}>{pickup.address}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleShowMap(pickup.address)}
                  >
                    <MapIcon />
                    <Text style={styles.mapButtonText}>Bản đồ</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.bottomBar}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Tạm tính</Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString()}đ ▲
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedPickup && styles.disabledButton,
              ]}
              disabled={!selectedPickup}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.changeNoteContainer}>
            <Text style={styles.changeNoteText}>
              Dễ dàng thay đổi điểm đón trả sau khi đặt
            </Text>
          </View> */}
        </SafeAreaView>
      )}
    </View>
  );
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
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  sortContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    color: "#666",
  },
  sortValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
  },
  convenientText: {
    fontSize: 14,
    color: "#666",
  },
  addressLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginLeft: 8,
  },
  noteContainer: {
    backgroundColor: "#fff3cd",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#856404",
  },
  pickupList: {
    flex: 1,
    backgroundColor: "white",
  },
  pickupItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPickupItem: {
    backgroundColor: "#e3f2fd",
  },
  pickupContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pickupTime: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 50,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  pickupDetails: {
    flex: 1,
    marginRight: 12,
  },
  pickupName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  pickupAddress: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  mapButton: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  mapButtonText: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginTop: 2,
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
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  changeNoteContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  changeNoteText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
