"use client";

import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="#999" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" stroke="#999" strokeWidth="2" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="#E53E3E" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#E53E3E" strokeWidth="2" />
  </svg>
);

const MapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      stroke="#4A90E2"
      strokeWidth="2"
    />
    <polyline points="14,2 14,8 20,8" stroke="#4A90E2" strokeWidth="2" />
  </svg>
);

export default function DropoffPointScreen({ navigation, route }) {
  const { trip, selectedSeats, selectedPickup } = route.params;
  const [searchText, setSearchText] = useState("");
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "T Ng",
    phone: "84372374650",
    email: "chautinh05122@gmail.com",
  });

  const dropoffPoints = [
    {
      id: 1,
      time: "13:15",
      name: "Bến xe Tân Châu",
      address: "Trần Phú, Xã Tân An, Tân Châu, An Giang",
    },
    {
      id: 2,
      time: "13:25",
      name: "Chợ Tân Châu",
      address: "Trung tâm thị trấn Tân Châu, An Giang",
    },
    {
      id: 3,
      time: "13:30",
      name: "Bến phà Tân Châu",
      address: "Bờ sông Tiền, Tân Châu, An Giang",
    },
    {
      id: 4,
      time: "13:35",
      name: "Khu du lịch Tân Châu",
      address: "Khu vực du lịch sinh thái, Tân Châu",
    },
  ];

  const filteredDropoffs = dropoffPoints.filter(
    (dropoff) =>
      dropoff.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dropoff.address.toLowerCase().includes(searchText.toLowerCase())
  );

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
      });
    }
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hiệp Thành</Text>
          <Text style={styles.headerSubtitle}>08:00 • T3, 23/09/2025</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Chi tiết xe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.activeStepText}>Chọn điểm trả</Text>
      </View>

      {/* <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.completedStepCircle}>
            <Text style={styles.stepNumber}>✓</Text>
          </View>
          <Text style={styles.completedStepText}>Chọn chỗ</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.completedStepCircle}>
            <Text style={styles.stepNumber}>✓</Text>
          </View>
          <Text style={styles.completedStepText}>Chọn điểm đón</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.activeStepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.activeStepText}>Chọn điểm trả</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.inactiveStepCircle}>
            <Text style={styles.inactiveStepNumber}>4</Text>
          </View>
          <Text style={styles.inactiveStepText}>Nh</Text>
        </View>
      </View> */}

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
        <Text style={styles.sortText}>Sắp xếp theo</Text>
        <Text style={styles.sortValue}>Sớm nhất ▼</Text>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "auto",
            flex: 1,
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flexShrink: 1,
            flexGrow: 1,
            flexBasis: "auto",
            alignContent: "flex-end",
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
          *Lưu ý: Sử dụng tên địa phương trước sắp nhập
        </Text>
      </View>

      <ScrollView style={styles.dropoffList}>
        {filteredDropoffs.map((dropoff) => (
          <TouchableOpacity
            key={dropoff.id}
            style={[
              styles.dropoffItem,
              selectedDropoff?.id === dropoff.id && styles.selectedDropoffItem,
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
              <TouchableOpacity style={styles.mapButton}>
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
    flex: 1,
  },
  activeStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },
  completedStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
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
  completedStepText: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  inactiveStepText: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  progressLine: {
    width: 30,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
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
    marginLeft: "auto",
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
