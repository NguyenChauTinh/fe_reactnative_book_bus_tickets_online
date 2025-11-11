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
// ✅ 1. Import thêm useNavigation
import { api_trip_schedule_service } from "@/apis/api_trip_schedule_service";
import { useNavigation } from "@react-navigation/native";
import { api_booking_service } from "../../../apis/api_booking_service";

// ✅ 2. Cập nhật Interface (từ Chi Tiết sang Vé Xe)
interface MasterTicket {
  id: string; // veXe._id
  maVe: string; // veXe.maVe
  status: "current" | "completed" | "cancelled"; // Trạng thái cho Tab
  paymentStatusText: string; // Trạng thái để hiển thị (vd: "Chưa thanh toán")
  route: string; // chuyenXe.tuyenDuong
  time: string; // chuyenXe.gioKhoiHanh
  date: string; // chuyenXe.ngayKhoiHanh
  providerName: string; // ⚠️ Giả định: chuyenXe.nhaXe.tenNhaXe
  totalPrice: string; // TỔNG tiền của tất cả chiTiet
  seatList: string; // Danh sách ghế (vd: "A1, A2")
  chuyenXeId: string; // Dùng để truyền sang màn hình chi tiết
}

// ⛔ 3. Bỏ mockTickets.

// ✅ 4. Giữ nguyên các hàm helper (formatMinutesToHHMM, formatDateString)
const formatMinutesToHHMM = (totalMinutes: number): string => {
  if (isNaN(totalMinutes)) return "N/A";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

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
 * (Giữ nguyên hàm này, nó vẫn dùng được cho veXe.trangThai)
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
    return "current";
  }

  try {
    const tripDate = new Date(tripDateStr);
    const now = new Date();
    tripDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (tripDate < now) {
      return "completed";
    } else {
      return "current";
    }
  } catch (error) {
    return "current";
  }
};

// ✅ 5. Thêm hàm helper mới để map trạng thái thanh toán
/**
 * Chuyển đổi trạng thái API (vd: "CHUA_THANH_TOAN") thành text hiển thị
 */
const mapApiBookingStatusToPaymentText = (apiStatus: string): string => {
  // ⚠️ Đây là giả định, bạn cần thay bằng trạng thái thật từ API của bạn
  switch (apiStatus) {
    case "CHUA_THANH_TOAN":
      return "Chưa thanh toán";
    case "DA_THANH_TOAN":
      return "Đã thanh toán";
    case "DA_HUY":
      return "Đã hủy";
    default:
      // Nếu là trạng thái khác (vd: "DA_DI"), có thể coi là "Đã thanh toán"
      // hoặc bạn có thể thêm logic riêng
      return "Đã thanh toán";
  }
};

const TicketScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "completed" | "cancelled"
  >("current");
  const [refreshing, setRefreshing] = useState(false);
  // ✅ 6. Cập nhật tên state cho rõ nghĩa
  const [loading, setLoading] = useState(true);
  const [allMasterTickets, setAllMasterTickets] = useState<MasterTicket[]>([]);

  // ✅ 7. Khởi tạo navigation
  const navigation = useNavigation<any>();

  const fetchTickets = useCallback(async () => {
    const userId = "userId"; // <-- ⚠️ THAY THẾ BẰNG USER ID THẬT
    if (!userId) return;

    setLoading(true);
    try {
      // BƯỚC 1: Lấy danh sách Vé Xe (Đơn hàng)
      console.log("[TicketScreen] Bước 1: Đang gọi getTicketsByUserId...");
      const bookingResponse = await api_booking_service.getTicketsByUserId(
        userId
      );
      console.log("[TicketScreen] Bước 1: Hoàn thành getTicketsByUserId.");

      if (!bookingResponse.success || !Array.isArray(bookingResponse.data)) {
        console.error("[TicketScreen] Lỗi API Vé Xe:", bookingResponse);
        throw new Error("Không tìm thấy vé");
      }

      const allVeXe = bookingResponse.data; // Đây là mảng các [VeXe]
      const allChiTiet = allVeXe.flatMap((ve) => ve.chiTiet || []);

      if (allChiTiet.length === 0) {
        setAllMasterTickets([]);
        setLoading(false);
        return;
      }

      // BƯỚC 2: Lấy thông tin Chuyến Xe (Lấy 1 lần)
      const chuyenXeIds = [...new Set(allChiTiet.map((item) => item.chuyenXe))];

      console.log(
        `[TicketScreen] Bước 2: Đang gọi getMultipleChuyenXeByIds với ${chuyenXeIds.length} ID...`
      );
      const tripResponse =
        await api_trip_schedule_service.getMultipleChuyenXeByIds(chuyenXeIds);
      console.log(
        "[TicketScreen] Bước 2: Hoàn thành getMultipleChuyenXeByIds."
      );

      if (!tripResponse.success || !Array.isArray(tripResponse.data)) {
        console.error("[TicketScreen] Lỗi API Chuyến Xe:", tripResponse);
        throw new Error("Không tìm thấy chi tiết chuyến");
      }

      const tripDetailsMap = new Map(
        tripResponse.data.map((chuyen) => [chuyen._id, chuyen])
      );

      // BƯỚC 3: Xử lý (Map) dữ liệu

      // ✅ 1. Tạo ra mảng các Promises
      const ticketPromises = allVeXe
        .filter((veXe) => veXe.chiTiet && veXe.chiTiet.length > 0)
        .map(async (veXe) => {
          // <-- Vẫn giữ async ở đây
          const firstChiTiet = veXe.chiTiet[0];
          const chuyenXe = tripDetailsMap.get(firstChiTiet.chuyenXe);

          const totalPrice = veXe.chiTiet.reduce(
            (sum, item) =>
              sum +
              (item.giaVeCoBan || 0) +
              (item.phuThu || 0) -
              (item.giamGia || 0),
            0
          );

          const seatList = veXe.chiTiet
            .map((item) => item.maChoNgoi)
            .join(", ");

          // ⚠️ Chú ý: Đảm bảo 'veXe.trangThaiThanhToan' chứa các giá trị
          // mà hàm mapApiStatusToFrontend và mapApiBookingStatusToPaymentText
          // có thể xử lý (ví dụ: "DA_HUY", "CHUA_THANH_TOAN", v.v.)
          const frontendStatus = mapApiStatusToFrontend(
            veXe.trangThaiThanhToan, // <-- DÙNG TRẠNG THÁI CỦA VÉ XE
            chuyenXe?.ngayKhoiHanh
          );

          const paymentStatusText = mapApiBookingStatusToPaymentText(
            veXe.trangThaiThanhToan // <-- DÙNG TRẠNG THÁI CỦA VÉ XE
          );

          // Gọi API cho từng tuyến
          const routeResponse = await api_trip_schedule_service.getTuyenDuong(
            chuyenXe?.tuyenDuong
          );

          console.log("[TicketScreen] Route Response:", routeResponse);

          return {
            id: veXe._id,
            maVe: veXe.maVe,
            status: frontendStatus,
            paymentStatusText: paymentStatusText,
            route: routeResponse?.data?.tenTuyen || "Không rõ tuyến", // Giả định API trả về 'tenTuyen'
            time: chuyenXe ? formatMinutesToHHMM(chuyenXe.gioKhoiHanh) : "N/A",
            date: chuyenXe ? formatDateString(chuyenXe.ngayKhoiHanh) : "N/A",
            providerName: chuyenXe?.nhaXe?.tenNhaXe || "Không rõ nhà xe",
            totalPrice: `${totalPrice.toLocaleString("vi-VN")}đ`,
            seatList: seatList,
            chuyenXeId: chuyenXe?._id || "",
          };
        });

      // ✅ 2. Chờ tất cả promises trong mảng hoàn thành
      const formattedMasterTickets = await Promise.all(ticketPromises);

      // ✅ 3. Set state sau khi đã có dữ liệu thật
      setAllMasterTickets(formattedMasterTickets);
    } catch (error) {
      console.error("[TicketScreen] Lỗi khi tải vé:", error);
      setAllMasterTickets([]);
    } finally {
      setLoading(false);
    }
  }, []); // ⚠️ Nếu bạn dùng navigation, hãy thêm [navigation] vào đây

  // ✅ 9. Gọi API khi component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTickets();
      setLoading(false);
    };
    loadData();
    // Thêm listener để refresh khi quay lại màn hình
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [fetchTickets, navigation]);

  // ✅ 10. Cập nhật hàm refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, [fetchTickets]);

  // ✅ 11. Cập nhật hàm filter
  const getFilteredMasterTickets = () => {
    return allMasterTickets.filter((ticket) => ticket.status === activeTab);
  };

  // ... (giữ nguyên getStatusText, getButtonText, renderEmptyState) ...
  // (Hàm này giờ chỉ dùng cho renderEmptyState, có thể không cần nữa)
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
  // ⛔ Bỏ hàm getButtonText (không dùng nữa)

  // ✅ 12. Viết lại hoàn toàn hàm render card
  const renderMasterTicketCard = (ticket: MasterTicket) => {
    // Xử lý sự kiện khi nhấn nút
    const handleViewDetails = () => {
      // ⚠️ Đảm bảo bạn có màn hình tên là "TicketDetailScreen" trong Stack Navigator
      navigation.navigate("TicketDetailScreen", {
        veXeId: ticket.id,
        chuyenXeId: ticket.chuyenXeId,
      });
    };

    const handleCancel = () => {
      // ⚠️ Thêm logic hủy vé ở đây
      console.log("Hủy vé:", ticket.maVe);
      // (Có thể gọi API, sau đó refresh lại danh sách)
      // onRefresh();
    };

    return (
      <View key={ticket.id} style={styles.masterCardContainer}>
        {/* Phần Header: Trạng thái thanh toán & Giá */}
        <View style={styles.masterCardHeader}>
          <Text
            style={[
              styles.masterCardStatus,
              ticket.paymentStatusText === "Chưa thanh toán" &&
                styles.masterCardStatusPending,
            ]}
          >
            {ticket.paymentStatusText}
          </Text>
          <Text style={styles.masterCardPrice}>{ticket.totalPrice}</Text>
        </View>

        {/* Phần Thân: Thông tin chuyến */}
        <View style={styles.masterCardBody}>
          {/* Cột trái: Thời gian */}
          <View style={styles.masterCardTimeInfo}>
            <View style={styles.masterCardBusIcon}>
              <Text>🚌</Text>
            </View>
            <Text style={styles.masterCardTime}>{ticket.time}</Text>
            <Text style={styles.masterCardDate}>{ticket.date}</Text>
          </View>

          {/* Cột phải: Thông tin tuyến */}
          <View style={styles.masterCardRouteInfo}>
            <Text style={styles.masterCardRoute} numberOfLines={1}>
              {ticket.route}
            </Text>
            <Text style={styles.masterCardProvider}>{ticket.providerName}</Text>
            <Text style={styles.masterCardMeta}>
              Mã vé:{" "}
              <Text style={styles.masterCardMetaBold}>{ticket.maVe}</Text>
            </Text>
            {/* Hiển thị danh sách ghế nếu muốn */}
            {/* <Text style={styles.masterCardMeta}>
              Ghế: <Text style={styles.masterCardMetaBold}>{ticket.seatList}</Text>
            </Text> */}
          </View>

          {/* Icon chevron (nếu muốn) */}
          <TouchableOpacity onPress={handleViewDetails}>
            <Text style={styles.masterCardChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Phần Chân: Nút hành động */}
        <View style={styles.masterCardActions}>
          {/* Nút Hủy (Chỉ hiện khi là vé "current") */}
          {ticket.status === "current" && (
            <TouchableOpacity
              style={[styles.masterButton, styles.masterCancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.masterCancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          )}

          {/* Nút Xem Chi Tiết (Thay cho "Đặt chiều về") */}
          <TouchableOpacity
            style={[styles.masterButton, styles.masterDetailButton]}
            onPress={handleViewDetails}
          >
            <Text style={styles.masterDetailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredMasterTickets = getFilteredMasterTickets();

  // ✅ 13. Cập nhật return, thêm xử lý loading
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
          {filteredMasterTickets.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.ticketList}>
              {/* ✅ Cập nhật map sang hàm render mới */}
              {filteredMasterTickets.map(renderMasterTicketCard)}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

// ... (Styles cũ giữ nguyên)
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
  // ⛔ Bỏ style cũ (pullToRefreshText, ticketCard, ticketHeader, v.v...)

  // ✅ 14. Thêm STYLES MỚI cho Master Ticket Card (Dựa trên image_cbca03.png)
  masterCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden", // Đảm bảo bo góc
  },
  masterCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  masterCardStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60", // Màu xanh lá (mặc định là đã thanh toán)
  },
  masterCardStatusPending: {
    color: "#E74C3C", // Màu đỏ (chưa thanh toán)
  },
  masterCardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
  },
  masterCardBody: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  masterCardTimeInfo: {
    alignItems: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: "#F0F0F0",
  },
  masterCardBusIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  masterCardTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  masterCardDate: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  masterCardRouteInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  masterCardRoute: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  masterCardProvider: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 6,
  },
  masterCardMeta: {
    fontSize: 13,
    color: "#666666",
  },
  masterCardMetaBold: {
    fontWeight: "600",
    color: "#333333",
  },
  masterCardChevron: {
    fontSize: 24,
    color: "#CCCCCC",
    marginLeft: 8,
  },
  masterCardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  masterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  masterCancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  masterCancelButtonText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 14,
  },
  masterDetailButton: {
    backgroundColor: "#1E3A8A", // Màu xanh đậm
  },
  masterDetailButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default TicketScreen;
