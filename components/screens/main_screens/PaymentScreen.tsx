// PaymentScreen.tsx
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import PaymentCountdown from "./PaymentCountdown";

const BusIcon = ({ size = 30, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 16h14V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10Zm0 0v3a1 1 0 0 0 1 1h1m12-4v3a1 1 0 0 1-1 1h-1M5 16h14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const ATMIcon = ({ size = 30, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={6}
      width={18}
      height={12}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M7 10h10M7 14h6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const QRIcon = ({ size = 30, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h6v6H4V4Zm10 0h6v6h-6V4Zm0 10h6v6h-6v-6ZM4 14h6v6H4v-6Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const StoreIcon = ({ size = 20, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9h18l-1 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 9Zm3-6h12l3 6H3l3-6Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

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

const PaymentScreen = ({ navigation, route }) => {
  const { trip, selectedSeats, selectedPickup, selectedDropoff, totalPrice } =
    route.params;

  const handleContinue = () => {
    navigation.navigate("PaymentScreen", {
      trip,
      selectedSeats,
      selectedPickup,
      selectedDropoff,
      totalPrice,
    });
  };
  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Countdown */}
      <View style={styles.warningBox}>
        <PaymentCountdown />
      </View>

      {/* Bảo hiểm */}
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>Chuyến đi chưa được bảo vệ</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Thêm bảo hiểm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Option 1 */}
        <TouchableOpacity style={styles.option}>
          <BusIcon />
          <View>
            <Text style={styles.optionText}>Thanh toán khi lên xe</Text>
            <Text style={styles.optionTextSub}>
              Bạn có thể thanh toán cho tài xế khi lên xe.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Option 2 */}
        {/* <TouchableOpacity style={styles.option}>
          <ATMIcon />
          <Text style={styles.optionText}>
            Thẻ ATM nội địa / Internet Banking
          </Text>
        </TouchableOpacity> */}

        {/* Option 3 */}
        <TouchableOpacity style={styles.option}>
          <QRIcon />
          <View>
            <Text style={styles.optionText}>Thanh toán VNPAY - QR</Text>
            <Text style={styles.optionTextSub}>
              Thanh toán qua QR code của VNPAY.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Option 4 */}
        {/* <TouchableOpacity style={styles.option}>
          <StoreIcon />
          <Text style={styles.optionText}>
            Tại cửa hàng tiện lợi hoặc siêu thị
          </Text>
        </TouchableOpacity> */}

        {/* Điểm thưởng */}
      </ScrollView>

      {/* Footer */}
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
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  time: { color: "#fff", fontSize: 14 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  subtitle: { color: "#fff", fontSize: 14, marginTop: 4 },
  warningBox: { backgroundColor: "#FFCC80", padding: 10 },
  warningText: { color: "#E65100", fontWeight: "600" },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF3CD",
  },
  alertText: { color: "#856404", flex: 1 },
  link: { color: "#1976D2", fontWeight: "600" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { marginLeft: 10, fontSize: 20, fontWeight: "600" },
  optionTextSub: { marginLeft: 10, fontSize: 14, color: "#666" },
  pointBox: { padding: 12, backgroundColor: "#FFF9E6" },
  pointText: { color: "#D48806", fontWeight: "600" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  total: { fontSize: 16, fontWeight: "bold" },
  payButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  payText: { fontSize: 16, fontWeight: "bold", color: "#000" },
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
