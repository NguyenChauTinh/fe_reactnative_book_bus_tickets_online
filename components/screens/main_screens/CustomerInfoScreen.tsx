"use client";

import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// SVG Icons
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

const VietnamFlagIcon = () => (
  <svg width="24" height="16" viewBox="0 0 24 16">
    <rect width="24" height="16" fill="#DA020E" />
    <polygon
      points="12,2 13.5,6.5 18,6.5 14.5,9.5 16,14 12,11 8,14 9.5,9.5 6,6.5 10.5,6.5"
      fill="#FFFF00"
    />
  </svg>
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

  const [customerInfo, setCustomerInfo] = useState({
    name: "T Ng",
    phone: "372374650",
    email: "chautinh05122@gmail.com",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
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
    customerInfo.name &&
    customerInfo.phone &&
    customerInfo.email &&
    agreedToTerms;

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.progressContainer}>
        <Text style={styles.activeStepText}>Nhập thông tin</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

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
            <Text style={styles.inputLabel}>Email để nhận thông tin vé *</Text>
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
              ✅ Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn
              cung cấp.
            </Text>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Bằng việc nhấn nút Tiếp tục, bạn đồng ý với{" "}
              <TouchableOpacity>
                <Text style={styles.termsLink}>
                  Chính sách bảo mật thông tin
                </Text>
              </TouchableOpacity>{" "}
              và{" "}
              <TouchableOpacity>
                <Text style={styles.termsLink}>Quy chế</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tạm tính</Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentNoteContainer}>
        <Text style={styles.paymentNoteText}>
          Bạn có thể mua thêm tiện ích ở bước tiếp theo
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4A90E2",
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
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  progressContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  activeStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },
  completedStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  inactiveStepNumber: {
    color: "white",
    fontSize: 12,
  },
  activeStepText: {
    color: "#4A90E2",
    fontSize: 18,
    marginTop: 4,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  completedStepText: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  inactiveStepText: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  progressLine: {
    width: 30,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
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
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 100,
  },
  countryCode: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
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
  termsContainer: {
    marginTop: 10,
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  bottomBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
  paymentNoteContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paymentNoteText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
