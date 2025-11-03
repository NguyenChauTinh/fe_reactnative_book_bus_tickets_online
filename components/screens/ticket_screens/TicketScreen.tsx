"use client";

import type React from "react";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Ticket {
  id: string;
  status: "current" | "completed" | "cancelled";
  route: string;
  time: string;
  date: string;
  ticketNumber: string;
  price: string;
}

const mockTickets: Ticket[] = [
  // Current tickets
  {
    id: "1",
    status: "current",
    route: "Hồ Chí Minh → Đà Lạt",
    time: "08:00",
    date: "20/12/2024",
    ticketNumber: "50H-123.45",
    price: "180.000đ",
  },
  {
    id: "2",
    status: "current",
    route: "Hà Nội → Hải Phòng",
    time: "14:30",
    date: "22/12/2024",
    ticketNumber: "30A-678.90",
    price: "120.000đ",
  },
  {
    id: "8",
    status: "current",
    route: "Hồ Chí Minh → Vũng Tàu",
    time: "07:15",
    date: "25/12/2024",
    ticketNumber: "64B-234.56",
    price: "85.000đ",
  },
  {
    id: "9",
    status: "current",
    route: "Đà Nẵng → Hội An",
    time: "10:45",
    date: "28/12/2024",
    ticketNumber: "43D-567.89",
    price: "45.000đ",
  },
  {
    id: "10",
    status: "current",
    route: "Hà Nội → Sapa",
    time: "22:30",
    date: "30/12/2024",
    ticketNumber: "20E-890.12",
    price: "280.000đ",
  },
  // Completed tickets
  {
    id: "3",
    status: "completed",
    route: "Hồ Chí Minh → Cần Thơ",
    time: "09:15",
    date: "10/12/2024",
    ticketNumber: "92B-456.78",
    price: "150.000đ",
  },
  {
    id: "4",
    status: "completed",
    route: "Đà Nẵng → Huế",
    time: "16:45",
    date: "05/12/2024",
    ticketNumber: "43C-789.12",
    price: "90.000đ",
  },
  {
    id: "11",
    status: "completed",
    route: "Hà Nội → Ninh Bình",
    time: "06:30",
    date: "28/11/2024",
    ticketNumber: "18F-345.67",
    price: "95.000đ",
  },
  {
    id: "12",
    status: "completed",
    route: "Hồ Chí Minh → Phan Thiết",
    time: "13:20",
    date: "22/11/2024",
    ticketNumber: "77G-678.90",
    price: "110.000đ",
  },
  {
    id: "13",
    status: "completed",
    route: "Hà Nội → Hạ Long",
    time: "08:45",
    date: "15/11/2024",
    ticketNumber: "25H-901.23",
    price: "130.000đ",
  },
  {
    id: "14",
    status: "completed",
    route: "Đà Nẵng → Quy Nhon",
    time: "11:30",
    date: "08/11/2024",
    ticketNumber: "56I-234.56",
    price: "160.000đ",
  },
  // Cancelled tickets
  {
    id: "5",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "15/08/2025",
    ticketNumber: "50H-365.72",
    price: "210.000đ",
  },
  {
    id: "6",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "16/08/2025",
    ticketNumber: "50H-151.59",
    price: "210.000đ",
  },
  {
    id: "7",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "17/08/2025",
    ticketNumber: "67B-017.05",
    price: "210.000đ",
  },
  {
    id: "8",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "15/08/2025",
    ticketNumber: "50H-365.72",
    price: "210.000đ",
  },
  {
    id: "9",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "16/08/2025",
    ticketNumber: "50H-151.59",
    price: "210.000đ",
  },
  {
    id: "10",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "17/08/2025",
    ticketNumber: "67B-017.05",
    price: "210.000đ",
  },
  {
    id: "11",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "15/08/2025",
    ticketNumber: "50H-365.72",
    price: "210.000đ",
  },
  {
    id: "12",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "16/08/2025",
    ticketNumber: "50H-151.59",
    price: "210.000đ",
  },
  {
    id: "13",
    status: "cancelled",
    route: "Hồ Chí Minh → An Giang",
    time: "21:00",
    date: "17/08/2025",
    ticketNumber: "67B-017.05",
    price: "210.000đ",
  },
];

const TicketScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "completed" | "cancelled"
  >("current");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredTickets = () => {
    return mockTickets.filter((ticket) => ticket.status === activeTab);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "current":
        return "Hiện tại";
      case "completed":
        return "Đã đi";
      case "cancelled":
        return "Đã hủy";
      default:
        return "";
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case "current":
        return "Xem chi tiết";
      case "completed":
        return "Đánh giá";
      case "cancelled":
        return "Đặt lại";
      default:
        return "";
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.busIconContainer}>
        <View style={styles.busIcon}>
          <Text style={styles.busIconText}>🚌</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>Bạn chưa có đơn hàng nào</Text>
      <Text style={styles.emptySubtitle}>
        Hãy thử kéo xuống để cập nhật danh sách đơn hàng trong 3 tháng gần nhất
      </Text>
    </View>
  );

  const renderTicketCard = (ticket: Ticket) => (
    <View key={ticket.id} style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
        <Text style={styles.priceText}>{ticket.price}</Text>
      </View>

      <View style={styles.ticketContent}>
        <View style={styles.routeContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{ticket.time}</Text>
            <Text style={styles.dateText}>{ticket.date}</Text>
          </View>

          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>{ticket.route}</Text>
            <View style={styles.companyRow}>
              <View>
                <Text style={styles.ticketLabel}>Biển số xe</Text>
                <Text style={styles.ticketText}>{ticket.ticketNumber}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.chevronText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>
          {getButtonText(ticket.status)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredTickets = getFilteredTickets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé của tôi</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refreshText}>↻ Làm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Hiện tại
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Đã đi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "cancelled" && styles.activeTab]}
          onPress={() => setActiveTab("cancelled")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "cancelled" && styles.activeTabText,
            ]}
          >
            Đã hủy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTickets.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.ticketList}>
            {activeTab === "cancelled" && (
              <Text style={styles.pullToRefreshText}>
                ↓ Kéo để cập nhật các vé trong 3 tháng gần nhất
              </Text>
            )}
            {filteredTickets.map(renderTicketCard)}
          </View>
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
    backgroundColor: "#4A90E2",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  refreshText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
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
    color: "#666666",
  },
  activeTabText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  busIconContainer: {
    marginBottom: 32,
  },
  busIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  busIconText: {
    fontSize: 40,
    color: "#FFFFFF",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  ticketList: {
    padding: 16,
  },
  pullToRefreshText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#666666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  ticketContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  dateText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  companyLabel: {
    fontSize: 12,
    color: "#666666",
  },
  companyText: {
    fontSize: 14,
    color: "#333333",
    marginTop: 2,
  },
  ticketLabel: {
    fontSize: 12,
    color: "#666666",
  },
  ticketText: {
    fontSize: 14,
    color: "#333333",
    marginTop: 2,
  },
  chevronText: {
    fontSize: 24,
    color: "#CCCCCC",
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: "#1E3A8A",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TicketScreen;
