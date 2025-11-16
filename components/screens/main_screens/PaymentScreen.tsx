import axios from "axios";
import React, {
  forwardRef, // 👈 THÊM
  useEffect,
  useImperativeHandle, // 👈 THÊM
  useMemo,
  useRef, // 👈 THÊM
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  NativeSyntheticEvent, // 👈 THÊM
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData, // 👈 THÊM
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { WebView } from "react-native-webview";
import { Api_Auth_Customer } from "../../../apis/api_auth";
import { api_booking_service } from "../../../apis/api_booking_service";
import { api_promotion_service } from "../../../apis/api_promotion_service";
import PaymentCountdown from "./PaymentCountdown";

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

const MoMoIcon = ({ size = 30, color = "#A60067" }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <Path
      d="M368.1 133.3H143.9c-29.2 0-52.9 23.7-52.9 52.9v139.7c0 29.2 23.7 52.9 52.9 52.9H368c29.2 0 52.9-23.7 52.9-52.9V186.2c.1-29.2-23.6-52.9-52.8-52.9zM196 303.8c-12.8 0-23.2-10.4-23.2-23.2s10.4-23.2 23.2-23.2 23.2 10.4 23.2 23.2-10.4 23.2-23.2 23.2zm60-23.2c0-12.8 10.4-23.2 23.2-23.2s23.2 10.4 23.2 23.2-10.4 23.2-23.2 23.2-23.2-10.4-23.2-23.2zm60 0c0-12.8 10.4-23.2 23.2-23.2 23.2 0 42.1 18.9 42.1 42.1s-18.9 42.1-42.1 42.1-23.2-10.4-23.2-23.2c0-7.3 3.4-13.8 8.8-18.1-5.4-4.2-8.8-10.7-8.8-17.6zM151.8 214.3c-12.8 0-23.2 10.4-23.2 23.2s10.4 23.2 23.2 23.2 23.2-10.4 23.2-23.2-10.4-23.2-23.2-23.2z"
      fill={color}
    />
  </Svg>
);

const OTP_LENGTH = 6;

interface OtpInputProps {
  onCodeFilled: (code: string) => void;
}

export interface OtpInputHandle {
  clear: () => void;
}

// Định nghĩa component OtpInput ngay trong file này
const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  ({ onCodeFilled }, ref) => {
    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
    const inputs = useRef<TextInput[]>([]);

    useImperativeHandle(ref, () => ({
      clear() {
        setOtp(new Array(OTP_LENGTH).fill(""));
        inputs.current[0]?.focus();
      },
    }));

    const handleChange = (text: string, index: number) => {
      const newDigit = text.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = newDigit;
      setOtp(newOtp);

      if (newDigit && index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        const finalCode = newOtp.join("");
        onCodeFilled(finalCode);
        inputs.current[OTP_LENGTH - 1]?.blur();
      }
    };

    const handleBackspace = (
      event: NativeSyntheticEvent<TextInputKeyPressEventData>,
      index: number
    ) => {
      if (event.nativeEvent.key === "Backspace") {
        if (otp[index] === "") {
          if (index > 0) {
            inputs.current[index - 1]?.focus();
          }
        }
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    };

    return (
      <View style={styles.otpContainerInternal}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el as TextInput)}
            style={[
              styles.otpInputBox,
              otp[index] ? styles.otpInputBoxFilled : null,
            ]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleBackspace(e, index)}
            value={otp[index]}
            maxLength={1}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            textAlign="center"
          />
        ))}
      </View>
    );
  }
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
  const [promoInputValue, setPromoInputValue] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showGateway, setShowGateway] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const otpInputRef = useRef<OtpInputHandle>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const response = await api_promotion_service.timKhuyenMaiApDung(
          trip.ngayKhoiHanh,
          trip.gioKhoiHanh,
          selectedSeats.length
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
    // ... (Giữ nguyên logic)
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
    // ... (Giữ nguyên logic)
    if (
      selectedPromoLine &&
      promoInputValue ===
        (selectedPromoLine.ghiChu || selectedPromoLine.campaignName)
    ) {
      return applicablePromos;
    }
    if (!promoInputValue) return applicablePromos;
    return applicablePromos.filter(
      (promo) =>
        promo.maLine?.toLowerCase().includes(promoInputValue.toLowerCase()) ||
        (promo.ghiChu || promo.campaignName)
          ?.toLowerCase()
          .includes(promoInputValue.toLowerCase())
    );
  }, [applicablePromos, promoInputValue, selectedPromoLine]);

  // ✅ SỬA 2: Lấy 'discountAmount' từ useMemo để dùng bên dưới
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

  const createTicketInDatabase = async (
    paymentMethod,
    transactionId = null
  ) => {
    // --- BẮT ĐẦU LOGIC CHIA GIẢM GIÁ (LÀM TRÒN 3 SỐ) ---
    const numTickets = selectedSeats.length;
    let discountDistributed = 0; // Số tiền đã chia

    // Tính số tiền giảm giá cho 1 vé (làm tròn 3 chữ số)
    // Ví dụ: 10000 / 3 = 3333.3333... -> 3333.333
    const discountPerTicket =
      Math.round((discountAmount / numTickets) * 1000) / 1000;
    // --- KẾT THÚC LOGIC CHIA GIẢM GIÁ ---

    const chiTietVe = selectedSeats.map((seat, index) => {
      let ticketDiscount = 0;

      // Nếu không phải vé cuối cùng
      if (index < numTickets - 1) {
        ticketDiscount = discountPerTicket; // 3333.333
        discountDistributed += ticketDiscount; // Cộng dồn
      } else {
        // Vé cuối cùng sẽ nhận phần còn lại để đảm bảo tổng chính xác
        // Ví dụ: 10000 - (3333.333 * 2) = 10000 - 6666.666 = 3333.334
        ticketDiscount = discountAmount - discountDistributed;

        // Làm tròn vé cuối cùng này lại 3 chữ số (nếu cần)
        ticketDiscount = Math.round(ticketDiscount * 1000) / 1000;
      }

      return {
        chuyenXe: trip._id,
        tenKhachHang: customerInfo.name,
        soDienThoai: customerInfo.phone,
        email: customerInfo.email,
        maChoNgoi: seat.number,
        diemDon: selectedPickup.name,
        diemTra: selectedDropoff.name,
        giaVeCoBan: seat.price,
        phuThu: 0,
        giamGia: ticketDiscount, // Gán tiền giảm giá đã chia
        hinhThucThanhToan: null,
        trangThaiChiTiet:
          paymentMethod === "TAI_XE" ? "DAT_CHO" : "DA_THANH_TOAN",
        vnpTransactionNo: transactionId,
      };
    });

    const ticketPayload = {
      chiTiet: chiTietVe,
      maGiamGia: selectedPromoLine ? selectedPromoLine.campaignId : null,
      hinhThucThanhToan: null,
      nhanVienTao: "690471e2292bcd0f56f104e8",
      userId: "60c72b2f5f1b2c001f6e8d9e",
    };

    try {
      setLoading(true);

      const response = await api_booking_service.createTicket(ticketPayload);
      console.log("response = ", response);
      if (response.success) {
        navigation.navigate("BookingSuccessScreen", {
          ticketInfo: response.data,
          trip,
          departureLocation,
          destination,
          departureDate,
          finalPrice,
          discountAmount,
        });
      } else {
        Alert.alert("Lỗi", response.message || "Có lỗi xảy ra khi đặt vé.");
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

  const proceedToBooking = async () => {
    if (!selectedPaymentMethod) return;

    if (selectedPaymentMethod === "TAI_XE") {
      setLoading(true);
      await createTicketInDatabase("TAI_XE");
      setLoading(false);
    }

    if (selectedPaymentMethod === "VNPAY") {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://192.168.1.22:3005/api/v1/payment/create-vnpay-url",
          {
            amount: finalPrice,
            orderInfo: `Thanh toan ve xe ${trip.maChuyenXe}`,
          }
        );

        if (response.data && response.data.paymentUrl) {
          setPaymentUrl(response.data.paymentUrl);
          setShowGateway(true);
        } else {
          Alert.alert("Lỗi", "Không thể tạo yêu cầu thanh toán VNPAY.");
        }
      } catch (error) {
        Alert.alert(
          "Lỗi hệ thống",
          "Không thể kết nối đến máy chủ thanh toán."
        );
      } finally {
        setLoading(false);
      }
    }

    if (selectedPaymentMethod === "MOMO") {
      setLoading(true);
      try {
        const response = await axios.post(
          // Đây là URL backend mới bạn cần tạo (ví dụ)
          "http://192.168.1.22:3005/api/v1/payment/create-momo-url",
          {
            amount: finalPrice,
            orderInfo: `Thanh toan ve xe ${trip.maChuyenXe}`,
          }
        );

        // Logic hiển thị WebView y hệt VNPAY
        if (response.data && response.data.paymentUrl) {
          setPaymentUrl(response.data.paymentUrl);
          setShowGateway(true);
        } else {
          Alert.alert("Lỗi", "Không thể tạo yêu cầu thanh toán MoMo.");
        }
      } catch (error) {
        Alert.alert(
          "Lỗi hệ thống",
          "Không thể kết nối đến máy chủ thanh toán MoMo."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    await proceedToBooking();

    // setVerificationLoading(true); // Hiển thị loading (tạm thời)

    // try {
    //   const response = await Api_Auth_Customer.requestOtp({
    //     soDienThoai: customerInfo.phone,
    //   });

    //   if (response.success) {
    //     // Xóa mã cũ (nếu có) trước khi mở
    //     setOtpCode("");
    //     otpInputRef.current?.clear();
    //     // Mở modal
    //     setIsVerificationModalVisible(true);
    //     setCountdown(59);
    //   } else {
    //     Alert.alert(
    //       "Lỗi",
    //       response.message || "Không thể gửi mã OTP. Vui lòng thử lại."
    //     );
    //   }
    // } catch (error) {
    //   console.error("Lỗi gửi OTP:", error);
    //   Alert.alert("Lỗi hệ thống", "Không thể gửi mã OTP. Vui lòng thử lại.");
    // } finally {
    //   setVerificationLoading(false);
    // }
  };

  const handleVerify = async (codeToVerify: string) => {
    setVerificationLoading(true);

    try {
      const response = await Api_Auth_Customer.verifyOtp({
        soDienThoai: customerInfo.phone,
        otp: codeToVerify,
      });

      if (response.success) {
        setIsVerificationModalVisible(false);
        setOtpCode("");

        await proceedToBooking();
      } else {
        Alert.alert(
          "Mã OTP không đúng",
          response.message || "Vui lòng kiểm tra và thử lại."
        );
        otpInputRef.current?.clear();
        setOtpCode("");
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      Alert.alert(
        "Lỗi hệ thống",
        "Mã OTP không đúng. Vui lòng kiểm tra và thử lại."
      );
      otpInputRef.current?.clear();
      setOtpCode("");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) return;
    handleVerify(otpCode);
  };

  const handleOtpFilled = (code: string) => {
    setOtpCode(code);
    handleVerify(code);
  };

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;

    // 1. XỬ LÝ URL TRẢ VỀ CỦA VNPAY (Giữ nguyên)
    if (url.includes("http://192.168.1.22:3005/payment-return")) {
      setShowGateway(false);
      setPaymentUrl(null);

      const params = new URLSearchParams(url.split("?")[1]);
      const responseCode = params.get("vnp_ResponseCode");
      const transactionNo = params.get("vnp_TransactionNo");

      if (responseCode === "00") {
        Alert.alert("Thành công", "Thanh toán VNPAY thành công!");
        createTicketInDatabase("VNPAY", transactionNo);
      } else {
        Alert.alert(
          "Thất bại",
          "Thanh toán VNPAY không thành công hoặc đã bị hủy."
        );
      }
    }

    // ===================================
    // 2. THÊM XỬ LÝ URL TRẢ VỀ CỦA MOMO
    // ===================================
    // (Giả sử URL trả về của bạn là 'momo-return')
    if (url.includes("http://192.168.1.22:3005/momo-return")) {
      setShowGateway(false);
      setPaymentUrl(null);

      const params = new URLSearchParams(url.split("?")[1]);
      // MoMo dùng 'resultCode' (thay vì 'vnp_ResponseCode')
      const resultCode = params.get("resultCode");
      // MoMo dùng 'transId' (thay vì 'vnp_TransactionNo')
      const transId = params.get("transId");

      // MoMo trả về "0" là thành công
      if (resultCode === "0") {
        Alert.alert("Thành công", "Thanh toán MoMo thành công!");
        // Gọi hàm tạo vé, truyền "MOMO" và Mã giao dịch của MoMo
        createTicketInDatabase("MOMO", transId);
      } else {
        Alert.alert(
          "Thất bại",
          "Thanh toán MoMo không thành công hoặc đã bị hủy."
        );
      }
    }
    // ===================================
    // KẾT THÚC XỬ LÝ MOMO
    // ===================================
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showGateway}
        onRequestClose={() => setShowGateway(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            style={{ flex: 1 }}
            cacheEnabled={false}
            incognito={true}
          />
          <TouchableOpacity
            style={styles.closeWebViewButton}
            onPress={() => setShowGateway(false)}
          >
            <Text style={styles.closeWebViewText}>Đóng</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={isVerificationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVerificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verificationModal}>
            <Text style={styles.verificationTitle}>Xác minh số điện thoại</Text>
            <Text style={styles.verificationSubtitle}>
              Mã xác thực đã được gửi đến số +{customerInfo.phone}. Vui lòng
              nhập mã để tiếp tục.
            </Text>

            <View style={styles.otpInputContainer}>
              <OtpInput
                ref={otpInputRef}
                onCodeFilled={handleOtpFilled} // 👈 5. Gán hàm auto-submit
              />
            </View>

            <TouchableOpacity
              style={[
                styles.verificationButton,
                (otpCode.length < 6 || verificationLoading) &&
                  styles.disabledButton,
              ]}
              onPress={handleVerifyOtp}
              disabled={otpCode.length < 6 || verificationLoading}
            >
              {verificationLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verificationButtonText}>Tiếp tục</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                // TODO: Gọi API gửi lại OTP ở đây
                setCountdown(59); // Reset đếm ngược
                console.log("Gửi lại OTP...");
              }}
            >
              <Text style={styles.resendButtonText}>
                Gửi lại mã {countdown > 0 ? `sau 00:${countdown}` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsVerificationModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              <Text style={styles.headerTitle} numberOfLines={1}>
                {departureLocation.tenDiaDiem} → {destination.tenDiaDiem}
              </Text>
              <Text style={styles.headerSubtitle}>{departureDate}</Text>
            </View>
          </View>
          <View style={styles.warningBox}>
            <PaymentCountdown />
          </View>
          {/* {!insuranceSelected && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>Chuyến đi chưa được bảo vệ</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Thêm bảo hiểm</Text>
              </TouchableOpacity>
            </View>
          )} */}
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
                    if (selectedPromoLine) {
                      setSelectedPromoLine(null);
                    }
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsDropdownOpen(false);

                      if (!selectedPromoLine) {
                        setPromoInputValue("");
                      }
                    }, 200);
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
                  Bạn có thể thanh toán khi lên xe.
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

            <TouchableOpacity
              style={[
                styles.option,
                selectedPaymentMethod === "MOMO" && styles.selectedOption,
              ]}
              onPress={() => setSelectedPaymentMethod("MOMO")}
            >
              <MoMoIcon />
              <View>
                <Text style={styles.optionText}>Thanh toán qua MoMo</Text>
                <Text style={styles.optionTextSub}>
                  Sử dụng ví điện tử MoMo để thanh toán.
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
    zIndex: 10,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 20,
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
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
  },
  disabledButton: { backgroundColor: "#ccc" },
  continueButtonText: { color: "#333", fontSize: 16, fontWeight: "bold" },
  closeWebViewButton: {
    backgroundColor: "#E74C3C",
    padding: 16,
    alignItems: "center",
  },
  closeWebViewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  verificationModal: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  verificationSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  otpInputContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  otpContainerInternal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInputBox: {
    width: 44,
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  otpInputBoxFilled: {
    borderColor: "#4A90E2",
    backgroundColor: "#FFFFFF",
  },
  verificationButton: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  verificationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 16,
  },
  resendButtonText: {
    color: "#4A90E2",
    fontSize: 14,
  },
  closeModalButton: {
    marginTop: 10,
  },
  closeModalText: {
    color: "#999",
    fontSize: 14,
  },
});
