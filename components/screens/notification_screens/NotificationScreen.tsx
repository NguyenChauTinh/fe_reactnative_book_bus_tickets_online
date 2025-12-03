"use client";

import { api_booking_service } from "@/apis/api_booking_service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Bell Icon Component
const BellIcon = () => (
  <View style={styles.bellIcon}>
    <View style={styles.bellBody} />
    <View style={styles.bellHandle} />
    <View style={styles.bellClapper} />
  </View>
);

const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState("trips");

  // 👈 Dùng state thật thay vì mock
  const [trips, setTrips] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👈 Lấy dữ liệu từ API khi màn hình được mở
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // ⚠️ THAY THẾ: Gọi API thật của bạn
        // Đây là API bạn đã tạo ở Bước 2.3
        const userData = await AsyncStorage.getItem("userData"); // Giả sử bạn lưu userId trong AsyncStorage
        const userId = userData ? JSON.parse(userData).taiKhoanId : null;
        console.log("Fetching notifications for userId:", userId);
        const response: any =
          await api_booking_service.getNotificationsByUserId(userId);

        const allNotifs = response.data;
        setTrips(allNotifs.filter((n) => n.type === "trip"));
        setPromotions(allNotifs.filter((n) => n.type === "promotion"));
        // }
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Chỉ chạy 1 lần khi mở màn hình

  const renderNotificationItem = (notification: any) => (
    <View key={notification._id} style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>

          {/* SỬA DÒNG NÀY: Dùng toLocaleString để thêm giờ */}
          <Text style={styles.notificationTime}>
            {new Date(notification.createdAt).toLocaleString("vi-VN")}
          </Text>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BellIcon />
      <Text style={styles.emptyTitle}>Bạn chưa có thông báo nào</Text>
      <Text style={styles.emptySubtitle}>
        Bạn sẽ nhận được thông báo khi có cập nhật{"\n"}
        vé chuyến đi, điểm thưởng hoặc khuyến mãi.
      </Text>
    </View>
  );

  const currentNotifications = activeTab === "trips" ? trips : promotions;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "trips" && styles.activeTab]}
          onPress={() => setActiveTab("trips")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "trips" && styles.activeTabText,
            ]}
          >
            Chuyến đi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "promotions" && styles.activeTab]}
          onPress={() => setActiveTab("promotions")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "promotions" && styles.activeTabText,
            ]}
          >
            Khuyến mãi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4A90E2"
            style={{ marginTop: 50 }}
          />
        ) : currentNotifications.length > 0 ? (
          currentNotifications.map(renderNotificationItem)
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#999999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999999",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  bellIcon: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  bellBody: {
    width: 50,
    height: 50,
    backgroundColor: "#A8C8EC",
    borderRadius: 25,
    position: "relative",
  },
  bellHandle: {
    width: 12,
    height: 8,
    backgroundColor: "#A8C8EC",
    borderRadius: 6,
    position: "absolute",
    top: -4,
  },
  bellClapper: {
    width: 6,
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    position: "absolute",
    bottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationScreen;
