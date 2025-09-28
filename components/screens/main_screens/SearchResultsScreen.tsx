"use client";

import { useState } from "react";
import {
  Image,
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

const BusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="12" rx="2" fill="#4A90E2" />
    <circle cx="7" cy="17" r="1" fill="#666" />
    <circle cx="17" cy="17" r="1" fill="#666" />
    <rect x="5" y="8" width="14" height="6" rx="1" fill="white" />
  </svg>
);

const PlaneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
      fill="#666"
    />
  </svg>
);

const TrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="12" rx="2" fill="#666" />
    <rect x="6" y="8" width="12" height="6" rx="1" fill="white" />
    <circle cx="8" cy="17" r="1" fill="#666" />
    <circle cx="16" cy="17" r="1" fill="#666" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61C20.32 4.09 19.69 3.68 19 3.41C18.31 3.14 17.58 3 16.84 3C16.1 3 15.37 3.14 14.68 3.41C13.99 3.68 13.36 4.09 12.84 4.61L12 5.45L11.16 4.61C10.11 3.56 8.69 3 7.16 3C5.63 3 4.21 3.56 3.16 4.61C2.11 5.66 1.55 7.08 1.55 8.61C1.55 10.14 2.11 11.56 3.16 12.61L12 21.45L20.84 12.61C21.89 11.56 22.45 10.14 22.45 8.61C22.45 7.08 21.89 5.66 20.84 4.61Z"
      stroke="#ccc"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#FFD700"
    />
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6H21M7 12H17M10 18H14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SortIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6H21M7 12H17M10 18H14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TimeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#4A90E2" strokeWidth="2" />
    <path
      d="M12 6V12L16 14"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BusStopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2"
      stroke="#4A90E2"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="7" cy="17" r="1" fill="#4A90E2" />
    <circle cx="17" cy="17" r="1" fill="#4A90E2" />
  </svg>
);

export default function SearchResultsScreen({ navigation, route }) {
  const { departureLocation, destination, departureDate } = route.params;
  const [showChangeModal, setShowChangeModal] = useState(false);

  const busTrips = [
    {
      id: 1,
      company: "Thiện Thiện Hương",
      busType: "Limousine 34 Phòng...",
      rating: 4.5,
      reviews: 123,
      departureTime: "11:00",
      arrivalTime: "17:40",
      duration: "6h 40p",
      departureStation: "Văn phòng Sài Gòn",
      arrivalStation: "Vp. Tân Châu",
      price: "220.000đ",
      seatsLeft: "15 chỗ trống",
      features: ["Xác nhận chỗ ngay lập tức"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lb4pd2mrRTHmxJQ2OcVAhUjF3malMT.png",
    },
    {
      id: 2,
      company: "Tân Niên",
      busType: "Limousine Phòng Đôi 24...",
      rating: 4.5,
      reviews: 1806,
      departureTime: "02:50",
      arrivalTime: "08:25",
      duration: "5h 35p",
      departureStation: "Ngã 4 An Sương",
      arrivalStation: "Bến xe Long Xuyên",
      price: "350.000đ",
      seatsLeft: "1 chỗ trống",
      features: ["Trả tận nơi", "Xác nhận chỗ ngay lập tức"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lb4pd2mrRTHmxJQ2OcVAhUjF3malMT.png",
    },
    {
      id: 3,
      company: "Phương Trang",
      busType: "Limousine Phòng Đôi 22 chỗ có WC",
      rating: 4.3,
      reviews: 567,
      departureTime: "14:30",
      arrivalTime: "19:15",
      duration: "4h 45p",
      departureStation: "Bến xe Miền Tây",
      arrivalStation: "Bến xe An Giang",
      price: "350.000đ",
      seatsLeft: "8 chỗ trống",
      features: ["Có WC trên xe", "Xác nhận chỗ ngay lập tức"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lb4pd2mrRTHmxJQ2OcVAhUjF3malMT.png",
    },
    {
      id: 4,
      company: "Hùng Cường",
      busType: "Limousine 32 Phòng chỗ có WC",
      rating: 4.3,
      reviews: 567,
      departureTime: "14:30",
      arrivalTime: "19:15",
      duration: "4h 45p",
      departureStation: "Bến xe Miền Tây",
      arrivalStation: "Bến xe An Giang",
      price: "350.000đ",
      seatsLeft: "8 chỗ trống",
      features: ["Xác nhận chỗ ngay lập tức"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lb4pd2mrRTHmxJQ2OcVAhUjF3malMT.png",
    },
  ];

  const handleSeatSelection = (trip) => {
    navigation.navigate("SeatSelectionScreen", { trip });
  };

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
          <Text style={styles.headerTitle}>
            {departureLocation} → {destination}
          </Text>
          <Text style={styles.headerSubtitle}>{departureDate}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowChangeModal(true)}
          style={styles.changeButton}
        >
          <Text style={styles.changeButtonText}>Thay đổi</Text>
        </TouchableOpacity>
      </View>

      {/* Transport Tabs */}

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <FilterIcon />
          <Text style={styles.filterText}>Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <SortIcon />
          <Text style={styles.filterText}>Sắp xếp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <TimeIcon />
          <Text style={styles.filterText}>Giờ đi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <BusStopIcon />
          <Text style={styles.filterText}>Nhà xe</Text>
        </TouchableOpacity>
      </View>

      {/* Bus Trip List */}
      <ScrollView style={styles.tripList}>
        {busTrips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={styles.timeInfo}>
                <Text style={styles.departureTime}>{trip.departureTime}</Text>
                <Text style={styles.duration}>{trip.duration}</Text>
                <Text style={styles.arrivalTime}>{trip.arrivalTime}</Text>
              </View>
              <View style={styles.stationInfo}>
                <Text style={styles.departureStation}>
                  {trip.departureStation}
                </Text>
                <Text style={styles.arrivalStation}>{trip.arrivalStation}</Text>
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.price}>{trip.price}</Text>
                <Text style={styles.seatsLeft}>{trip.seatsLeft}</Text>
              </View>
            </View>

            <View style={styles.companyInfo}>
              <Image source={{ uri: trip.image }} style={styles.busImage} />
              <View style={styles.companyDetails}>
                <Text style={styles.companyName}>{trip.company}</Text>
                <Text style={styles.busType}>{trip.busType}</Text>
                <View style={styles.ratingContainer}>
                  <StarIcon />
                  <Text style={styles.rating}>{trip.rating}</Text>
                  <Text style={styles.reviews}>({trip.reviews} đánh giá)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <HeartIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.features}>
              {trip.features.map((feature, index) => (
                <Text key={index} style={styles.featureText}>
                  ⚡ {feature}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.selectSeatButton}
              onPress={() => handleSeatSelection(trip)}
            >
              <Text style={styles.selectSeatText}>Chọn chỗ</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Change Search Modal */}
      {showChangeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thay đổi tìm kiếm</Text>
              <TouchableOpacity onPress={() => setShowChangeModal(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </View>
            {/* Add your search form here - similar to MainScreen */}
            <Text style={styles.modalText}>
              Modal content will be implemented here
            </Text>
          </View>
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
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  changeButtonText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  transportTabs: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeTab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#4A90E2",
    paddingBottom: 8,
  },
  inactiveTab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    position: "relative",
  },
  activeTabText: {
    color: "#4A90E2",
    fontWeight: "bold",
    marginTop: 4,
  },
  inactiveTabText: {
    color: "#666",
    marginTop: 4,
  },
  discountBadge: {
    position: "absolute",
    top: -8,
    right: 20,
    backgroundColor: "#ff4444",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
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
  tripHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeInfo: {
    alignItems: "center",
    marginRight: 16,
  },
  departureTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  duration: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },
  arrivalTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  stationInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  departureStation: {
    fontSize: 14,
    color: "#666",
  },
  arrivalStation: {
    fontSize: 14,
    color: "#666",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seatsLeft: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  busImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  busType: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#333",
  },
  reviews: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  heartButton: {
    padding: 8,
  },
  features: {
    marginBottom: 16,
  },
  featureText: {
    fontSize: 12,
    color: "#4A90E2",
    marginBottom: 4,
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 16,
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
