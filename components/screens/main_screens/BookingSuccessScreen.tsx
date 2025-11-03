// BookingSuccessScreen.tsx
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- ICONS ---
const CheckIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
      stroke="#4CAF50"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4L12 14.01l-3-3"
      stroke="#4CAF50"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hàm tiện ích để hiển thị tên phương thức thanh toán
const getPaymentMethodName = (method) => {
  if (method === "TAI_XE") return "Thanh toán khi lên xe";
  if (method === "VNPAY") return "Đã thanh toán (VNPAY)";
  return "Chưa xác định";
};

const BookingSuccessScreen = ({ navigation, route }) => {
  const {
    ticketInfo,
    trip,
    departureLocation,
    destination,
    departureDate,
    finalPrice,
    discountAmount,
  } = route.params;

  // Lấy thông tin chi tiết từ vé đầu tiên (giả định chung thông tin)
  const firstDetail = ticketInfo.chiTiet[0];
  const seatNumbers = ticketInfo.chiTiet.map((t) => t.maChoNgoi).join(", ");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successContainer}>
          <CheckIcon />
          <Text style={styles.successTitle}>Đặt vé thành công!</Text>
          <Text style={styles.successSubtitle}>
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.
          </Text>
        </View>

        {/* Thông tin vé */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin vé</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã vé</Text>
            <Text style={[styles.infoValue, styles.ticketCode]}>
              {ticketInfo.maVe}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hành khách</Text>
            <Text style={styles.infoValue}>{firstDetail.tenKhachHang}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>{firstDetail.soDienThoai}</Text>
          </View>
        </View>

        {/* Thông tin chuyến đi */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin chuyến đi</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tuyến đường</Text>
            <Text style={styles.infoValue}>
              {departureLocation.tenDiaDiem} → {destination.tenDiaDiem}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày đi</Text>
            <Text style={styles.infoValue}>{departureDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giờ khởi hành</Text>
            <Text style={styles.infoValue}>{trip.departureTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số ghế</Text>
            <Text style={styles.infoValue}>{seatNumbers}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Điểm đón</Text>
            <Text style={styles.infoValue}>{firstDetail.diemDon}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Điểm trả</Text>
            <Text style={styles.infoValue}>{firstDetail.diemTra}</Text>
          </View>
        </View>

        {/* Thông tin thanh toán */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
          {discountAmount > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giảm giá</Text>
              <Text style={[styles.infoValue, styles.discountValue]}>
                - {discountAmount.toLocaleString()}đ
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng cộng</Text>
            <Text style={[styles.infoValue, styles.totalPrice]}>
              {finalPrice.toLocaleString()}đ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thanh toán</Text>
            <Text style={styles.infoValue}>
              {getPaymentMethodName(firstDetail.hinhThucThanhToan)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút xác nhận */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate("Main")} // Quay về màn hình đầu tiên
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 100, // Để chừa không gian cho nút bottom bar
  },
  successContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1.5,
    textAlign: "right",
  },
  ticketCode: {
    fontWeight: "bold",
    color: "#4A90E2",
  },
  discountValue: {
    color: "green",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  bottomBar: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
