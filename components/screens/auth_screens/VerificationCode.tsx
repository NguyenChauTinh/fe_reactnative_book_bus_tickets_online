import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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
import { useAuth } from "../../../contexts/AuthContext";
const COLORS = {
  primaryBlue: "#007AFF",
  headerBlue: "#2A8CFF",
  buttonBlue: "#0D47A1",
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#F5F5F5",
  mediumGray: "#DDDDDD",
  darkGray: "#888888",
  textPrimary: "#333333",
  textSecondary: "#666666",
  dangerRed: "#FF3B30",
};

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  VerificationCode: { phoneNumber: string };
};

type VerificationCodeProps = NativeStackScreenProps<
  RootStackParamList,
  "VerificationCode"
>;

const VerificationCode: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { phoneNumber, fromScreen, fullName, email, dob, gender } =
    route.params || {};

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [focusedInput, setFocusedInput] = useState(0);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<RNTextInput | null>>(Array(6).fill(null));

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { login } = useAuth();

  // --- Logic đếm ngược ---
  useEffect(() => {
    if (canResend) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, canResend]);

  // --- Xử lý nhập mã ---
  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pastedCode = text.slice(0, 6).split("");
      setCode(pastedCode.concat(Array(6 - pastedCode.length).fill("")));
      inputRefs.current[pastedCode.length - 1]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Tự động chuyển sang ô tiếp theo
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // --- Xử lý phím Backspace ---
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- Định dạng thời gian ---
  const formatTime = (seconds: number) => {
    const remainingSeconds = seconds % 60;
    return `00:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);

    try {
      if (fromScreen === "register") {
        await Api_Auth_Customer.requestRegisterOtp({
          soDienThoai: phoneNumber,
        });
      } else {
        await Api_Auth_Customer.requestLoginOtp({ soDienThoai: phoneNumber });
      }

      Alert.alert("Thành công", "Mã xác thực mới đã được gửi.");
      setCanResend(false);
      setTimer(60);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi lại mã."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = async () => {
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số xác thực");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (fromScreen === "register") {
        const payload = {
          hoVaTen: fullName,
          soDienThoai: phoneNumber,
          email: email,
          ngaySinh: dob,
          gioiTinh: gender,
          otp: otpCode,
        };

        await Api_Auth_Customer.completeRegistration(payload);

        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        navigation.replace("Login");
      } else {
        const payload = {
          soDienThoai: phoneNumber,
          otp: otpCode,
        };

        const response = await Api_Auth_Customer.verifyLoginOtp(payload);
        const { token, userId, refreshToken } = response;

        if (!token || !userId) {
          Alert.alert(
            "Lỗi đăng nhập",
            "Không nhận được token hoặc userId từ server."
          );
          setIsLoading(false);
          return;
        }
       const user = {
          khachHangId: response.khachHangId,
          hoVaTen: response.hoVaTen, 
          soDienThoai: phoneNumber,
          email: response.email, 
          taiKhoanId: userId
        };

        await login(token, user, refreshToken);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Mã xác thực không đúng hoặc đã hết hạn!";

      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBlue} />

      {/* --- Header (Giống Login) --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhập mã xác thực</Text>
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
            <Text style={styles.infoText}>
              Nhập mã xác thực được gửi đến số
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                +84
                {phoneNumber.startsWith("0")
                  ? phoneNumber.substring(1)
                  : phoneNumber}{" "}
              </Text>
              qua tin nhắn Zalo
            </Text>

            {/* --- Ô nhập mã OTP --- */}
            <View style={styles.codeInputContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.codeInput,
                    focusedInput === index && styles.codeInputFocused,
                  ]}
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedInput(index)}
                  onBlur={() => setFocusedInput(-1)}
                  keyboardType="number-pad"
                  maxLength={6} // Cho phép dán
                  textAlign="center"
                />
              ))}
            </View>

            {/* --- Nút Tiếp tục --- */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
              )}
            </TouchableOpacity>

            {/* --- Gửi lại mã --- */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Không nhận được mã xác thực?
              </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} disabled={isResending}>
                  <Text style={styles.resendLink}>
                    {isResending ? "Đang gửi..." : "Gửi lại mã xác thực"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendText}>
                  Gửi lại mã xác thực sau{" "}
                  <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </Text>
              )}
            </View>
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
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22, // Nhỏ hơn một chút cho vừa
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
  infoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.mediumGray,
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  codeInputFocused: {
    borderBottomColor: COLORS.primaryBlue,
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
  resendContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primaryBlue,
    fontWeight: "bold",
  },
  timerText: {
    color: COLORS.dangerRed,
    fontWeight: "bold",
  },
});

export default VerificationCode;
