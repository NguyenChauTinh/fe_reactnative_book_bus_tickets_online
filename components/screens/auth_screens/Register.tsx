import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Api_Auth_Customer } from "../../../apis/api_auth.js";

// --- Định nghĩa màu sắc cho dễ quản lý ---
const COLORS = {
  primaryBlue: "#007AFF", // Xanh dương chủ đạo
  buttonBlue: "#0D47A1", // Xanh đậm của nút
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#F5F5F5",
  mediumGray: "#DDDDDD",
  darkGray: "#888888",
  textPrimary: "#333333",
  textSecondary: "#666666",
  successGreen: "#4CD964",
  successGreenBg: "#EAF9EB",
};

/**
 * Component TextInput có nhãn ở trên
 */
const LabeledTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} <Text style={{ color: "red" }}>*</Text>
    </Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.darkGray}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  </View>
);

const Register: React.FC = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(false);
  const handleRequestOtp = async (method: "phone" | "email") => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await Api_Auth_Customer.requestRegisterOtp({ 
        soDienThoai: phone, 
        email: email, 
        method: method
      });

      setIsModalVisible(false);

      navigation.navigate("VerificationCode", {
        phoneNumber: phone,
        fromScreen: "register",
        fullName: fullName,
        email: email,
        dob: dob,
        gender: gender,
        method: method,
      });
    } catch (error: any) {

      setIsModalVisible(false);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message ||
          "Không thể gửi mã OTP. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = () => {
    if (!fullName || !phone || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ họ tên, số điện thoại và email.");
      return;
    }
    
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
       Alert.alert("Lỗi", "Số điện thoại không hợp lệ (Phải có 10 chữ số).");
      return;
    }

    setIsModalVisible(true);
  };

  /**
   * Hàm render nút chọn giới tính
   */
  const renderGenderButton = (title: "Nam" | "Nữ" | "Khác") => {
    const isActive = gender === title;
    return (
      <TouchableOpacity
        style={[
          styles.genderButton,
          isActive ? styles.genderButtonActive : styles.genderButtonInactive,
        ]}
        onPress={() => setGender(title)}
      >
        <Text
          style={[
            styles.genderButtonText,
            isActive
              ? styles.genderButtonTextActive
              : styles.genderButtonTextInactive,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
              . Mã xác thực sẽ được dùng để hoàn tất đăng ký.
            </Text>

            {/* Nút 1: Gửi qua Zalo/SMS (Phương thức: phone) */}
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => handleRequestOtp('phone')}
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
              onPress={() => handleRequestOtp('email')} // Dùng hàm mới
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <>
                  <Ionicons
                    name="mail-outline"
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

            {/* Nút Hủy */}
            <TouchableOpacity
              style={styles.modalButtonTertiary}
              onPress={() => setIsModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.modalButtonTextTertiary}>
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryBlue}
      />

      {/* --- Header (Giống màn hình Login) --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Phần thân (Form Đăng Ký) --- */}
          <View style={styles.body}>
            {/* Họ và tên */}
            <LabeledTextInput
              label="Họ và tên"
              placeholder="Nhập họ và tên của bạn"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Số điện thoại */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Số điện thoại <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View style={styles.phoneInputContainer}>
                <TouchableOpacity style={styles.countryCodeButton}>
                  <Text style={styles.countryCodeText}>🇻🇳 (+84)</Text>
                  <Ionicons
                    name="caret-down"
                    size={12}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.textInput}
                  placeholder="Số điện thoại"
                  placeholderTextColor={COLORS.darkGray}
                  keyboardType="numeric"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Email */}
            <LabeledTextInput
              label="Email"
              placeholder="Nhập email của bạn (không bắt buộc)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {/* Sửa label lại nếu email là bắt buộc */}

            {/* Thông báo */}
            <View style={styles.infoBox}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.successGreen}
              />
              <Text style={styles.infoBoxText}>
                Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn
                cung cấp.
              </Text>
            </View>

            {/* Ngày sinh */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ngày sinh</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                // Thêm onPress để mở DatePicker modal tại đây
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="DD/MM/YYYY (không bắt buộc)"
                  placeholderTextColor={COLORS.darkGray}
                  value={dob}
                  onChangeText={setDob}
                />
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={COLORS.textSecondary}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>

            {/* Giới tính */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderContainer}>
                {renderGenderButton("Nam")}
                {renderGenderButton("Nữ")}
                {renderGenderButton("Khác")}
              </View>
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} /> 
              ) : (
                <Text style={styles.continueButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* --- Footer (Đăng nhập) --- */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.footerText, styles.footerLink]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Toàn bộ Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  body: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
textInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  // --- Styles cho SĐT (từ LoginScreen) ---
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13, // Chỉnh lại cho cân
    borderRightWidth: 1,
    borderRightColor: COLORS.mediumGray,
    backgroundColor: COLORS.lightGray,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.textPrimary,
  },
  // --- Style cho Info Box ---
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.successGreenBg,
    borderColor: COLORS.successGreen,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoBoxText: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  // --- Styles cho Giới tính ---
  // genderContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // genderButton: {
  //   flex: 1,
  //   paddingVertical: 12,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   borderWidth: 1,
  // },
  genderButtonInactive: {
    borderColor: COLORS.mediumGray,
    backgroundColor: COLORS.white,
  },
  genderButtonActive: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.primaryBlue,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  genderButtonTextInactive: {
    color: COLORS.textSecondary,
  },
  genderButtonTextActive: {
    color: COLORS.white,
  },
  // Thêm margin giữa các nút
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 4, // Thêm khoảng cách
  },
  // Sửa lại style cho genderContainer
  genderContainer: {
    flexDirection: "row",
    justifyContent: "center", // Canh giữa
    marginHorizontal: -4, // Bù lại margin của nút
  },
  // --- Nút bấm và Footer ---
  continueButton: {
    backgroundColor: COLORS.buttonBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Giảm margin top
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginTop: 10,
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    modalContainer: {
      width: "100%",
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 24,
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
      backgroundColor: COLORS.primaryBlue, // Dùng primaryBlue cho Register
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
      color: COLORS.primaryBlue,
      fontSize: 16,
      fontWeight: "bold",
    },
});

export default Register;
