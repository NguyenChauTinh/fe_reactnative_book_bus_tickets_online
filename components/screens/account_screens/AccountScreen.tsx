"use client";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
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

// Component con cho từng mục menu
const MenuItem = ({
  icon,
  name,
  onPress,
  hasNav = true,
  badge = "",
}: {
  icon: string;
  name: string;
  onPress: () => void;
  hasNav?: boolean;
  badge?: string;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons
      name={icon as any}
      size={22}
      color="#007AFF"
      style={styles.menuIcon}
    />
    <Text style={styles.menuText}>{name}</Text>
    {badge ? <Text style={styles.badge}>{badge}</Text> : null}
    {hasNav && (
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color="#BDBDBD"
        style={styles.menuArrow}
      />
    )}
  </TouchableOpacity>
);

const AccountScreen = ({ navigation }: { navigation: any }) => {
  // Lấy user và hàm logout từ Context
  const { user, logout } = useAuth();

  const initials = getInitials(user?.hoVaTen);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/* Avatar với chữ cái đầu */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.hoVaTen || "Khách"}</Text>
            <Text style={styles.userStatus}>Thành viên Mới</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountInfoScreen")}
        >
          <Text style={styles.editLink}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Menu Items Section 1 */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="star-outline"
            name="Điểm thưởng của tôi"
            onPress={() => {}}
          />
          <MenuItem
            icon="pricetag-outline"
            name="Ưu đãi"
            onPress={() => {}}
          />
          <MenuItem
            icon="gift-outline"
            name="Giới thiệu nhận quà"
            onPress={() => {}}
            badge="Mới"
          />
        </View>
        {/* Menu Items Section 2 */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="card-outline"
            name="Quản lý thẻ"
            onPress={() => {}}
          />
          <MenuItem
            icon="chatbubble-ellipses-outline"
            name="Đánh giá chuyến đi"
            onPress={() => {}}
          />
          <MenuItem
            icon="settings-outline"
            name="Cài đặt"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            name="Trung tâm Hỗ trợ"
            onPress={() => {}}
          />
          <MenuItem icon="mail-outline" name="Góp ý" onPress={() => {}} />
        </View>

        {/* Language Selection */}
        <View style={styles.menuSection}>
          <View style={styles.languageContainer}>
            <TouchableOpacity style={styles.languageButtonActive}>
              <Text style={styles.languageFlag}>🇻🇳</Text>
              <Text style={styles.languageTextActive}>Tiếng Việt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageFlag}>🇬🇧</Text>
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="log-out-outline"
            name="Đăng xuất"
            onPress={logout} // Gọi hàm logout từ context
            hasNav={false}
          />
        </View>

        {/* Version Text */}
        <Text style={styles.versionText}>v8.9.35p</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Màu nền xám nhạt
  },
  header: {
    backgroundColor: "#007AFF", // Màu xanh dương
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4CAF50", // Màu xanh lá cho avatar
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  userStatus: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  editLink: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden", // Để bo góc
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  menuIcon: {
    width: 24,
    marginRight: 16,
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333333",
  },
  badge: {
    backgroundColor: "#E53935",
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    overflow: "hidden",
  },
  menuArrow: {
    marginLeft: "auto",
  },
  bannerContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  bannerImage: {
    width: "100%",
    height: 100, // Điều chỉnh chiều cao banner
    borderRadius: 8,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  languageButtonActive: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#E3F2FD",
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: "#666",
  },
  languageTextActive: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#9E9E9E",
    fontSize: 12,
    marginVertical: 16,
  },
});

export default AccountScreen;