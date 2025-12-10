import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Api_Auth_Customer } from "../../../apis/api_auth.js";

const COLORS = {
  headerBlue: "#2A8CFF",
  buttonBlue: "#0D47A1",
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#F5F5F5",
  mediumGray: "#DDDDDD",
  darkGray: "#888888",
  textPrimary: "#333333",
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef<RNTextInput>(null);

  const handleRequestOtp = async (method: "phone" | "email") => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await Api_Auth_Customer.requestLoginOtp({
        soDienThoai: phone,
        method: method,
      });

      setIsModalVisible(false);
      navigation.navigate("VerificationCode", {
        phoneNumber: phone,
        fromScreen: "login",
        method: method,
      });
    } catch (error: any) {
      setIsModalVisible(false);

      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);

      Alert.alert(
        "Lỗi",
        error.response?.data?.message ||
          "Không thể gửi mã OTP. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Chọn phương thức nhận mã xác thực (OTP) cho số
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                +84{phone.startsWith("0") ? phone.substring(1) : phone}
              </Text>
            </Text>

            {/* Nút 1: Gửi qua Zalo/SMS (Phương thức: phone) */}
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => handleRequestOtp("phone")} // THAY ĐỔI: Gửi method 'phone'
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={18}
                    color={COLORS.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.modalButtonTextPrimary}>
                    Gửi mã qua Zalo/SMS
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Nút 2: Gửi qua Email (Phương thức: email) */}
            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => handleRequestOtp("email")} // THAY ĐỔI: Gửi method 'email'
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <>
                  <Ionicons
                    name="mail-outline" // THAY ĐỔI: Icon mail
                    size={18}
                    color={COLORS.textPrimary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.modalButtonTextSecondary}>
                    Gửi mã qua Email
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Nút Thay đổi số điện thoại */}
            <TouchableOpacity
              style={styles.modalButtonTertiary}
              onPress={() => {
                setIsModalVisible(false);

                setTimeout(() => {
                  phoneInputRef.current?.focus();
                }, 100);
              }}
              disabled={isLoading}
            >
              <Text style={styles.modalButtonTextTertiary}>
                Thay đổi số điện thoại
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBlue} />

      {/* --- Header --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>
              {isFocused ? "Đăng nhập" : "Xin chào"}
            </Text>
            {!isFocused && (
              <Text style={styles.headerSubtitle}>
                Đăng nhập để tận hưởng nhiều ưu đãi
              </Text>
            )}
          </View>
        </View>

        {/* Placeholder cho hình ảnh xe bus */}
        {/* Bạn có thể thay thế bằng file ảnh .png của mình */}
        <Ionicons
          name="bus"
          size={80}
          color={COLORS.white}
          style={styles.busIcon1}
        />
        <Ionicons
          name="bus-outline"
          size={60}
          color={COLORS.white}
          style={styles.busIcon2}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Phần thân (Form) --- */}
          <View style={styles.body}>
            {/* Input số điện thoại */}
            <View
              style={[
                styles.phoneInputContainer,
                isFocused && styles.phoneInputContainerFocused,
              ]}
            >
              <TouchableOpacity style={styles.countryCodeButton}>
                <Text style={styles.countryCodeText}>🇻🇳 (+84)</Text>
                <Ionicons
                  name="caret-down"
                  size={12}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
              <TextInput
                ref={phoneInputRef}
                style={styles.phoneInput}
                placeholder="Số điện thoại"
                placeholderTextColor={COLORS.darkGray}
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            {/* Nút Tiếp tục / Đăng nhập */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                if (phone.length !== 10) {
                  Alert.alert(
                    "Lỗi",
                    "Số điện thoại phải có đúng 10 chữ số để tiếp tục."
                  );
                  phoneInputRef.current?.focus();
                } else {
                  setIsModalVisible(true);
                }
              }}
            >
              <Text style={styles.continueButtonText}>
                {isFocused ? "Tiếp tục" : "Đăng nhập"}
              </Text>
            </TouchableOpacity>

            {/* Dấu gạch "hoặc" */}
            {/* <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>hoặc</Text>
              <View style={styles.separatorLine} />
            </View> */}

            {/* Đăng nhập mạng xã hội */}
            {/* <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={22} color="#DB4437" />
              <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color={COLORS.black} />
              <Text style={styles.socialButtonText}>Tiếp tục với Apple</Text>
            </TouchableOpacity> */}
          </View>

          {/* --- Footer (Đăng ký) --- */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text style={[styles.footerText, styles.footerLink]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// --- Toàn bộ Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.headerBlue,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 60, // Thêm không gian cho hình ảnh xe bus
    position: "relative",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  busIcon1: {
    position: "absolute",
    bottom: 10,
    right: 50,
    opacity: 0.3,
  },
  busIcon2: {
    position: "absolute",
    bottom: 20,
    right: 15,
    opacity: 0.5,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  body: {
    padding: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  phoneInputContainerFocused: {
    borderColor: COLORS.headerBlue, // Hiển thị viền xanh khi focus
    borderWidth: 1.5,
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: COLORS.mediumGray,
    backgroundColor: COLORS.lightGray,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  continueButton: {
    backgroundColor: COLORS.buttonBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.mediumGray,
  },
  separatorText: {
    marginHorizontal: 10,
    color: COLORS.darkGray,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  footerLink: {
    color: COLORS.buttonBlue,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
    justifyContent: "center", // THAY ĐỔI: 'flex-end' -> 'center'
    alignItems: "center",
    paddingHorizontal: 20, // Thêm padding ngang để modal không bị dính sát viền
  },
  modalContainer: {
    width: "100%", // Giữ 100% chiều rộng (của vùng đã có padding)
    backgroundColor: COLORS.white,
    borderRadius: 16, // THAY ĐỔI: Áp dụng cho cả 4 góc
    padding: 24, // THAY ĐỔI: Dùng padding 24 cho mọi phía
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  modalButtonPrimary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.headerBlue, // Dùng màu xanh dương
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalButtonTextPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonSecondary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalButtonTextSecondary: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonTertiary: {
    alignItems: "center",
    padding: 10,
  },
  modalButtonTextTertiary: {
    color: COLORS.headerBlue,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
