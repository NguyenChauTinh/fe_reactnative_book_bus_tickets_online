"use client";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";

const getInitials = (name?: string) => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length >= 2) {
    return `${words[words.length - 2][0]}${
      words[words.length - 1][0]
    }`.toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return "";
};

const AccountInfoScreen = ({ navigation }: { navigation: any }) => {
  const { user: contextUser, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: contextUser?.hoVaTen || "",
    phone: contextUser?.soDienThoai || "",
    email: contextUser?.email || "",
    birthDate: contextUser?.ngaySinh || "",
    gender: contextUser?.gioiTinh || "Nam",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || (formData.birthDate ? new Date(formData.birthDate) : new Date());
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, birthDate: currentDate.toISOString().split("T")[0] });
  };

  const handleSave = () => {
    Alert.alert("Thành công", "Thông tin đã được lưu.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const initials = getInitials(formData.name);

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
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Số điện thoại *</Text>
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
                {formData.birthDate || "DD/MM/YYYY"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  formData.birthDate ? new Date(formData.birthDate) : new Date()
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
                  formData.gender === "Nam" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gender: "Nam" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === "Nam" && styles.selectedGenderText,
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === "Nữ" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gender: "Nữ" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === "Nữ" && styles.selectedGenderText,
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === "Khác" && styles.selectedGender,
                ]}
                onPress={() => setFormData({ ...formData, gender: "Khác" })}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === "Khác" && styles.selectedGenderText,
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
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
    backgroundColor: "#007AFF", 
    padding: 16,
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
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountInfoScreen;