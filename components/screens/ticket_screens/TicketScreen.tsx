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
// 1. Import thêm useNavigation
import { api_trip_schedule_service } from "@/apis/api_trip_schedule_service";
import { useNavigation } from "@react-navigation/native";
import { api_booking_service } from "../../../apis/api_booking_service";

// 2. Cập nhật Interface
interface MasterTicket {
  id: string;
  maVe: string;
  status: "current" | "completed" | "cancelled";
  paymentStatusText: string;
  route: string;
  time: string;
  date: string;
  providerName: string;
  totalPrice: string;
  seatList: string;
  chuyenXeId: string;
  xe: string;
  chiTietIds: string[];
  // ✅ THÊM 1: Thêm ngày khởi hành đầy đủ để tính toán logic 24h
  fullDepartureDate: Date | null;
}

// 3. Giữ nguyên các hàm helper
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

const getFrontendStatusFromChiTiet = (
  chiTietList: any[],
  tripDateStr: string | Date | undefined
): "current" | "completed" | "cancelled" => {
  if (!chiTietList || chiTietList.length === 0) {
    return "cancelled";
  }

  const activeChiTiet = chiTietList.filter(
    (ct) =>
      ct.trangThaiChiTiet !== "DA_HUY" && ct.trangThaiChiTiet !== "DA_HOAN_TIEN"
  );

  if (activeChiTiet.length === 0) {
    return "cancelled";
  }

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

const mapApiBookingStatusToPaymentText = (apiStatus: string): string => {
  switch (apiStatus) {
    case "CHUA_THANH_TOAN":
      return "Chưa thanh toán";
    case "DA_THANH_TOAN":
      return "Đã thanh toán";
    case "DA_HUY":
      return "Đã hủy";
    default:
      return "Đã thanh toán";
  }
};

const TicketScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "completed" | "cancelled"
  >("current");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allMasterTickets, setAllMasterTickets] = useState<MasterTicket[]>([]);

  const navigation = useNavigation<any>();

  const fetchTickets = useCallback(async () => {
    const userId = "60c72b2f5f1b2c001f6e8d9e";
    if (!userId) return;

    setLoading(true);
    try {
      console.log("[TicketScreen] Bước 1: Đang gọi getTicketsByUserId...");
      const bookingResponse = await api_booking_service.getTicketsByUserId(
        userId
      );

      if (!bookingResponse.success || !Array.isArray(bookingResponse.data)) {
        console.error("[TicketScreen] Lỗi API Vé Xe:", bookingResponse);
        throw new Error("Không tìm thấy vé");
      }

      const allVeXe = bookingResponse.data;
      const allChiTiet = allVeXe.flatMap((ve) => ve.chiTiet || []);

      if (allChiTiet.length === 0) {
        setAllMasterTickets([]);
        setLoading(false);
        return;
      }

      // BƯỚC 2: Lấy thông tin Chuyến Xe
      const chuyenXeIds = [...new Set(allChiTiet.map((item) => item.chuyenXe))];
      const tripResponse =
        await api_trip_schedule_service.getMultipleChuyenXeByIds(chuyenXeIds);

      if (!tripResponse.success || !Array.isArray(tripResponse.data)) {
        console.error("[TicketScreen] Lỗi API Chuyến Xe:", tripResponse);
        throw new Error("Không tìm thấy chi tiết chuyến");
      }

      const tripDetailsMap = new Map(
        tripResponse.data.map((chuyen) => [chuyen._id, chuyen])
      );

      // BƯỚC 3: Xử lý (Map) dữ liệu
      const ticketPromises = allVeXe
        .filter((veXe) => veXe.chiTiet && veXe.chiTiet.length > 0)
        .map(async (veXe) => {
          const firstChiTiet = veXe.chiTiet[0];
          const chuyenXe = tripDetailsMap.get(firstChiTiet.chuyenXe);

          // ✅ THÊM 2: Tính toán ngày giờ khởi hành đầy đủ
          let fullDepartureDate: Date | null = null;
          if (
            chuyenXe &&
            chuyenXe.ngayKhoiHanh &&
            typeof chuyenXe.gioKhoiHanh === "number"
          ) {
            try {
              // Bắt đầu với ngày (vd: "2025-11-20T00:00:00Z")
              const departureDate = new Date(chuyenXe.ngayKhoiHanh);
              // Đặt về 00:00:00 giờ local
              departureDate.setHours(0, 0, 0, 0);
              // Thêm số phút của giờ khởi hành (vd: 720 phút = 12:00)
              departureDate.setMinutes(chuyenXe.gioKhoiHanh);
              fullDepartureDate = departureDate;
            } catch (e) {
              console.error("Lỗi parse ngày:", chuyenXe.ngayKhoiHanh);
            }
          }

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

          const frontendStatus = getFrontendStatusFromChiTiet(
            veXe.chiTiet,
            chuyenXe?.ngayKhoiHanh
          );

          const paymentStatusText = mapApiBookingStatusToPaymentText(
            veXe.trangThaiThanhToan
          );

          const chiTietIds = veXe.chiTiet.map((ct: any) => ct._id);
          const routeResponse =
            await api_trip_schedule_service.getTuyenDuongData(
              chuyenXe?.tuyenDuong
            );

          return {
            id: veXe._id,
            maVe: veXe.maVe,
            status: frontendStatus,
            paymentStatusText: paymentStatusText,
            route: routeResponse?.data?.tenTuyen || "Không rõ tuyến",
            time: chuyenXe ? formatMinutesToHHMM(chuyenXe.gioKhoiHanh) : "N/A",
            date: chuyenXe ? formatDateString(chuyenXe.ngayKhoiHanh) : "N/A",
            providerName: chuyenXe?.xe?.bienSo || "Không rõ biển số",
            totalPrice: `${totalPrice.toLocaleString("vi-VN")}đ`,
            seatList: seatList,
            chuyenXeId: chuyenXe?._id || "",
            chiTietIds: chiTietIds,
            fullDepartureDate: fullDepartureDate, // ✅ THÊM 3: Gán vào đối tượng
          };
        });

      const formattedMasterTickets = await Promise.all(ticketPromises);
      setAllMasterTickets(formattedMasterTickets);
    } catch (error) {
      console.error("[TicketScreen] Lỗi khi tải vé:", error);
      setAllMasterTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTickets();
      setLoading(false);
    };
    loadData();
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [fetchTickets, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, [fetchTickets]);

  const getFilteredMasterTickets = () => {
    return allMasterTickets.filter((ticket) => ticket.status === activeTab);
  };

  const getStatusText = (status: string) => {
    /* ... (giữ nguyên) ... */
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
    /* ... (giữ nguyên) ... */
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

  const renderMasterTicketCard = (ticket: MasterTicket) => {
    const handleViewDetails = () => {
      navigation.navigate("TicketDetailScreen", {
        veXeId: ticket.id,
        chuyenXeId: ticket.chuyenXeId,
      });
    };

    const handleCancel = () => {
      navigation.navigate("CancelFlowScreen", {
        veXeId: ticket.id,
      });
    };

    // ✅ THÊM 4: LOGIC QUYẾT ĐỊNH VIỆC HỦY VÉ
    let isCancellable = false;

    // 1. Kiểm tra trạng thái thanh toán
    const isUnpaid = ticket.paymentStatusText === "Chưa thanh toán";

    // 2. Kiểm tra thời gian (trước 24h)
    let isWithinTimeLimit = false;
    if (ticket.fullDepartureDate) {
      const now = new Date();
      // Tính thời điểm 24h trước giờ khởi hành
      const cutoffTime = new Date(ticket.fullDepartureDate.getTime());
      cutoffTime.setHours(cutoffTime.getHours() - 24);

      // Nếu "bây giờ" < "thời điểm 24h trước" -> cho phép
      if (now < cutoffTime) {
        isWithinTimeLimit = true;
      }
    }

    // 3. Quyết định cuối cùng: Phải là vé CHƯA THANH TOÁN và TRONG THỜI GIAN
    if (isUnpaid && isWithinTimeLimit) {
      isCancellable = true;
    }
    // (Vé đã thanh toán sẽ không bao giờ thỏa mãn isUnpaid)
    // (Vé quá 24h sẽ không bao giờ thỏa mãn isWithinTimeLimit)

    return (
      <View key={ticket.id} style={styles.masterCardContainer}>
        {/* Header */}
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

        {/* Body */}
        <View style={styles.masterCardBody}>
          <View style={styles.masterCardTimeInfo}>
            <View style={styles.masterCardBusIcon}>
              <Text>🚌</Text>
            </View>
            <Text style={styles.masterCardTime}>{ticket.time}</Text>
            <Text style={styles.masterCardDate}>{ticket.date}</Text>
          </View>

          <View style={styles.masterCardRouteInfo}>
            <Text style={styles.masterCardRoute} numberOfLines={1}>
              {ticket.route}
            </Text>
            <Text style={styles.masterCardProvider}>{ticket.providerName}</Text>
            <Text style={styles.masterCardMeta}>
              Mã vé:{" "}
              <Text style={styles.masterCardMetaBold}>{ticket.maVe}</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={handleViewDetails}>
            <Text style={styles.masterCardChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.masterCardActions}>
          {/* ✅ THÊM 5: CẬP NHẬT NÚT HỦY */}
          {/* Chỉ hiển thị nút Hủy khi ở tab "Hiện tại" */}
          {ticket.status === "current" && (
            <TouchableOpacity
              style={[
                styles.masterButton,
                styles.masterCancelButton,
                // Thêm style disabled nếu không được phép hủy
                !isCancellable && styles.disabledCancelButton,
              ]}
              onPress={handleCancel}
              // Vô hiệu hóa nút nếu không được phép hủy
              disabled={!isCancellable}
            >
              <Text
                style={[
                  styles.masterCancelButtonText,
                  // Thêm style text disabled
                  !isCancellable && styles.disabledCancelButtonText,
                ]}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          )}

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
  masterCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
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
    color: "#27AE60",
  },
  masterCardStatusPending: {
    color: "#E74C3C",
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
    justifyContent: "space-between",
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  masterCancelButtonText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 14,
  },
  masterDetailButton: {
    backgroundColor: "#1E3A8A",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  masterDetailButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  // ✅ THÊM 6: STYLES CHO NÚT HỦY KHI BỊ VÔ HIỆU HÓA
  disabledCancelButton: {
    backgroundColor: "#EEEEEE", // Màu nền mờ hơn
    borderColor: "#E0E0E0",
  },
  disabledCancelButtonText: {
    color: "#BDBDBD", // Màu chữ mờ hơn
  },
});

export default TicketScreen;
