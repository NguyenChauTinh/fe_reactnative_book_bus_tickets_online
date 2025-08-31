"use client";

import { useState } from "react";
import {
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

// Sample notification data
const mockNotifications = {
  trips: [
    {
      id: 1,
      title: "Vé đã được xác nhận",
      message:
        "Vé chuyến Hồ Chí Minh → Đà Lạt lúc 08:00 ngày 20/08/2025 đã được xác nhận.",
      time: "2 giờ trước",
      isRead: false,
    },
    {
      id: 2,
      title: "Nhắc nhở chuyến đi",
      message:
        "Chuyến xe của bạn sẽ khởi hành trong 30 phút. Vui lòng có mặt tại bến xe.",
      time: "30 phút trước",
      isRead: false,
    },
    {
      id: 3,
      title: "Chuyến đi hoàn thành",
      message:
        "Cảm ơn bạn đã sử dụng dịch vụ. Hãy đánh giá chuyến đi để cải thiện chất lượng.",
      time: "1 ngày trước",
      isRead: true,
    },
    {
      id: 4,
      title: "Thay đổi lịch trình",
      message:
        "Chuyến xe Hà Nội → Sapa đã thay đổi giờ khởi hành từ 07:00 thành 07:30.",
      time: "2 ngày trước",
      isRead: true,
    },
  ],
  promotions: [
    {
      id: 5,
      title: "Giảm 20% cho chuyến đi đầu tiên",
      message:
        "Sử dụng mã FIRST20 để được giảm 20% cho chuyến đi đầu tiên của bạn.",
      time: "1 giờ trước",
      isRead: false,
    },
    {
      id: 6,
      title: "Khuyến mãi cuối tuần",
      message:
        "Giảm 15% cho tất cả chuyến đi vào thứ 7 và chủ nhật. Áp dụng đến 31/08.",
      time: "3 giờ trước",
      isRead: false,
    },
    {
      id: 7,
      title: "Tích điểm thưởng",
      message:
        "Bạn đã tích được 150 điểm thưởng. Đổi ngay để nhận ưu đãi hấp dẫn!",
      time: "1 ngày trước",
      isRead: true,
    },
    {
      id: 8,
      title: "Flash Sale 24h",
      message:
        "Giảm đến 30% cho các tuyến hot. Chỉ còn 12 giờ để săn vé giá rẻ!",
      time: "2 ngày trước",
      isRead: true,
    },
  ],
};

const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState("trips");

  const renderNotificationItem = (notification: any) => (
    <View key={notification.id} style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
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

  const currentNotifications =
    activeTab === "trips"
      ? mockNotifications.trips
      : mockNotifications.promotions;

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
        {currentNotifications.length > 0
          ? currentNotifications.map(renderNotificationItem)
          : renderEmptyState()}
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
    backgroundColor: "#4A90E2",
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
    borderBottomColor: "#4A90E2",
  },
  tabText: {
    fontSize: 16,
    color: "#999999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4A90E2",
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
    backgroundColor: "#4A90E2",
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
