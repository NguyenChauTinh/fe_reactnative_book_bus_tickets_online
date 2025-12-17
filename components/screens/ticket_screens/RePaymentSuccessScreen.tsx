import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RePaymentSuccessScreen = ({ navigation, route }: any) => {
  const {
    ticketInfo,
    trip,
    departureLocation,
    destination,
    departureDate,
    finalPrice,
  } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statusSection}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={60} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successSub}>
            Hệ thống đã cập nhật trạng thái vé của bạn.
          </Text>
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Chi tiết hóa đơn</Text>
            <Feather name="printer" size={18} color="#888" />
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Mã vé</Text>
            <Text style={styles.receiptValueBold}>{ticketInfo.maVe}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Tuyến đi</Text>
            <Text style={styles.receiptValue}>
              {departureLocation.tenDiem} - {destination.tenDiem}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Ngày khởi hành</Text>
            <Text style={styles.receiptValue}>{departureDate}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Danh sách ghế</Text>
            <Text style={styles.receiptValue}>
              {ticketInfo.chiTiet.map((c) => c.maChoNgoi).join(", ")}
            </Text>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Tổng số tiền</Text>
            <Text style={styles.totalValue}>
              {finalPrice.toLocaleString()}đ
            </Text>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Feather name="info" size={16} color="#007AFF" />
          <Text style={styles.tipText}>
            Vui lòng có mặt tại điểm đón trước 15-30 phút để lên xe.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.btnTextSecondary}>Về Trang Chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() =>
            navigation.navigate("TicketDetailScreen", {
              veXeId: ticketInfo._id,
              chuyenXeId: trip._id,
            })
          }
        >
          <Text style={styles.btnTextPrimary}>Xem Chi Tiết Vé</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 24 },
  statusSection: { alignItems: "center", marginVertical: 40 },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#27AE60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: { fontSize: 24, fontWeight: "800", color: "#333" },
  successSub: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
  receiptCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  cardHeaderTitle: { fontWeight: "700", fontSize: 16 },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  receiptLabel: { color: "#777", fontSize: 14 },
  receiptValue: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  receiptValueBold: { color: "#007AFF", fontSize: 14, fontWeight: "800" },
  totalSection: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#E74C3C" },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
  },
  actionArea: {
    padding: 20,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  btnSecondary: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    marginRight: 10,
    alignItems: "center",
  },
  btnTextSecondary: { color: "#007AFF", fontWeight: "700" },
  btnPrimary: {
    flex: 1.5,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTextPrimary: { color: "#fff", fontWeight: "700" },
});
export default RePaymentSuccessScreen;
