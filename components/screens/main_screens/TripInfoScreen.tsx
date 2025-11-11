"use client";

import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// ✅ SỬA 1: Import Svg và các thành phần
import Svg, { Circle, Path, Rect } from "react-native-svg";
import BookingTimeline from "../main_screens/BookingTimeline";

// ✅ SỬA 2: Sửa lại toàn bộ Icon SVG
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

const BusIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="12" rx="2" fill="#007AFF" />
    <Rect x="5" y="8" width="4" height="3" fill="white" />
    <Rect x="15" y="8" width="4" height="3" fill="white" />
    <Circle cx="7" cy="17" r="1" fill="#666" />
    <Circle cx="17" cy="17" r="1" fill="#666" />
  </Svg>
);

const PersonIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="#666" strokeWidth="2" />
    <Path
      d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
      stroke="#666"
      strokeWidth="2"
    />
  </Svg>
);

const SeatIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="6"
      width="16"
      height="12"
      rx="2"
      stroke="#666"
      strokeWidth="2"
      fill="none"
    />
    <Rect x="6" y="8" width="12" height="8" rx="1" fill="#f0f0f0" />
  </Svg>
);

const HeartIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="#ccc"
      strokeWidth="2"
    />
  </Svg>
);

export default function TripInfoScreen({ navigation, route }) {
  const {
    trip,
    selectedSeats,
    selectedPickup,
    selectedDropoff,
    customerInfo,
    totalPrice,
    departureLocation,
    destination,
    departureDate,
  } = route.params;

  const [insuranceSelected, setInsuranceSelected] = useState(false);
  // ✅ SỬA 3: Đặt loading là false. Màn hình này không cần tải gì cả.

  const insurancePrice = insuranceSelected ? 20000 * selectedSeats.length : 0;
  const finalPrice = totalPrice + insurancePrice;
  const seatNumbers = selectedSeats.map((seat) => seat.number).join(", ");

  const handleContinue = () => {
    // ✅ SỬA 4: Xóa dòng `setLoading(false);`
    // Bạn không cần set loading gì ở đây, chỉ cần điều hướng
    navigation.navigate("PaymentScreen", {
      trip,
      selectedSeats,
      selectedPickup,
      selectedDropoff,
      customerInfo,
      insuranceSelected,
      totalPrice, // Gửi giá gốc
      finalPrice, // Gửi giá cuối cùng (đã có bảo hiểm nếu chọn)
      departureLocation,
      destination,
      departureDate,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
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

        <BookingTimeline currentStep={5} />

        <ScrollView style={styles.content}>
          <View style={styles.tripInfoSection}>
            <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>

            <View style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripDate}>
                  <BusIcon />
                  <Text style={styles.dateText}>{departureDate}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.detailsLink}>Chi tiết</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.busInfo}>
                <View style={styles.busImage}>
                  <BusIcon />
                </View>
                <View style={styles.busDetails}>
                  <Text style={styles.busCompany}>
                    {trip.tuyenDuong?.tenTuyen || "Nhà xe"}
                  </Text>
                  <Text style={styles.busType}>{trip.busType}</Text>
                  <View style={styles.seatInfo}>
                    <PersonIcon />
                    <Text style={styles.seatText}>{selectedSeats.length}</Text>
                    <SeatIcon />
                    <Text style={styles.seatText}>{seatNumbers}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.routeInfo}>
                {/* Điểm đón */}
                <View style={styles.routeItem}>
                  <Text style={styles.routeTime}>{selectedPickup.time}</Text>
                  <View style={styles.routeIcon}>
                    <View style={styles.blueDot} />
                  </View>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routeName}>{selectedPickup.name}</Text>
                    <Text style={styles.routeAddress}>
                      {selectedPickup.address}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("PickupPointScreen", {
                          trip,
                          selectedPickup,
                          selectedSeats,
                          selectedDropoff,
                          departureLocation,
                          destination,
                          departureDate,
                        })
                      }
                    >
                      <Text style={styles.changeButton}>Thay đổi</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Điểm trả */}
                <View style={styles.routeItem}>
                  <Text style={styles.routeTime}>{selectedDropoff.time}</Text>
                  <View style={styles.routeIcon}>
                    <View style={styles.redDot} />
                  </View>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routeName}>{selectedDropoff.name}</Text>
                    <Text style={styles.routeAddress}>
                      {selectedDropoff.address}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DropoffPointScreen", {
                          trip,
                          selectedDropoff,
                          selectedSeats,
                          selectedPickup,
                          departureLocation,
                          destination,
                          departureDate,
                        })
                      }
                    >
                      <Text style={styles.changeButton}>Thay đổi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.cancellationInfo}>
                <Text style={styles.cancellationText}>
                  🟢 Hủy miễn phí 24 giờ trước khởi hành ⓘ
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactHeader}>
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editButton}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Họ tên</Text>
                <Text style={styles.contactValue}>{customerInfo.name}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Điện thoại</Text>
                <Text style={styles.contactValue}>{customerInfo.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{customerInfo.email}</Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.insuranceSection}>
            <Text style={styles.sectionTitle}>Tiện ích</Text>
            <TouchableOpacity
              style={styles.insuranceItem}
              onPress={() => setInsuranceSelected(!insuranceSelected)}
            >
              <View
                style={[
                  styles.checkbox,
                  insuranceSelected && styles.checkedBox,
                ]}
              >
                {insuranceSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.insuranceDetails}>
                <Text style={styles.insuranceTitle}>
                  Bảo hiểm chuyến đi (+
                  {(20000 * selectedSeats.length).toLocaleString()}đ)
                </Text>
                <Text style={styles.insuranceDescription}>
                  Được bồi thường lên đến 400.000.000đ/ghế{"\n"}
                  Cung cấp bởi BAOVIET🏆 x 🛡️Saladin
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Tổng cộng</Text>
            <Text style={styles.totalPrice}>
              {finalPrice.toLocaleString()}đ ▲
            </Text>
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.paymentNoteContainer}>
          <Text style={styles.paymentNoteText}>
            Bạn sẽ chọn hình thức thanh toán ở bước tiếp theo
          </Text>
        </View> */}
      </SafeAreaView>
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
  content: {
    flex: 1,
  },
  tripInfoSection: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  tripCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 16,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tripDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  detailsLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  busInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  busImage: {
    width: 60,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  busDetails: {
    flex: 1,
  },
  busCompany: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  busType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  seatInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  routeTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 60,
  },
  routeIcon: {
    alignItems: "center",
    marginHorizontal: 12,
    paddingTop: 6,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53E3E",
  },
  routeDetails: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  changeButton: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  cancellationInfo: {
    backgroundColor: "#f0f8f0",
    padding: 12,
    borderRadius: 6,
  },
  cancellationText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  contactSection: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editButton: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactLabel: {
    fontSize: 14,
    color: "#666",
  },
  contactValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  insuranceSection: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  insuranceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  insuranceDetails: {
    flex: 1,
  },
  insuranceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  insuranceDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
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
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentNoteContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paymentNoteText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
