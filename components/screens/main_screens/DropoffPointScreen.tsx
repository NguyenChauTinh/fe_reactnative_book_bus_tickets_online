import { useEffect, useMemo, useState } from "react";
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
import BookingTimeline from "../main_screens/BookingTimeline";
// ✅ 2. Import Svg và các thành phần
import Svg, { Circle, Path } from "react-native-svg";

// ✅ 3. Sửa lại các component SVG
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
    <Circle cx="12" cy="12" r="3" fill="#E53E3E" />
    <Path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#E53E3E" strokeWidth="2" />
  </Svg>
);

const MapIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
       {" "}
    <Path
      d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" // Đây là đường viền của bản đồ
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
       {" "}
    <Path
      d="M8 2v16" // Đây là đường gấp ở giữa
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
       {" "}
    <Path
      d="M16 6v16" // Đây là đường gấp ở giữa
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     {" "}
  </Svg>
);

// --- BẮT ĐẦU THAY ĐỔI ---

// Hàm tiện ích để chuyển đổi phút sang định dạng HH:mm
const formatMinutesToHHMM = (totalMinutes) => {
  if (isNaN(totalMinutes)) return "00:00";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};

// Hàm tiện ích để chuyển đổi HH:mm sang số phút
const parseHHMMToMinutes = (timeString) => {
  if (!timeString || !timeString.includes(":")) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export default function DropoffPointScreen({ navigation, route }) {
  const {
    trip,
    selectedSeats,
    selectedPickup,
    departureLocation,
    destination,
    departureDate,
    returnDate,
  } = route.params;
  const [searchText, setSearchText] = useState("");
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [dropoffPoints, setDropoffPoints] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for earliest, 'desc' for latest
  const [loading, setLoading] = useState(true);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (trip?.tuyenDuong?.chiTietTuyen) {
      setLoading(true);
      // Thời gian đến dự kiến của cả chuyến (dạng phút)
      const arrivalTimeInMinutes = parseHHMMToMinutes(trip.arrivalTime);

      // Lọc ra các điểm trả và sắp xếp theo thứ tự
      const dropoffLocations = trip.tuyenDuong.chiTietTuyen
        .filter((diem) => diem.loaiDiem === "tra")
        .sort((a, b) => a.thuTu - b.thuTu);

      let cumulativeTime = 0;

      const formattedPoints = dropoffLocations.map((item, index) => {
        // Thời gian đến tại điểm trả = thời gian đến của chuyến + thời gian di chuyển cộng dồn từ các điểm trước đó
        if (index > 0) {
          cumulativeTime += dropoffLocations[index - 1].thoiGianDuKien || 0;
        }

        return {
          id: item._id,
          time: formatMinutesToHHMM(arrivalTimeInMinutes + cumulativeTime),
          name: item.diaDiem.tenDiaDiem,
          address: `Địa chỉ chi tiết cho: ${item.diaDiem.tenDiaDiem}`,
        };
      });
      setDropoffPoints(formattedPoints);
      setLoading(false);
    }
  }, [trip]);

  const sortedAndFilteredDropoffs = useMemo(() => {
    const sorted = [...dropoffPoints].sort((a, b) => {
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
      (dropoff) =>
        dropoff.name.toLowerCase().includes(searchText.toLowerCase()) ||
        dropoff.address.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [dropoffPoints, sortOrder, searchText]);

  // --- KẾT THÚC THAY ĐỔI ---

  const handleDropoffSelect = (dropoff) => {
    setSelectedDropoff(dropoff);
  };

  const handleContinue = () => {
    if (selectedDropoff) {
      navigation.navigate("CustomerInfoScreen", {
        trip,
        selectedSeats,
        selectedPickup,
        selectedDropoff,
        totalPrice,
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
    const encodedAddress = encodeURIComponent(address);
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
        <SafeAreaView style={styles.container}>
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

          <BookingTimeline currentStep={3} />

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm điểm trả trong danh sách"
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
              <Text style={styles.convenientText}>
                Điểm trả nào thuận tiện nhất?
              </Text>
              <TouchableOpacity>
                <Text style={styles.addressLink}>Nhập địa chỉ của bạn</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              *Lưu ý: Thời gian trả là dự kiến và có thể thay đổi.
            </Text>
          </View>

          <ScrollView style={styles.dropoffList}>
            {sortedAndFilteredDropoffs.map((dropoff) => (
              <TouchableOpacity
                key={dropoff.id}
                style={[
                  styles.dropoffItem,
                  selectedDropoff?.id === dropoff.id &&
                    styles.selectedDropoffItem,
                ]}
                onPress={() => handleDropoffSelect(dropoff)}
              >
                <View style={styles.dropoffContent}>
                  <View style={styles.dropoffTime}>
                    <LocationIcon />
                    <Text style={styles.timeText}>{dropoff.time}</Text>
                  </View>
                  <View style={styles.dropoffDetails}>
                    <Text style={styles.dropoffName}>{dropoff.name}</Text>
                    <Text style={styles.dropoffAddress}>{dropoff.address}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleShowMap(dropoff.address)}
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
                !selectedDropoff && styles.disabledButton,
              ]}
              disabled={!selectedDropoff}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.changeNoteContainer}>
            <Text style={styles.changeNoteText}>
              Dễ dàng thay đổi điểm đón trả sau khi đặt
            </Text>
          </View>
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
    color: "#4A90E2",
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
  dropoffList: {
    flex: 1,
    backgroundColor: "white",
  },
  dropoffItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedDropoffItem: {
    backgroundColor: "#e3f2fd",
  },
  dropoffContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dropoffTime: {
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
  dropoffDetails: {
    flex: 1,
    marginRight: 12,
  },
  dropoffName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dropoffAddress: {
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
    color: "#4A90E2",
    textDecorationLine: "underline",
    marginTop: 2,
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
