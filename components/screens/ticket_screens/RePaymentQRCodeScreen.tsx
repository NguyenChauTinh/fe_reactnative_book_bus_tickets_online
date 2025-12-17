import { Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { api_booking_service } from "../../../apis/api_booking_service";

const RePaymentQRCodeScreen = ({ navigation, route }) => {
  const {
    paymentUrl,
    maHoaDon,
    finalPrice,
    ticketInfo,
    departureLocation,
    destination,
    departureDate,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const viewShotRef = useRef(null);

  // Logic lưu ảnh và kiểm tra trạng thái giữ nguyên như file bạn cung cấp
  const handleSaveQrCode = async () => {
    try {
      setLoading(true);
      if (!permissionResponse?.granted) {
        const { granted } = await requestPermission();
        if (!granted) return Alert.alert("Lỗi", "Cần quyền truy cập ảnh");
      }
      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("VeXeApp", asset, false);
      Alert.alert("Thành công", "Đã lưu mã QR vào thư viện");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu ảnh");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response = await api_booking_service.checkBillStatus(maHoaDon);
      if (response.success && response.trangThai === "THANH_CONG") {
        navigation.replace("RePaymentSuccessScreen", { ...route.params });
      } else {
        Alert.alert(
          "Thông báo",
          "Giao dịch chưa hoàn tất. Vui lòng kiểm tra lại sau ít phút."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán vé {ticketInfo.maVe}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.guideText}>
          Quét mã bằng ứng dụng Ngân hàng hoặc Ví điện tử
        </Text>

        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
          style={styles.qrCard}
        >
          <Text style={styles.brandTag}>THANH TOÁN VNPAY</Text>
          <View style={styles.qrWrapper}>
            <QRCode value={paymentUrl} size={220} />
          </View>
          <Text style={styles.amountLabel}>Số tiền cần trả</Text>
          <Text style={styles.amountValue}>{finalPrice.toLocaleString()}đ</Text>
          <View style={styles.divider} />
          <Text style={styles.billId}>Mã hóa đơn: {maHoaDon}</Text>
        </ViewShot>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveQrCode}>
          <Feather name="download" size={18} color="#007AFF" />
          <Text style={styles.saveBtnText}>Lưu mã về máy</Text>
        </TouchableOpacity>

        <View style={styles.infoSummary}>
          <Text style={styles.summaryTitle}>Thông tin chuyến đi</Text>
          <Text style={styles.summaryText}>
            📍 Tuyến: {departureLocation.tenDiem} → {destination.tenDiem}
          </Text>
          <Text style={styles.summaryText}>📅 Ngày: {departureDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkBtn}
          onPress={handleCheckStatus}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkBtnText}>Xác nhận thanh toán</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  backBtn: { padding: 5 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    color: "#333",
  },
  scrollContent: { padding: 20, alignItems: "center" },
  guideText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  qrCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  brandTag: {
    backgroundColor: "#E3F2FD",
    color: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  amountLabel: { fontSize: 14, color: "#888", marginTop: 20 },
  amountValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E74C3C",
    marginVertical: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
  },
  billId: { fontSize: 13, color: "#999" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  saveBtnText: { color: "#007AFF", fontWeight: "600", marginLeft: 8 },
  infoSummary: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  summaryTitle: { fontWeight: "700", marginBottom: 8, color: "#333" },
  summaryText: { fontSize: 14, color: "#555", marginBottom: 4 },
  checkBtn: {
    backgroundColor: "#27AE60",
    width: "100%",
    padding: 18,
    borderRadius: 15,
    marginTop: 30,
    alignItems: "center",
  },
  checkBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
export default RePaymentQRCodeScreen;