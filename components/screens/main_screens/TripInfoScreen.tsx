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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="12" rx="2" fill="#4A90E2" />
    <rect x="5" y="8" width="4" height="3" fill="white" />
    <rect x="15" y="8" width="4" height="3" fill="white" />
    <circle cx="7" cy="17" r="1" fill="#666" />
    <circle cx="17" cy="17" r="1" fill="#666" />
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#666" strokeWidth="2" />
    <path
      d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
      stroke="#666"
      strokeWidth="2"
    />
  </svg>
);

const SeatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="6"
      width="16"
      height="12"
      rx="2"
      stroke="#666"
      strokeWidth="2"
      fill="none"
    />
    <rect x="6" y="8" width="12" height="8" rx="1" fill="#f0f0f0" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="#ccc"
      strokeWidth="2"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="#4CAF50"
      strokeWidth="2"
      fill="#4CAF50"
      fillOpacity="0.1"
    />
  </svg>
);

export default function TripInfoScreen({ navigation, route }) {
  const { trip, selectedSeats, selectedPickup, selectedDropoff, totalPrice } =
    route.params;
  const [customerInfo, setCustomerInfo] = useState({
    name: "T Ng",
    phone: "84372374650",
    email: "chautinh05122@gmail.com",
  });
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [accidentInsuranceSelected, setAccidentInsuranceSelected] =
    useState(false);

  // const totalPrice = selectedSeats.reduce(
  //   (sum, seat) => sum + (seat.price || 0),
  //   0
  // );
  const insurancePrice = insuranceSelected ? 20000 : 0;
  const accidentInsurancePrice = accidentInsuranceSelected ? 25000 : 0;
  const finalPrice = totalPrice + insurancePrice + accidentInsurancePrice;

  const handleContinue = () => {
    navigation.navigate("PaymentScreen", {
      trip,
      selectedSeats,
      selectedPickup,
      selectedDropoff,
      insuranceSelected,
      accidentInsuranceSelected,
      totalPrice,
    });
  };

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
          <Text style={styles.detailsButtonText}>Chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.activeStepText}>Thông tin chuyến đi</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tripInfoSection}>
          <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>

          <View style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={styles.tripDate}>
                <BusIcon />
                <Text style={styles.dateText}>T3, 23/09/2025</Text>
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
                <Text style={styles.busCompany}>Hiệp Thành</Text>
                <Text style={styles.busType}>Limousine 34 phòng đơn</Text>
                <View style={styles.seatInfo}>
                  <PersonIcon />
                  <Text style={styles.seatText}>1</Text>
                  <SeatIcon />
                  <Text style={styles.seatText}>B11</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.favoriteButton}>
                <HeartIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeItem}>
                <Text style={styles.routeTime}>08:00</Text>
                <View style={styles.routeIcon}>
                  <View style={styles.blueDot} />
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeName}>Bến xe Miền Tây</Text>
                  <Text style={styles.routeAddress}>
                    395 Kinh Dương Vương, Phường An Lạc, Bình Tân, Hồ Chí Minh
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.changeButton}>Thay đổi</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.routeItem}>
                <Text style={styles.routeTime}>13:00</Text>
                <View style={styles.routeIcon}>
                  <View style={styles.redDot} />
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeName}>Bến xe Tân Châu</Text>
                  <Text style={styles.routeAddress}>
                    Trần Phú, Xã Tân An, Tân Châu, An Giang
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.changeButton}>Thay đổi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.cancellationInfo}>
              <Text style={styles.cancellationText}>
                🟢 Hủy miễn phí 00:00 • 23/09/2025 ⓘ
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contactSection}>
          <View style={styles.contactHeader}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Chính sửa</Text>
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

        <View style={styles.insuranceSection}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>

          <TouchableOpacity
            style={styles.insuranceItem}
            onPress={() => setInsuranceSelected(!insuranceSelected)}
          >
            <View
              style={[styles.checkbox, insuranceSelected && styles.checkedBox]}
            >
              {insuranceSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.insuranceDetails}>
              <Text style={styles.insuranceTitle}>
                Bảo hiểm chuyến đi (+20.000đ/ghế)
              </Text>
              <Text style={styles.insuranceDescription}>
                Được bồi thường lên đến 400.000.000đ/ghế{"\n"}
                Cung cấp bởi BAOVIET🏆 x 🛡️Saladin
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.insuranceDetails}>
            <View style={styles.insuranceCard}>
              <Text style={styles.insuranceCardTitle}>Bảo hiểm tai nạn</Text>
              <Text style={styles.insuranceCardDescription}>
                Hỗ trợ viện phí lên đến 25 triệu đồng khi xảy ra tai nạn.
              </Text>

              <Text style={styles.policyTitle}>
                Chính sách Hoàn Hủy chuyến đi
              </Text>
              <Text style={styles.policyDescription}>
                Hoàn lại 100% tiền vé thực tế nếu chuyến đi bị hủy bởi các lý do
                khách quan hoặc bất khả kháng về sức khỏe.
              </Text>

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ Chỉ áp dụng với ngân hàng Việt Nam
                </Text>
                <TouchableOpacity>
                  <Text style={styles.detailsLink}>Chi tiết</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.insuranceSelectButton}
                onPress={() =>
                  setAccidentInsuranceSelected(!accidentInsuranceSelected)
                }
              >
                <Text style={styles.insuranceSelectText}>
                  Bồi thường trực tuyến nhanh chóng, dễ dàng
                  <Text style={styles.detailsLink}>Chi tiết</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tạm tính</Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString()}đ ▲
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentNoteContainer}>
        <Text style={styles.paymentNoteText}>
          Bạn sẽ chọn hình thức thanh toán ở bước tiếp theo
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
    color: "#4A90E2",
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
    paddingTop: 2,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4A90E2",
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
    color: "#4A90E2",
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
    color: "#4A90E2",
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
  insuranceCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  insuranceCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  insuranceCardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  policyDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    flex: 1,
  },
  insuranceSelectButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  insuranceSelectText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
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
