"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Polygon, Rect, Svg } from "react-native-svg";
import BookingTimeline from "../main_screens/BookingTimeline";

import { Ionicons } from "@expo/vector-icons";
import { Api_Auth_Customer } from "../../../apis/api_auth";
import { useAuth } from "../../../contexts/AuthContext";
import { useAnalytics } from "../../../contexts/BookingAnalyticsContext";

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

const VietnamFlagIcon = () => (
  <Svg width="24" height="16" viewBox="0 0 24 16">
    <Rect width="24" height="16" fill="#DA020E" />
    <Polygon
      points="12,2 13.5,6.5 18,6.5 14.5,9.5 16,14 12,11 8,14 9.5,9.5 6,6.5 10.5,6.5"
      fill="#FFFF00"
    />
  </Svg>
);

export default function CustomerInfoScreen({ navigation, route }) {
  const {
    trip,
    selectedSeats,
    selectedPickup,
    selectedDropoff,
    insuranceSelected,
    accidentInsuranceSelected,
    totalPrice,
    departureLocation,
    destination,
    departureDate,
    returnDate,
  } = route.params;

  // 2. LẤY USER TỪ CONTEXT
  const { user } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    name: "", // Sửa: Bỏ dấu cách
    phone: "",
    email: "",
  });

  // 3. THÊM STATE CHO CHECKBOX
  const [isBookingForSelf, setIsBookingForSelf] = useState(false);

  // const [agreedToTerms, setAgreedToTerms] = useState(false); // Biến này chưa dùng, tạm ẩn
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const [otpCode, setOtpCode] = useState(new Array(6).fill(""));

  // [MỚI] Ref để điều khiển focus của 6 ô input
  const inputRefs = useRef([]);
  const { startTracking, logStep } = useAnalytics();

  const handleOtpChange = (text, index) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);

    // Nếu nhập xong 1 ký tự, tự động chuyển sang ô tiếp theo
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // [MỚI] Xử lý khi nhấn Backspace (xóa)
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      // Nếu ô hiện tại rỗng và không phải ô đầu tiên -> lùi về ô trước
      if (otpCode[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
        // Xóa luôn giá trị ô trước đó để trải nghiệm mượt hơn
        const newOtp = [...otpCode];
        newOtp[index - 1] = "";
        setOtpCode(newOtp);
      }
    }
  };

  // [MỚI] Tự động xác nhận khi nhập đủ 6 số
  useEffect(() => {
    const otpString = otpCode.join("");
    if (otpString.length === 6 && !verifying) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 4. Nếu người dùng tự gõ, bỏ tick checkbox
    // (Vì thông tin đang gõ có thể khác với thông tin của user)
    if (isBookingForSelf) {
      setIsBookingForSelf(false);
    }
  };

  // 5. HÀM XỬ LÝ KHI NHẤN CHECKBOX
  const handleCheckboxToggle = () => {
    const newValue = !isBookingForSelf;
    setIsBookingForSelf(newValue);

    if (newValue && user) {
      // Nếu tick vào "Đặt cho bản thân" VÀ user tồn tại
      // Tự động điền thông tin vào form
      setCustomerInfo({
        name: user.hoVaTen,
        phone: user.soDienThoai,
        email: user.email || "", // Đảm bảo email không phải undefined
      });
    } else {
      // Nếu bỏ tick, xóa thông tin form
      setCustomerInfo({
        name: "",
        phone: "",
        email: "",
      });
    }
  };

  const isValidPhoneNumber = (phone) => {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regex.test(phone);
  };

  const goToNextScreen = () => {
    logStep(); // Bước 6
    navigation.navigate("TripInfoScreen", {
      trip,
      selectedSeats,
      selectedPickup,
      selectedDropoff,
      customerInfo,
      totalPrice,
      departureLocation,
      destination,
      departureDate,
      returnDate,
    });
  };

  const handleContinue = async () => {
    // Validate dữ liệu
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ tên và email.");
      return;
    }
    if (!isValidPhoneNumber(customerInfo.phone)) {
      Alert.alert("Lỗi", "Số điện thoại không đúng định dạng Việt Nam.");
      return;
    }

    // Nếu user đang đăng nhập và số điện thoại nhập vào TRÙNG với số của user
    if (user && customerInfo.phone === user.soDienThoai) {
      goToNextScreen();
      return;
    }

    try {
      setLoading(true);
      const response = await Api_Auth_Customer.requestOtpCus({
        soDienThoai: customerInfo.phone,
      });

      console.log("Debug Response Request:", response); // In ra để kiểm tra cấu trúc

      // [FIX LỖI] Kiểm tra an toàn bằng ?.
      // Chấp nhận cả trường hợp response là Axios object hoặc data raw
      const isSuccess =
        response?.data?.success ||
        response?.success ||
        response?.status === 200;

      if (isSuccess) {
        setModalVisible(true);
      } else {
        const msg =
          response?.data?.message || response?.message || "Không thể gửi OTP.";
        Alert.alert("Lỗi", msg);
      }
    } catch (error) {
      console.log("Lỗi gửi OTP:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi kết nối máy chủ.";
      Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpCode.join(""); // [SỬA] Chuyển mảng thành chuỗi

    if (otpString.length < 6) {
      // Không cần alert ở đây nữa vì UI đã chặn nhập thiếu rồi,
      // nhưng giữ lại để clear logic
      return;
    }

    try {
      setVerifying(true);
      const response = await Api_Auth_Customer.verifyOtpCus({
        soDienThoai: customerInfo.phone,
        otp: otpString, // [SỬA] Gửi chuỗi OTP
      });

      // ... (Phần xử lý response bên dưới giữ nguyên)
      const isSuccess =
        response?.data?.success ||
        response?.success ||
        response?.status === 200;

      if (isSuccess) {
        setModalVisible(false);
        setOtpCode(new Array(6).fill("")); // [SỬA] Reset về mảng rỗng
        Alert.alert("Thành công", "Xác thực số điện thoại thành công!", [
          { text: "OK", onPress: () => goToNextScreen() },
        ]);
      } else {
        const msg =
          response?.data?.message || response?.message || "Mã OTP không đúng.";
        Alert.alert("Xác thực thất bại", msg);
        // [MỚI] Nếu sai, clear OTP để nhập lại
        setOtpCode(new Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch (error) {
      // ... (Giữ nguyên)
    } finally {
      setVerifying(false);
    }
  };

  const isFormValid =
    customerInfo.name.trim() &&
    customerInfo.phone.trim() &&
    customerInfo.email.trim();
  // agreedToTerms; // Tạm thời bỏ qua
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // <-- Hiển thị khi đang tải
      ) : (
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

          <BookingTimeline currentStep={4} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Xác thực số điện thoại</Text>
                <Text style={styles.modalSubText}>
                  Mã OTP đã được gửi đến số {customerInfo.phone}
                </Text>

                {/* [SỬA] Thay thế TextInput cũ bằng View chứa 6 ô */}
                <View style={styles.otpContainer}>
                  {otpCode.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpBox,
                        digit !== "" && styles.otpBoxFilled, // Style khi có chữ
                        // Thêm border màu xanh nếu đang focus (Tùy chọn nâng cao)
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      autoFocus={index === 0} // Chỉ focus ô đầu tiên
                      selectTextOnFocus={true} // Chọn text khi focus để dễ sửa
                    />
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnCancel]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalBtnTextCancel}>Hủy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnConfirm]}
                    onPress={handleVerifyOtp}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.modalBtnTextConfirm}>Xác nhận</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <KeyboardAvoidingView
            style={{ flex: 1 }} // Quan trọng: Đảm bảo nó chiếm đủ không gian
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Dùng 'padding' cho iOS, 'height' cho Android (hoặc 'height' cho cả hai)
            keyboardVerticalOffset={0} // Điều chỉnh nếu cần
          >
            <ScrollView style={styles.content}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

                {/* 6. THÊM CHECKBOX UI TẠI ĐÂY */}
                {user && ( // Chỉ hiển thị nếu đã đăng nhập
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={handleCheckboxToggle}
                  >
                    <Ionicons
                      name={
                        isBookingForSelf ? "checkbox-outline" : "square-outline"
                      }
                      size={24}
                      color="#007AFF"
                      style={styles.checkboxIcon}
                    />
                    <Text style={styles.checkboxLabel}>
                      Đặt vé cho bản thân
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tên người đi *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={customerInfo.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    placeholder="Nhập tên người đi"
                  />
                </View>

                <View style={styles.phoneInputGroup}>
                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.inputLabel}>Số điện thoại *</Text>
                    <TextInput
                      style={styles.phoneInput}
                      value={customerInfo.phone}
                      onChangeText={(value) =>
                        handleInputChange("phone", value)
                      }
                      placeholder="Nhập số điện thoại"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Email để nhận thông tin vé *
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={customerInfo.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Nhập email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.noticeContainer}>
                  <Text style={styles.noticeText}>
                    ✅ Thông tin đơn hàng sẽ được gửi đến số điện thoại và email
                    bạn cung cấp.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

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
                !isFormValid && styles.disabledButton,
              ]}
              onPress={handleContinue} // Đổi thành handleContinue thay vì chuyển trang trực tiếp
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
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
  content: {
    flex: 1,
  },
  formSection: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  // 7. BỔ SUNG STYLE CHO CHECKBOX
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Tạo khoảng cách với ô input Tên
    backgroundColor: "#f4f9ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  checkboxIcon: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  phoneInputGroup: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  noticeContainer: {
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 14,
    color: "#4CAF50",
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
  disabledButton: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  otpInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 5, // Làm rộng khoảng cách các số OTP
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#f5f5f5",
  },
  modalBtnConfirm: {
    backgroundColor: "#007AFF",
  },
  modalBtnTextCancel: {
    color: "#333",
    fontWeight: "bold",
  },
  modalBtnTextConfirm: {
    color: "white",
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  otpBoxFilled: {
    borderColor: "#007AFF", // Đổi màu viền khi có số
    backgroundColor: "#fff",
  },
});
