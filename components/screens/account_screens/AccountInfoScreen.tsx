"use client";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator, // 1. IMPORT THÊM
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Api_KhachHang } from "../../../apis/api_auth.js";
import { useAuth } from "../../../contexts/AuthContext";

const getInitials = (name?: string) => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length >= 2) {
    // Lấy chữ cái đầu của 2 từ cuối
    return `${words[words.length - 2][0]}${
      words[words.length - 1][0]
    }`.toUpperCase();
  } else if (words.length === 1) {
    // Lấy 2 chữ cái đầu nếu chỉ có 1 từ
    return words[0].substring(0, 2).toUpperCase();
  }
  return "";
};

const AccountInfoScreen = ({ navigation }: { navigation: any }) => {
  const { user: contextUser, logout, login, token } = useAuth();

  const [formData, setFormData] = useState({
    hoVaTen: contextUser?.hoVaTen || "",
    phone: contextUser?.soDienThoai || "",
    email: contextUser?.email || "",
    ngaySinh: contextUser?.ngaySinh || "",
    gioiTinh: contextUser?.gioiTinh || "Nam",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate =
      selectedDate ||
      (formData.ngaySinh ? new Date(formData.ngaySinh) : new Date());
    setShowDatePicker(Platform.OS === "ios");
    setFormData({
      ...formData,
      ngaySinh: currentDate.toISOString().split("T")[0],
    });
  };

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const payload = {
      userId: contextUser?.taiKhoanId,
      hoVaTen: formData.hoVaTen,
      email: formData.email,
      ngaySinh: formData.ngaySinh || contextUser?.ngaySinh,
      gioiTinh: formData.gioiTinh || contextUser?.gioiTinh,
    };

    try {
      const updatedProfile = await Api_KhachHang.updateMyProfile(payload);
      console.log("Response == ", updatedProfile);
      
      if (token && contextUser) {
        const updatedUser = {
          ...contextUser, 
          hoVaTen: updatedProfile.data.hoVaTen,
          email: updatedProfile.data.email,
          ngaySinh: updatedProfile.data.ngaySinh,
          gioiTinh: updatedProfile.data.gioiTinh,
        };
        await login(token, updatedUser);
      }

      Alert.alert("Thành công", updatedProfile.message , [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message ||
          "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy chữ cái đầu từ state đang chỉnh sửa
  const initials = getInitials(formData.hoVaTen);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
        </View>

        {/* 5. Sửa hàm Đăng xuất (dùng logout từ context) */}
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Info Message */}
      <View style={styles.infoMessage}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color="#007AFF"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.infoText}>
          Bổ sung đầy đủ thông tin sẽ giúp hỗ trợ bạn tốt hơn khi đặt vé.
        </Text>
      </View>

      <ScrollView>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {/* 6. Hiển thị avatar với initials từ state */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Form Fields - 7. Cập nhật value và onChangeText */}
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              value={formData.hoVaTen}
              onChangeText={(text) =>
                setFormData({ ...formData, hoVaTen: text })
              }
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Số điện thoại *</Text>
            {/* Input số điện thoại (giả định không cho sửa) */}
            <View style={[styles.input, styles.disabledInput]}>
              <Text style={styles.disabledText}>🇻🇳 (+84)</Text>
              <Text style={[styles.disabledText, { marginLeft: 10 }]}>
                {formData.phone}
              </Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
          </View>

          {/* Thông báo xác thực */}
          <View style={styles.verifiedMessage}>
            <Ionicons name="shield-checkmark" size={16} color="#006600" />
            <Text style={styles.verifiedText}>
              Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn cung
              cấp.
            </Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.ngaySinh || "DD/MM/YYYY"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  formData.ngaySinh
                    ? new Date(formData.ngaySinh)
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gioiTinh === "Nam" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gioiTinh: "Nam" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gioiTinh === "Nam" && styles.selectedGenderText,
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gioiTinh === "Nữ" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gioiTinh: "Nữ" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gioiTinh === "Nữ" && styles.selectedGenderText,
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gioiTinh === "Khác" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gioiTinh: "Khác" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gioiTinh === "Khác" && styles.selectedGenderText,
                  ]}
                >
                  Khác
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        {/* 8. CẬP NHẬT NÚT LƯU */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007AFF", // Màu xanh dương
    padding: 16,
    // ĐÃ XÓA paddingTop: 50
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    color: "#FFFFFF",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0D47A1", // Màu xanh đậm
  },
  avatarContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50", // Xanh lá
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  inputRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
  },
  disabledText: {
    fontSize: 16,
    color: "#666",
  },
  verifiedMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  verifiedText: {
    fontSize: 14,
    color: "#1B5E20",
    marginLeft: 8,
    flex: 1,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  genderContainer: {
    flexDirection: "row",
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  selectedGender: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGenderText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  saveButton: {
    backgroundColor: "#0D47A1", // Xanh đậm
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#B0BEC5", 
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountInfoScreen;