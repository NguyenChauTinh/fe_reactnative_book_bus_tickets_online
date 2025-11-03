// PaymentScreen.tsx
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { api_promotion_service } from "../../../apis/api_promotion_service";
import PaymentCountdown from "./PaymentCountdown";

// --- ICONS (Không thay đổi) ---
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
const QRIcon = ({ size = 30, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h6v6H4V4Zm10 0h6v6h-6V4Zm0 10h6v6h-6v-6ZM4 14h6v6H4v-6Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const PaymentScreen = ({ navigation, route }) => {
  const {
    trip,
    selectedSeats,
    selectedPickup,
    selectedDropoff,
    customerInfo,
    insuranceSelected,
    finalPrice: priceBeforeDiscount,
    departureLocation,
    destination,
    departureDate,
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromoLine, setSelectedPromoLine] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // State quản lý text trong ô input
  const [promoInputValue, setPromoInputValue] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const response = await api_promotion_service.timKhuyenMaiApDung(
          trip.ngayKhoiHanh,
          trip.gioKhoiHanh
        );
        if (response.success) setPromotions(response.data || []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (trip.ngayKhoiHanh && trip.gioKhoiHanh) fetchPromotions();
    else setLoading(false);
  }, [trip]);

  const applicablePromos = useMemo(() => {
    const applicable = [];
    promotions.forEach((campaign) => {
      campaign.lines.forEach((line) => {
        const isApplicable = line.dieuKienApDung.every((condition) => {
          if (condition.loaiDieuKien === "SO_LUONG_VE")
            return selectedSeats.length >= condition.soLuongToiThieu;
          return true;
        });
        if (isApplicable)
          applicable.push({
            ...line,
            campaignId: campaign._id,
            campaignName: campaign.tenKhuyenMai,
          });
      });
    });
    return applicable;
  }, [promotions, selectedSeats.length]);

  const filteredPromos = useMemo(() => {
    // Nếu có khuyến mãi đã được chọn, và người dùng chưa gõ gì khác, thì không cần lọc
    if (
      selectedPromoLine &&
      promoInputValue ===
        (selectedPromoLine.ghiChu || selectedPromoLine.campaignName)
    ) {
      return applicablePromos;
    }
    // Lọc dựa trên nội dung người dùng đang gõ
    if (!promoInputValue) return applicablePromos;
    return applicablePromos.filter(
      (promo) =>
        promo.maLine?.toLowerCase().includes(promoInputValue.toLowerCase()) ||
        (promo.ghiChu || promo.campaignName)
          ?.toLowerCase()
          .includes(promoInputValue.toLowerCase())
    );
  }, [applicablePromos, promoInputValue, selectedPromoLine]);

  const { discountAmount, finalPrice } = useMemo(() => {
    let discount = 0;
    if (selectedPromoLine) {
      const { loaiKhuyenMai, chiTiet } = selectedPromoLine;
      if (loaiKhuyenMai === "GIAM_PHAN_TRAM") {
        discount = priceBeforeDiscount * (chiTiet.phanTramGiam / 100);
        if (chiTiet.soTienGiamToiDa && discount > chiTiet.soTienGiamToiDa)
          discount = chiTiet.soTienGiamToiDa;
      } else if (loaiKhuyenMai === "GIAM_TIEN") {
        discount = chiTiet.soTienGiam;
      } else if (loaiKhuyenMai === "TANG_VE" && selectedSeats.length > 0) {
        const ticketPrice = selectedSeats[0].price || 0;
        discount = ticketPrice * (chiTiet.soLuongVeTang || 1);
      }
    }
    const calculatedFinalPrice = priceBeforeDiscount - discount;
    return {
      discountAmount: discount,
      finalPrice: calculatedFinalPrice > 0 ? calculatedFinalPrice : 0,
    };
  }, [priceBeforeDiscount, selectedPromoLine, selectedSeats]);

  const handleSelectPromotion = (line) => {
    setSelectedPromoLine(line);
    setPromoInputValue(line ? line.ghiChu || line.campaignName : "");
    setIsDropdownOpen(false);
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) return;
    setLoading(true);
    const chiTietVe = selectedSeats.map((seat) => ({
      chuyenXe: trip._id,
      tenKhachHang: customerInfo.name,
      soDienThoai: customerInfo.phone,
      email: customerInfo.email,
      maChoNgoi: seat.number,
      diemDon: selectedPickup.name,
      diemTra: selectedDropoff.name,
      giaVeCoBan: seat.price,
      phuThu: 0,
      giamGia: 0,
      hinhThucThanhToan: selectedPaymentMethod,
      trangThaiChiTiet:
        selectedPaymentMethod === "TAI_XE" ? "DAT_CHO" : "DA_THANH_TOAN",
    }));
    const ticketPayload = {
      chiTiet: chiTietVe,
      maGiamGia: selectedPromoLine ? selectedPromoLine.campaignId : null,
    };
    try {
      const response = await axios.post(
        "http://localhost:3005/api/v1/ve-xe",
        ticketPayload
      );
      if (response.data.success) {
        Alert.alert("Thành công", "Đặt vé thành công!");
        navigation.navigate("BookingSuccessScreen", {
          ticketInfo: response.data.data,
        });
      } else {
        Alert.alert(
          "Lỗi",
          response.data.message || "Có lỗi xảy ra khi đặt vé."
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi hệ thống",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />
      ) : (
        <>
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
          <View style={styles.warningBox}>
            <PaymentCountdown />
          </View>
          {!insuranceSelected && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>Chuyến đi chưa được bảo vệ</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Thêm bảo hiểm</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.promotionSection}>
              <Text style={styles.sectionTitle}>Khuyến mãi</Text>

              <View style={styles.dropdownContainer}>
                <TextInput
                  style={styles.dropdownInput}
                  placeholder="Chọn hoặc tìm mã khuyến mãi"
                  placeholderTextColor="#aaa"
                  value={promoInputValue}
                  onChangeText={(text) => {
                    setPromoInputValue(text);
                    if (selectedPromoLine) setSelectedPromoLine(null);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => {
                    // Dùng timeout để cho phép sự kiện onPress của item trong list chạy trước
                    setTimeout(() => {
                      setIsDropdownOpen(false);
                      // Nếu không có khuyến mãi nào được chọn, xóa text để placeholder hiện ra
                      if (!selectedPromoLine) {
                        setPromoInputValue("");
                      }
                    }, 150);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Text style={styles.dropdownIcon}>
                    {isDropdownOpen ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isDropdownOpen && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView nestedScrollEnabled={true}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelectPromotion(null)}
                    >
                      <Text>Không dùng</Text>
                    </TouchableOpacity>
                    {filteredPromos.length > 0 ? (
                      filteredPromos.map((line) => (
                        <TouchableOpacity
                          key={line._id}
                          style={styles.dropdownItem}
                          onPress={() => handleSelectPromotion(line)}
                        >
                          <Text style={styles.promoCode}>{line.maLine}</Text>
                          <Text style={styles.promoDesc}>
                            {line.ghiChu || line.campaignName}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noPromoText}>
                        Không có khuyến mãi phù hợp
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
            <Text style={[styles.sectionTitle, { marginHorizontal: 16 }]}>
              Phương thức thanh toán
            </Text>
            <TouchableOpacity
              style={[
                styles.option,
                selectedPaymentMethod === "TAI_XE" && styles.selectedOption,
              ]}
              onPress={() => setSelectedPaymentMethod("TAI_XE")}
            >
              <BusIcon />
              <View>
                <Text style={styles.optionText}>Thanh toán khi lên xe</Text>
                <Text style={styles.optionTextSub}>
                  Bạn có thể thanh toán cho tài xế khi lên xe.
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                selectedPaymentMethod === "VNPAY" && styles.selectedOption,
              ]}
              onPress={() => setSelectedPaymentMethod("VNPAY")}
            >
              <QRIcon />
              <View>
                <Text style={styles.optionText}>Thanh toán VNPAY - QR</Text>
                <Text style={styles.optionTextSub}>
                  Thanh toán qua QR code của VNPAY.
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.bottomBar}>
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tạm tính:</Text>
                <Text style={styles.priceValue}>
                  {priceBeforeDiscount.toLocaleString()}đ
                </Text>
              </View>
              {discountAmount > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Giảm giá:</Text>
                  <Text style={[styles.priceValue, styles.discountValue]}>
                    - {discountAmount.toLocaleString()}đ
                  </Text>
                </View>
              )}
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalPrice}>
                  {finalPrice.toLocaleString()}đ
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedPaymentMethod && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!selectedPaymentMethod}
            >
              <Text style={styles.continueButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  headerContent: { flex: 1, marginLeft: 16 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { color: "white", fontSize: 14, opacity: 0.9 },
  warningBox: { backgroundColor: "#FFCC80", padding: 10 },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF3CD",
  },
  alertText: { color: "#856404", flex: 1 },
  link: { color: "#1976D2", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: { borderColor: "#4A90E2", backgroundColor: "#e3f2fd" },
  optionText: { marginLeft: 16, fontSize: 16, fontWeight: "600" },
  optionTextSub: { marginLeft: 16, fontSize: 14, color: "#666", marginTop: 4 },
  promotionSection: { marginHorizontal: 16, marginBottom: 16, zIndex: 1 },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dropdownInput: { flex: 1, height: 50, fontSize: 16, paddingHorizontal: 16 },
  dropdownIcon: { fontSize: 16, color: "#666", paddingHorizontal: 16 },
  dropdownListContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
    position: "absolute",
    top: "100%",
    width: "100%",
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  promoCode: { fontWeight: "bold" },
  promoDesc: { color: "#666", fontSize: 12 },
  noPromoText: { padding: 16, color: "#999", fontStyle: "italic" },
  bottomBar: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  priceContainer: { flex: 1 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  priceLabel: { fontSize: 14, color: "#666" },
  priceValue: { fontSize: 14, color: "#333" },
  discountValue: { color: "green" },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#E74C3C" },
  continueButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
  },
  disabledButton: { backgroundColor: "#ccc" },
  continueButtonText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});
