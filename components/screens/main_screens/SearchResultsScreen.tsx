"use client";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { api_trip_schedule_service } from "../../../apis/api_trip_schedule_service";

// ====== ICONS (Giữ nguyên) ======
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
const FilterIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M7 12H17M10 18H14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const SortIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M7 12H17M10 18H14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const TimeIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#4A90E2" strokeWidth="2" />
    <Path
      d="M12 6V12L16 14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Helper
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  if (typeof priceStr !== "string") return 0;
  return Number(priceStr.replace(/[^\d]/g, ""));
};

// ... (Component TimeFilterModal giữ nguyên) ...
const generateTimeSlots = () => {
  const slots = [{ label: "Tất cả (00:00+)", minutes: 0 }];
  for (let i = 1; i <= 23; i++) {
    const hourString = String(i).padStart(2, "0");
    slots.push({
      label: `${hourString}:00+`,
      minutes: i * 60,
    });
  }
  return slots;
};
const timeSlots = generateTimeSlots();
const TimeFilterModal = ({ isVisible, onClose, onSelectTime, currentTime }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>Chọn giờ khởi hành</Text>
          <ScrollView>
            {timeSlots.map((slot) => {
              const isSelected = slot.minutes === currentTime;
              return (
                <TouchableOpacity
                  key={slot.label}
                  style={[
                    styles.timeSlotButton,
                    isSelected && styles.timeSlotButtonSelected,
                  ]}
                  onPress={() => onSelectTime(slot.minutes)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

// =============================================================
// MÀN HÌNH CHÍNH
// =============================================================
export default function SearchResultsScreen({ navigation, route }) {
  const { departureLocation, destination, departureDate, returnDate } =
    route.params;

  const [loading, setLoading] = useState(true);
  const [allTrips, setAllTrips] = useState([]);
  const [displayedTrips, setDisplayedTrips] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("time_asc");
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [timeFilter, setTimeFilter] = useState(0);

  // Lấy ngày giờ hiện tại VÀ ngày tìm kiếm
  const [todayInfo] = useState(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    const currentDay = String(now.getDate()).padStart(2, "0");
    const todayString = `${currentYear}-${currentMonth}-${currentDay}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let formattedSearchDate = "";
    if (departureDate) {
      const dateString = departureDate.split(", ")[1];
      const parts = dateString.split("/");
      formattedSearchDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return {
      todayString,
      currentMinutes,
      formattedSearchDate,
      isSearchingForToday: todayString === formattedSearchDate,
    };
  });

  // --- HÀM FETCH DỮ LIỆU (Giữ nguyên) ---
  useEffect(() => {
    const fetchBusTrips = async () => {
      setLoading(true);
      try {
        const response =
          await api_trip_schedule_service.getChuyenXeTheoNgayVaDiaDiem(
            todayInfo.formattedSearchDate,
            departureLocation._id,
            destination._id
          );

        console.log("Fetched bus trips:", response.data);
        setAllTrips(response.data || []);
      } catch (error) {
        console.error("Error fetching bus trips:", error);
        setAllTrips([]);
      } finally {
        setLoading(false);
      }
    };

    if (departureDate && departureLocation?._id && destination?._id) {
      fetchBusTrips();
    }
  }, [
    departureDate,
    departureLocation,
    destination,
    todayInfo.formattedSearchDate,
  ]);

  // --- LOGIC LỌC VÀ SẮP XẾP ---
  useEffect(() => {
    let processedTrips = [...allTrips];

    // 1. Lọc các chuyến sắp chạy (nếu là hôm nay)
    if (todayInfo.isSearchingForToday) {
      const filterTime = todayInfo.currentMinutes + 60;
      console.log(
        `Đang lọc chuyến xe cho HÔM NAY. Giờ hiện tại: ${todayInfo.currentMinutes} phút. Chỉ hiển thị chuyến sau: ${filterTime} phút.`
      );

      processedTrips = processedTrips.filter((trip) => {
        const tripDate = trip.ngayKhoiHanh.split("T")[0];
        if (tripDate !== todayInfo.todayString) {
          return true; // Giữ lại (vì là ngày tương lai)
        }
        return trip.gioKhoiHanh > filterTime; // Lọc chuyến của hôm nay
      });
    }

    // 2. Lọc theo mốc giờ (do người dùng chọn trong modal)
    processedTrips = processedTrips.filter(
      (trip) => trip.gioKhoiHanh >= timeFilter
    );

    // ✅ --- BẮT ĐẦU SỬA LỖI SẮP XẾP --- ✅
    // 3. Sắp xếp
    processedTrips.sort((a, b) => {
      // BƯỚC A: Sắp xếp theo NGÀY KHỞI HÀNH trước (Tăng dần)
      // Chuyển "2025-11-03T00:00:00.000Z" thành đối tượng Date để so sánh
      const dateA = new Date(a.ngayKhoiHanh);
      const dateB = new Date(b.ngayKhoiHanh);

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // BƯỚC B: Nếu cùng ngày, mới sắp xếp theo tiêu chí phụ (sortCriteria)
      switch (sortCriteria) {
        case "price_asc":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price_desc":
          return parsePrice(b.price) - parsePrice(a.price);
        case "time_asc":
        default:
          // Giờ khởi hành (sớm nhất)
          return a.gioKhoiHanh - b.gioKhoiHanh;
      }
    });
    // ✅ --- KẾT THÚC SỬA LỖI SẮP XẾP --- ✅

    setDisplayedTrips(processedTrips);
  }, [allTrips, sortCriteria, timeFilter, todayInfo]);

  // --- CÁC HÀM XỬ LÝ (handlers) (Giữ nguyên) ---
  const handleSeatSelection = (trip) => {
    navigation.navigate("SeatSelectionScreen", {
      trip,
      departureLocation,
      destination,
      departureDate,
      returnDate,
    });
  };

  const handleSortPress = () => {
    if (sortCriteria === "time_asc") setSortCriteria("price_asc");
    else if (sortCriteria === "price_asc") setSortCriteria("price_desc");
    else setSortCriteria("time_asc");
  };

  const handleTimePress = () => {
    setIsTimeModalVisible(true);
  };

  const handleTimeSelect = (minutes) => {
    setTimeFilter(minutes);
    setIsTimeModalVisible(false);
  };

  const handleFilterPress = () => {
    console.log("Mở modal lọc chi tiết...");
  };

  // --- RENDER (Giữ nguyên) ---
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>Đang tải danh sách chuyến...</Text>
      </View>
    );
  }

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

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <FilterIcon />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleSortPress}>
          <SortIcon />
          <Text style={styles.filterText}>Sắp xếp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleTimePress}>
          <TimeIcon />
          <Text style={styles.filterText}>Giờ đi</Text>
        </TouchableOpacity>
      </View>

      {/* Bus Trip List */}
      <ScrollView style={styles.tripList}>
        {displayedTrips.length > 0 ? (
          displayedTrips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.timeInfo}>
                <Text style={styles.departureTime}>{trip.departureTime}</Text>
                <Text style={styles.duration}>{trip.duration}</Text>
                <Text style={styles.arrivalTime}>{trip.arrivalTime}</Text>
              </View>
              <View style={styles.stationInfo}>
                <Text style={styles.stationText} numberOfLines={1}>
                  {trip.departureStation}
                </Text>
                <Text style={styles.arrowIcon}>→</Text>
                <Text style={styles.stationTextRight} numberOfLines={1}>
                  {trip.arrivalStation}
                </Text>
              </View>
              <View style={styles.detailsAndPriceRow}>
                <Text style={styles.busType} numberOfLines={1}>
                  {trip.busType}
                </Text>
                <View style={styles.priceInfo}>
                  <Text style={styles.price}>{trip.price}</Text>
                  <Text style={styles.seatsLeft}>{trip.seatsLeft}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.selectSeatButton}
                onPress={() => handleSeatSelection(trip)}
              >
                <Text style={styles.selectSeatText}>Chọn chỗ</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Không tìm thấy chuyến xe nào phù hợp.
            </Text>
            <Text style={styles.noResultsSubText}>
              Vui lòng thử thay đổi bộ lọc hoặc tìm ngày khác.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Render Modal */}
      <TimeFilterModal
        isVisible={isTimeModalVisible}
        onClose={() => setIsTimeModalVisible(false)}
        onSelectTime={handleTimeSelect}
        currentTime={timeFilter}
      />
    </SafeAreaView>
  );
}

// =============================================================
// STYLES (Giữ nguyên)
// =============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  filterBar: {
    backgroundColor: "#2c5aa0",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-around",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  filterText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  tripList: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  departureTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  duration: {
    fontSize: 12,
    color: "#666",
  },
  arrivalTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  stationInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 12,
    backgroundColor: "#F7F9F9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  stationText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  stationTextRight: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  arrowIcon: {
    marginHorizontal: 8,
    color: "#666",
    fontWeight: "bold",
  },
  detailsAndPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  busType: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 8,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  seatsLeft: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  selectSeatButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  selectSeatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noResultsSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },

  // --- Style cho Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timeSlotButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  timeSlotButtonSelected: {
    backgroundColor: "#E6F0FA",
    borderRadius: 8,
    borderBottomColor: "#E6F0FA",
  },
  timeSlotText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  timeSlotTextSelected: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  // (Các style rác)
  detailsContainer: {},
  changeButton: {},
  changeButtonText: {},
  transportTabs: {},
  activeTab: {},
  inactiveTab: {},
  activeTabText: {},
  inactiveTabText: {},
  discountBadge: {},
  discountText: {},
  tripHeader: {},
  companyInfo: {},
  busImage: {},
  companyDetails: {},
  companyName: {},
  ratingContainer: {},
  rating: {},
  reviews: {},
  heartButton: {},
  features: {},
  featureText: {},
  departureStation: {},
  arrivalStation: {},
});
