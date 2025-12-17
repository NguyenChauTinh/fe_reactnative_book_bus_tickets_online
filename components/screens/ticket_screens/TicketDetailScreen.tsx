"use client";

import { api_trip_schedule_service } from "@/apis/api_trip_schedule_service";
import BackIcon from "@/components/components/icons/BackIcon";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
// 1. Import hooks và icons

// 2. Import API services
import { api_booking_service } from "../../../apis/api_booking_service";

// 3. Định nghĩa Interface
interface VeXe {
  _id: string;
  maVe: string;
  trangThaiThanhToan: string;
  phuongThucThanhToan: string;
  chiTiet: ChiTietVe[];
  tongTien: number;
}
interface ChiTietVe {
  _id: string;
  maChoNgoi: string;
  trangThaiChiTiet: string;
  ngayHuy?: string | Date;
}
interface ChuyenXe {
  _id: string;
  ngayKhoiHanh: string;
  gioKhoiHanh: number;
  tuyenDuong: string | TuyenDuong;
  loaiXe: {
    tenLoaiXe: string;
  };
  xe: {
    bienSo: string;
  } | null;
}
interface TuyenDuong {
  _id: string;
  tenTuyen: string;
  diemDon: Diem;
  diemTra: Diem;
  thoiGianDenDuKien: number;
}
interface Diem {
  tenDiem: string;
  diaChi: string;
}

// 4. Các hàm helper
const formatMinutesToHHMM = (totalMinutes: number): string => {
  if (isNaN(totalMinutes)) return "N/A";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const formatDateString = (dateStr: string | Date): string => {
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "N/A";
  }
};

// 5. Hàm helper mới
const getDayOfWeek = (dateStr: string | Date): string => {
  try {
    const date = new Date(dateStr);
    const dayIndex = date.getDay();
    if (dayIndex === 0) return "CN";
    return `T${dayIndex + 1}`;
  } catch (error) {
    return "";
  }
};

const mapApiPaymentMethodToText = (apiMethod: string): string => {
  if (apiMethod === "KHI_LEN_XE") return "Khi lên xe";
  if (apiMethod === "VNPAY") return "VNPAY";
  if (apiMethod === "MOMO") return "Momo";
  return apiMethod;
};

const mapApiPaymentStatus = (apiStatus: string) => {
  if (apiStatus === "CHUA_THANH_TOAN") {
    return { text: "Chưa thanh toán", color: "#E74C3C" };
  }
  if (apiStatus === "DA_THANH_TOAN") {
    return { text: "Đã thanh toán", color: "#27AE60" };
  }
  return { text: apiStatus, color: "#333" };
};

// ===========================================
// 6. COMPONENT CHÍNH
// ===========================================
const TicketDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { veXeId, chuyenXeId } = route.params;

  const [loading, setLoading] = useState(true);
  const [veXe, setVeXe] = useState<VeXe | null>(null);
  const [chuyenXe, setChuyenXe] = useState<ChuyenXe | null>(null);
  const [tuyenDuong, setTuyenDuong] = useState<TuyenDuong | null>(null);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

  // 7. Logic tải dữ liệu
  const fetchDetails = useCallback(async () => {
    if (!veXeId || !chuyenXeId) {
      Alert.alert("Lỗi", "Không tìm thấy mã vé hoặc mã chuyến.");
      navigation.goBack();
      return;
    }

    setLoading(true);
    try {
      console.log(
        `[TicketDetail] Đang tải veXeId: ${veXeId}, chuyenXeId: ${chuyenXeId}`
      );

      const [veXeResponse, chuyenXeResponse] = await Promise.all([
        api_booking_service.getVeXeById(veXeId),
        api_trip_schedule_service.getChuyenXeByObjId(chuyenXeId),
      ]);

      if (!veXeResponse.success || !veXeResponse.data) {
        throw new Error("Không tải được chi tiết vé.");
      }
      if (!chuyenXeResponse.success || !chuyenXeResponse.data) {
        throw new Error("Không tải được chi tiết chuyến xe.");
      }

      const veXeData: VeXe = veXeResponse.data;
      const chuyenXeData: ChuyenXe = chuyenXeResponse.data;

      const tuyenDuongResponse =
        await api_trip_schedule_service.getTuyenDuongData(
          chuyenXeData.tuyenDuong
        );
      if (!tuyenDuongResponse.success || !tuyenDuongResponse.data) {
        throw new Error("Không tải được chi tiết tuyến đường.");
      }

      setVeXe(veXeData);
      setChuyenXe(chuyenXeData);
      setTuyenDuong(tuyenDuongResponse.data);

      navigation.setOptions({ title: "Chi tiết giao dịch" });
    } catch (error: any) {
      console.error("[TicketDetail] Lỗi tải dữ liệu:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải chi tiết vé.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [veXeId, chuyenXeId, navigation]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleCopyMaVe = () => {
    if (veXe?.maVe) {
      Clipboard.setString(veXe.maVe);
      Alert.alert("Đã sao chép", `Đã sao chép mã vé ${veXe.maVe} vào bộ nhớ.`);
    }
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:01234567890");
  };

  const handleCancelOrder = () => {
    if (!veXe) return;
    navigation.navigate("CancelFlowScreen", {
      veXeId: veXe._id,
    });
  };

  const handleRePayment = async () => {
    setLoading(true);
    try {
      const chiTietIds = veXe.chiTiet.map((ct) => ct._id);
      const currentFormattedDate = formatDateString(chuyenXe.ngayKhoiHanh);
      const response = await api_booking_service.createVnpayPayment({
        maVe: veXe.maVe,
        chiTietVeIds: chiTietIds,
        amount: veXe.tongTien,
      });

      if (response.paymentUrl) {
        navigation.navigate("RePaymentQRCodeScreen", {
          paymentUrl: response.paymentUrl,
          maHoaDon: response.maHoaDon,
          finalPrice: veXe.tongTien,

          ticketInfo: veXe,
          trip: chuyenXe,
          departureLocation: tuyenDuong.diemDon,
          destination: tuyenDuong.diemTra,
          departureDate: currentFormattedDate,
        });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // 9. RENDER CÁC THÀNH PHẦN
  // ===========================================

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!veXe || !chuyenXe || !tuyenDuong) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Không thể tải dữ liệu.</Text>
        <TouchableOpacity onPress={fetchDetails}>
          <Text style={{ color: "#007AFF", marginTop: 10 }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // (Dữ liệu đã sẵn sàng -> Render)

  // Tính toán các giá trị
  const tripDateStr = chuyenXe.ngayKhoiHanh;
  const tripTimeStr = formatMinutesToHHMM(chuyenXe.gioKhoiHanh);
  const formattedDate = formatDateString(tripDateStr);
  const dayOfWeek = getDayOfWeek(tripDateStr);
  const arrivalTimeStr = formatMinutesToHHMM(tuyenDuong.thoiGianDenDuKien);
  const seatList = veXe.chiTiet.map((c) => c.maChoNgoi).join(", ");
  const paymentStatus = mapApiPaymentStatus(veXe.trangThaiThanhToan);
  const paymentMethod = mapApiPaymentMethodToText(veXe.phuongThucThanhToan);

  const activeChiTiet = veXe.chiTiet.filter(
    (ct) =>
      ct.trangThaiChiTiet !== "DA_HUY" && ct.trangThaiChiTiet !== "DA_HOAN_TIEN"
  );
  const isFullyCancelled = activeChiTiet.length === 0;

  // 2. Tạo nội dung cho banner (nếu cần)
  let cancellationText = "";
  if (isFullyCancelled) {
    const firstCancelledTicket = veXe.chiTiet.find(
      (ct) => ct.trangThaiChiTiet === "DA_HUY" && ct.ngayHuy
    );

    const cancelledDate =
      firstCancelledTicket && firstCancelledTicket.ngayHuy
        ? new Date(firstCancelledTicket.ngayHuy)
        : new Date();

    const cancelledTimeStr = `${String(cancelledDate.getHours()).padStart(
      2,
      "0"
    )}:${String(cancelledDate.getMinutes()).padStart(2, "0")}`;

    const cancelledDateStr = formatDateString(cancelledDate);

    cancellationText = `Vé đã bị hủy vào lúc ${cancelledTimeStr} • ${cancelledDateStr}`;
  }

  // ⚠️ Dữ liệu bị thiếu từ API
  const tenNhaXe = "Không rõ nhà xe";
  const tenLoaiXe = chuyenXe.loaiXe?.tenLoaiXe || "Không rõ loại xe";
  const bienSoXe = chuyenXe.xe?.bienSo || "Không rõ biển số";

  // ✅ BẮT ĐẦU: LOGIC XỬ LÝ HỦY VÉ
  let fullDepartureDate: Date | null = null;
  if (
    chuyenXe &&
    chuyenXe.ngayKhoiHanh &&
    typeof chuyenXe.gioKhoiHanh === "number"
  ) {
    try {
      const departureDate = new Date(chuyenXe.ngayKhoiHanh);
      departureDate.setHours(0, 0, 0, 0); // Đặt về 00:00:00 giờ local
      departureDate.setMinutes(chuyenXe.gioKhoiHanh); // Thêm số phút
      fullDepartureDate = departureDate;
    } catch (e) {
      console.error("Lỗi parse ngày:", chuyenXe.ngayKhoiHanh);
    }
  }

  let isCancellable = false;

  // 1. Kiểm tra trạng thái thanh toán
  const isUnpaid = veXe.trangThaiThanhToan === "CHUA_THANH_TOAN";

  // 2. Kiểm tra thời gian (trước 24h)
  let isWithinTimeLimit = false;
  if (fullDepartureDate) {
    const now = new Date();
    // Tính thời điểm 24h trước giờ khởi hành
    const cutoffTime = new Date(fullDepartureDate.getTime());
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    if (now < cutoffTime) {
      isWithinTimeLimit = true;
    }
  }

  // 3. Quyết định cuối cùng: Phải là vé CHƯA THANH TOÁN và TRONG THỜI GIAN
  if (isUnpaid && isWithinTimeLimit) {
    isCancellable = true;
  }
  // ✅ KẾT THÚC: LOGIC XỬ LÝ HỦY VÉ

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết giao dịch</Text>
      </View>
      {/* 1. THANH BANNER */}
      {isFullyCancelled ? (
        <View style={styles.grayBanner}>
          <Text style={styles.grayBannerText}>{cancellationText}</Text>
        </View>
      ) : (
        <View style={styles.redBanner}>
          <Text style={styles.redBannerText}>
            Chuyến đi sẽ bắt đầu lúc {tripTimeStr} • {formattedDate}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 2. CARD THÔNG TIN CHUYẾN ĐI */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin chuyến đi</Text>

          <View style={styles.tripCard}>
            <View style={styles.tripCardHeader}>
              <Text style={styles.tripCardDate}>
                {dayOfWeek}, {formattedDate}
              </Text>
            </View>

            <View style={styles.providerInfo}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#27AE60"
                    style={{ marginLeft: 4 }}
                  />
                  <Text style={styles.providerStatus}>Đã xác nhận vé</Text>
                </View>
                <Text style={styles.providerBusType}>{tenLoaiXe}</Text>
              </View>
            </View>

            <View style={styles.passengerInfo}>
              <Feather name="user" size={16} color="#666" />
              <Text style={styles.passengerText}>
                {veXe.chiTiet.length} hành khách
              </Text>
              <MaterialCommunityIcons
                name="seat"
                size={16}
                color="#666"
                style={{ marginLeft: 16 }}
              />

              <Text
                style={[styles.passengerText, { flex: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Ghế: {seatList}
              </Text>
            </View>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
              {/* Điểm đi */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineMarker}>
                  <View style={styles.timelineDotStart} />
                  <View style={styles.timelineConnector} />
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTime}>{tripTimeStr}</Text>
                  </View>
                  <Text style={styles.timelineLocation}>
                    {tuyenDuong.diemDon.tenDiem}
                  </Text>
                  <Text style={styles.timelineAddress}>
                    {tuyenDuong.diemDon.diaChi}
                  </Text>
                </View>
              </View>
              {/* Điểm đến */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineMarker}>
                  <View style={styles.timelineDotEnd} />
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTime}>{arrivalTimeStr}</Text>
                  </View>
                  <Text style={styles.timelineLocation}>
                    {tuyenDuong.diemTra.tenDiem}
                  </Text>
                  <Text style={styles.timelineAddress}>
                    {tuyenDuong.diemTra.diaChi}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mã vé & Biển số */}
            <View style={styles.tripFooterInfo}>
              <Text style={styles.footerLabel}>Mã vé</Text>
              <TouchableOpacity style={styles.copyRow} onPress={handleCopyMaVe}>
                <Text style={styles.footerValue}>{veXe.maVe}</Text>
                <Feather
                  name="copy"
                  size={16}
                  color="#007AFF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.tripFooterInfo}>
              <Text style={styles.footerLabel}>Biển số xe</Text>
              <Text style={styles.footerValue}>
                {chuyenXe.xe?.bienSo || "Đang cập nhật"}
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.tripButtons}>
              <TouchableOpacity
                style={styles.qrButton}
                onPress={() => setIsQrModalVisible(true)}
              >
                <MaterialCommunityIcons name="qrcode" size={20} color="#333" />
                <Text style={styles.qrButtonText}>Xem QR vé</Text>
              </TouchableOpacity>
              {veXe.trangThaiThanhToan === "CHUA_THANH_TOAN" ? (
                <TouchableOpacity
                  style={[styles.qrButton, { backgroundColor: "#27ae60" }]}
                  onPress={handleRePayment}
                >
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={[styles.qrButtonText, { color: "#fff" }]}>
                    Thanh toán VNPay
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.locationButtonDisabled}
                  disabled
                >
                  <MaterialCommunityIcons
                    name="bus-marker"
                    size={20}
                    color="#AAA"
                  />
                  <Text style={styles.locationButtonText}>Xem vị trí xe</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 3. CARD THÔNG TIN THANH TOÁN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <Text
              style={[
                styles.infoValue,
                { color: paymentStatus.color, fontWeight: "bold" },
              ]}
            >
              {paymentStatus.text}
            </Text>
          </View>
          <View style={styles.infoRow}>
            {/* <Text style={styles.infoLabel}>Phương thức thanh toán</Text>
            <Text style={styles.infoValue}>{paymentMethod}</Text> */}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng tiền</Text>
            <Text
              style={[styles.infoValue, { color: "#333", fontWeight: "bold" }]}
            >
              {veXe.tongTien.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>

        {/* 4. CARD HƯỚNG DẪN THANH TOÁN */}
        {veXe.trangThaiThanhToan === "CHUA_THANH_TOAN" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hướng dẫn thanh toán</Text>
            <Text style={styles.subTitle}>{paymentMethod}</Text>
            <Text style={styles.regularText}>
              Bạn hãy thanh toán {veXe.tongTien.toLocaleString("vi-VN")}đ tại
              điểm đón theo hướng dẫn của nhà xe. Nếu cần được hỗ trợ, hãy gọi
              số
              <Text style={styles.linkTextBold} onPress={handleCallSupport}>
                {" "}
                01234567890
              </Text>
              .
            </Text>
          </View>
        )}

        {/* 5. CARD QUẢN LÝ ĐƠN HÀNG */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quản lý đơn hàng</Text>
          <TouchableOpacity style={styles.managementRow}>
            <Feather name="share" size={22} color="#007AFF" />
            <Text style={styles.managementText}>Chia sẻ thông tin vé</Text>
            <Feather name="chevron-right" size={20} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.managementRow}>
            <Feather name="help-circle" size={22} color="#007AFF" />
            <Text style={styles.managementText}>Trung tâm Hỗ trợ</Text>
            <Feather name="chevron-right" size={20} color="#AAA" />
          </TouchableOpacity>

          {/* ✅ CẬP NHẬT NÚT HỦY ĐƠN HÀNG */}
          <TouchableOpacity
            style={styles.managementRow}
            onPress={handleCancelOrder}
            disabled={!isCancellable} // Vô hiệu hóa nếu không được phép
          >
            <Feather
              name="x-circle"
              size={22}
              // Đổi màu icon nếu bị vô hiệu hóa
              color={!isCancellable ? "#BDBDBD" : "#E74C3C"}
            />
            <Text
              style={[
                styles.managementText,
                // Đổi màu text nếu bị vô hiệu hóa
                { color: !isCancellable ? "#BDBDBD" : "#E74C3C" },
              ]}
            >
              Hủy đơn hàng
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              // Đổi màu icon nếu bị vô hiệu hóa
              color={!isCancellable ? "#BDBDBD" : "#AAA"}
            />
          </TouchableOpacity>
          {/* ✅ KẾT THÚC CẬP NHẬT */}
        </View>
      </ScrollView>

      {/* 8. THANH BUTTONS DƯỚI CÙNG */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButtonSecondary}>
          <Text style={styles.footerButtonSecondaryText}>Đặt lại</Text>
        </TouchableOpacity>
      </View> */}

      {/* MODAL QR CODE */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isQrModalVisible}
        onRequestClose={() => setIsQrModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsQrModalVisible(false)}
        >
          <View
            style={styles.modalContainer}
            onStartShouldSetResponder={() => true}
          >
            <QRCode
              value={veXe?.maVe || "NO_TICKET_ID"}
              size={220}
              logo={require("../../../assets/images/icon.png")}
              logoSize={40}
              logoBackgroundColor="#FFFFFF"
            />
            <Text style={styles.modalQrText}>Mã vé: {veXe?.maVe}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsQrModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ===========================================
// 10. STYLESHEET
// ===========================================
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  refreshText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  backButton: {
    paddingRight: 8,
  },
  redBanner: {
    backgroundColor: "#D9534F",
    padding: 12,
    alignItems: "center",
  },
  redBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  grayBanner: {
    backgroundColor: "#8E8E93",
    padding: 12,
    alignItems: "center",
  },
  grayBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  regularText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  linkTextBold: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EBF5FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoBoxText: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
    fontSize: 13,
    lineHeight: 18,
  },
  tripCard: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
  },
  tripCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tripCardDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  providerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  providerStatus: {
    fontSize: 12,
    color: "#27AE60",
    marginLeft: 4,
  },
  providerBusType: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  passengerText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "600",
  },
  timelineContainer: {
    padding: 12,
    paddingBottom: 0,
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineMarker: {
    alignItems: "center",
    marginRight: 12,
  },
  timelineDotStart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  timelineDotEnd: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E74C3C",
  },
  timelineConnector: {
    flex: 1,
    width: 1,
    backgroundColor: "#007AFF",
    borderStyle: "dashed",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timelineLocation: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  timelineAddress: {
    fontSize: 13,
    color: "#666",
  },
  tripFooterInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  footerLabel: {
    fontSize: 14,
    color: "#666",
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripButtons: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 16,
  },
  qrButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  qrButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  locationButtonDisabled: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderColor: "#FFECB3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningBoxText: {
    flex: 1,
    marginLeft: 8,
    color: "#664D03",
    fontSize: 13,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFECB3",
    borderWidth: 1,
  },
  managementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  managementText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  otherServicesSection: {
    padding: 16,
  },
  bannerAd: {
    height: 100,
    marginBottom: 16,
  },
  serviceBanner: {
    height: 120,
    justifyContent: "flex-end",
    padding: 16,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerButtonSecondary: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
  },
  footerButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  footerButtonPrimary: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  footerButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalQrText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 24,
  },
  modalCloseButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TicketDetailScreen;
