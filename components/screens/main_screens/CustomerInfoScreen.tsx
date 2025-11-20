"use client";

import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../../../contexts/AuthContext";

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

  const handleContinue = () => {
    // TODO: Thêm kiểm tra validation (tên, sđt, email) ở đây trước khi chuyển
    // Ví dụ: if (customerInfo.name.trim().length === 0) { ... }

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
                  <Text style={styles.checkboxLabel}>Đặt vé cho bản thân</Text>
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
                    onChangeText={(value) => handleInputChange("phone", value)}
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
                !isFormValid && styles.disabledButton, // Thêm style disable
              ]}
              onPress={handleContinue}
              disabled={!isFormValid} // Thêm prop disable
            >
              <Text style={styles.continueButtonText}>Tiếp tục</Text>
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
});