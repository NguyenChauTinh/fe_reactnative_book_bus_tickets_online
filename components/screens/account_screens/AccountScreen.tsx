"use client";

import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AccountScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
            }} // Replace with actual image path
            style={styles.avatar}
          />
          <Text style={styles.userName}>Tình</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountInfoScreen")}
        >
          <Text style={styles.settingsText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Invite")}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconText}>🎁</Text>
          </View>
          <Text style={styles.menuText}>Ưu đãi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("InviteFriends")}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconText}>🎉</Text>
          </View>
          <Text style={styles.menuText}>Giới thiệu bạn qua Mời</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{
            uri: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
          }} // Replace with actual banner image path
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Address */}
      <TouchableOpacity style={styles.addressItem}>
        <View style={styles.addressIcon}>
          <Text style={styles.iconText}>📍</Text>
        </View>
        <Text style={styles.addressText}>Quận lý thế</Text>
      </TouchableOpacity>

      {/* Additional Options */}
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => navigation.navigate("TripHistory")}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>📅</Text>
        </View>
        <Text style={styles.optionText}>Danh sách chuyến đi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => navigation.navigate("TripRating")}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>⭐</Text>
        </View>
        <Text style={styles.optionText}>Đánh giá chuyến đi</Text>
        <Text style={styles.versionText}>v8.9.30p</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => navigation.navigate("Support")}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>❓</Text>
        </View>
        <Text style={styles.optionText}>Trung tâm Hỗ trợ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => navigation.navigate("Inbox")}
      >
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>📩</Text>
        </View>
        <Text style={styles.optionText}>Góp ý</Text>
      </TouchableOpacity>

      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={styles.languageItem}
          onPress={() => navigation.navigate("Vietnamese")}
        >
          <Image
            source={{
              uri: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
            }}
            style={styles.flagIcon}
          />
          <Text style={styles.languageText}>Tiếng Việt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.languageItem}
          onPress={() => navigation.navigate("English")}
        >
          <Image
            source={{
              uri: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
            }}
            style={styles.flagIcon}
          />
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#4A90E2",
    padding: 16,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  settingsText: {
    color: "#FFFFFF",
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#333333",
  },
  banner: {
    marginVertical: 8,
  },
  bannerImage: {
    width: "100%",
    height: 120,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 8,
  },
  addressIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addressText: {
    fontSize: 16,
    color: "#333333",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 8,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  versionText: {
    fontSize: 12,
    color: "#999999",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    marginBottom: 8,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: "#333333",
  },
  logoutButton: {
    padding: 12,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default AccountScreen;
