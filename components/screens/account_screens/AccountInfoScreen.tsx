"use client";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const AccountInfoScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState({
    name: "Tình",
    phone: "0372374650",
    email: "chautinh05122@gmail.com",
    birthDate: "",
    gender: "Nam",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(user.birthDate);
    setShowDatePicker(Platform.OS === "ios");
    setUser({ ...user, birthDate: currentDate.toISOString().split("T")[0] });
  };

  const handleSave = () => {
    Alert.alert("Thành công", "Thông tin đã được lưu.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
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

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Info Message */}

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
          }} // Replace with actual image path
          style={styles.avatar}
        />
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            value={user.phone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Ngày sinh</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {user.birthDate || "--/--/----"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={user.birthDate ? new Date(user.birthDate) : new Date()}
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
                user.gender === "Nam" && styles.selectedGender,
              ]}
              onPress={() => setUser({ ...user, gender: "Nam" })}
            >
              <Text style={styles.genderText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                user.gender === "Nữ" && styles.selectedGender,
              ]}
              onPress={() => setUser({ ...user, gender: "Nữ" })}
            >
              <Text style={styles.genderText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                user.gender === "Khác" && styles.selectedGender,
              ]}
              onPress={() => setUser({ ...user, gender: "Khác" })}
            >
              <Text style={styles.genderText}>Khác</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: "#4A90E2",
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

  backText: {
    color: "#FFFFFF",
    fontSize: 18,
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
    textDecorationLine: "underline",
  },
  infoMessage: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  avatarContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    marginVertical: 16,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  inputRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    color: "#666666",
  },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
  },
  countryCode: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
  },
  phoneNumber: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
  },
  verifiedMessage: {
    backgroundColor: "#E6FFE6",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: "#006600",
    textAlign: "center",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    alignItems: "center",
    marginRight: 8,
  },
  selectedGender: {
    borderColor: "#4A90E2",
    backgroundColor: "#E6F0FA",
  },
  genderText: {
    fontSize: 14,
    color: "#333333",
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountInfoScreen;
