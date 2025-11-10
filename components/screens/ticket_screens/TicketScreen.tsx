"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// ✅ 1. Import API service
import { api_trip_schedule_service } from "@/apis/api_trip_schedule_service";
import { api_booking_service } from "../../../apis/api_booking_service";

// ✅ 2. Cập nhật Interface
interface Ticket {
  id: string; // chiTiet._id
  status: "current" | "completed" | "cancelled";
  route: string; // chuyenXe.tuyenDuong
  time: string; // chuyenXe.gioKhoiHanh
  date: string; // chuyenXe.ngayKhoiHanh
  plateNumber: string; // chuyenXe.xe.bienSo
  price: string; // chiTiet.giaVeCoBan...
  maVe: string; // veXe.maVe
  maGhe: string; // chiTiet.maChoNgoi
}

// ⛔ 3. Bỏ mockTickets.
// const mockTickets: Ticket[] = [ ... ];

// ✅ 4. Thêm các hàm helper định dạng
/**
 * Chuyển đổi số phút (ví dụ 480) thành chuỗi "HH:mm" (ví dụ "08:00")
 */
const formatMinutesToHHMM = (totalMinutes: number): string => {
  if (isNaN(totalMinutes)) return "N/A";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

/**
 * Chuyển đổi chuỗi Date (ví dụ "2025-11-10T...") thành "DD/MM/YYYY"
 */
const formatDateString = (dateStr: string | Date): string => {
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "N/A";
  }
};

/**
 * Chuyển đổi trạng thái từ API (backend) sang trạng thái của Tab (frontend)
 */
const mapApiStatusToFrontend = (
  apiStatus: string,
  tripDateStr: string | Date
): "current" | "completed" | "cancelled" => {
  // 1. Ưu tiên hàng đầu: Vé đã hủy
  if (apiStatus === "DA_HUY") {
    return "cancelled";
  }

  // 2. Phân loại "Đã đi" hay "Hiện tại"
  if (!tripDateStr) {
    // Nếu không có ngày (lỗi populate), tạm cho là "current"
    return "current";
  }

  try {
    const tripDate = new Date(tripDateStr);
    const now = new Date();

    // Reset giờ về 0 để so sánh ngày chính xác
    tripDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (tripDate < now) {
      // Nếu ngày đi nhỏ hơn hôm nay -> Đã đi
      return "completed";
    } else {
      // Ngược lại là vé "Hiện tại"
      return "current";
    }
  } catch (error) {
    return "current"; // Lỗi parse ngày thì tạm cho là "current"
  }
};

const TicketScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "completed" | "cancelled"
  >("current");
  const [refreshing, setRefreshing] = useState(false);

  // ✅ 5. Thêm state cho loading và data thật
  const [loading, setLoading] = useState(true);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  const fetchTickets = useCallback(async () => {
    const userId = "userId"; // <-- ⚠️ THAY THẾ BẰNG USER ID THẬT
    if (!userId) return;

    setLoading(true);
    try {
      // ✅ DEBUG Bước 1
      console.log("[TicketScreen] Bước 1: Đang gọi getTicketsByUserId...");
      const bookingResponse = await api_booking_service.getTicketsByUserId(
        userId
      );
      console.log("[TicketScreen] Bước 1: Hoàn thành getTicketsByUserId.");

      // (Kiểm tra API 1)
      if (!bookingResponse.success || !Array.isArray(bookingResponse.data)) {
        console.error("[TicketScreen] Lỗi API Vé Xe:", bookingResponse);
        throw new Error("Không tìm thấy vé");
      }

      const allVeXe = bookingResponse.data;
      const allChiTiet = allVeXe.flatMap((ve) => ve.chiTiet);

      if (allChiTiet.length === 0) {
        setAllTickets([]);
        setLoading(false);
        return;
      }

      const chuyenXeIds = [...new Set(allChiTiet.map((item) => item.chuyenXe))];

      // ✅ DEBUG Bước 2
      console.log(
        `[TicketScreen] Bước 2: Đang gọi getMultipleChuyenXeByIds với ${chuyenXeIds.length} ID...`
      );
      // (Bạn đã dùng tên api_trip_schedule_service trong file code bạn gửi)
      const tripResponse =
        await api_trip_schedule_service.getMultipleChuyenXeByIds(chuyenXeIds);
      console.log(
        "[TicketScreen] Bước 2: Hoàn thành getMultipleChuyenXeByIds."
      );

      // (Log Phản hồi API Chuyến Xe mà bạn đã có)
      console.log(
        "[TicketScreen] Phản hồi từ API Chuyến Xe:",
        JSON.stringify(tripResponse, null, 2)
      );

      // (Kiểm tra API 2)
      if (!tripResponse.success || !Array.isArray(tripResponse.data)) {
        console.error(
          "[TicketScreen] Lỗi API Chuyến Xe (data không phải là mảng):",
          tripResponse
        );
        throw new Error("Không tìm thấy chi tiết chuyến");
      }

      // (Tạo Map)
      const tripDetailsMap = new Map(
        tripResponse.data.map((chuyen) => [chuyen._id, chuyen])
      );

      // (Join dữ liệu)
      const formattedTickets: Ticket[] = allVeXe.flatMap((veXe) =>
        veXe.chiTiet.map((item) => {
          const chuyenXe = tripDetailsMap.get(item.chuyenXe);
          const finalPrice =
            (item.giaVeCoBan || 0) + (item.phuThu || 0) - (item.giamGia || 0);

          return {
            id: item._id,
            maVe: veXe.maVe,
            status: mapApiStatusToFrontend(
              item.trangThaiChiTiet,
              chuyenXe?.ngayKhoiHanh
            ),
            route: chuyenXe?.tuyenDuong || "Không rõ tuyến",
            time: chuyenXe ? formatMinutesToHHMM(chuyenXe.gioKhoiHanh) : "N/A",
            date: chuyenXe ? formatDateString(chuyenXe.ngayKhoiHanh) : "N/A",
            plateNumber: chuyenXe?.xe?.bienSo || "Chưa xếp xe",
            maGhe: item.maChoNgoi,
            price: `${finalPrice.toLocaleString("vi-VN")}đ`,
          };
        })
      );

      setAllTickets(formattedTickets);
    } catch (error) {
      console.error("[TicketScreen] Lỗi khi tải vé:", error); //
      setAllTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 7. Gọi API khi component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTickets();
      setLoading(false);
    };
    loadData();
  }, [fetchTickets]); // Chỉ gọi 1 lần khi mount

  // ✅ 8. Cập nhật hàm refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, [fetchTickets]);

  // ✅ 9. Cập nhật hàm filter
  const getFilteredTickets = () => {
    return allTickets.filter((ticket) => ticket.status === activeTab);
  };

  // ... (giữ nguyên getStatusText, getButtonText, renderEmptyState) ...
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
        Hãy thử kéo xuống để cập nhật danh sách đơn hàng
      </Text>
    </View>
  );

  // ✅ 10. Cập nhật renderTicketCard
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
              {/* Cột 1: Mã ghế */}
              <View>
                <Text style={styles.ticketLabel}>Mã ghế</Text>
                <Text style={styles.ticketText}>{ticket.maGhe}</Text>
              </View>
              {/* Cột 2: Biển số xe */}
              <View>
                <Text style={styles.ticketLabel}>Biển số xe</Text>
                <Text style={styles.ticketText}>{ticket.plateNumber}</Text>
              </View>
              {/* Cột 3: Mã vé */}
              <View>
                <Text style={styles.ticketLabel}>Mã vé</Text>
                <Text style={styles.ticketText}>{ticket.maVe}</Text>
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

  // ✅ 11. Cập nhật return, thêm xử lý loading
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé của tôi</Text>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          <Text style={styles.refreshText}>
            {refreshing ? "Đang tải..." : "↻ Làm mới"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation (Giữ nguyên) */}
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
      {loading ? (
        // Hiển thị loading khi API đang chạy
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={styles.loading}
        />
      ) : (
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
      )}
    </View>
  );
};

// ... (Styles giữ nguyên)
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
  // ✅ Thêm style cho loading
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    // ✅ Thêm để các cột không dính vào nhau
    paddingRight: 8, // Thêm 1 chút padding
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
