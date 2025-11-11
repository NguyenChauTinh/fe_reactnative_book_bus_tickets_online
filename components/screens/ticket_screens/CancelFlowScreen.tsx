// screens/CancelFlowScreen.tsx

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, // 1. Giữ TextInput
  TouchableOpacity,
  View,
} from "react-native";
// Import icons
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
// Import navigation
import { useNavigation, useRoute } from "@react-navigation/native";

// Import API service
import { api_booking_service } from "../../../apis/api_booking_service";
// Import các interface
interface VeXe {
  _id: string;
  maVe: string;
  trangThaiThanhToan: string;
  phuongThucThanhToan: string;
  chiTiet: ChiTietVe[];
  tongTien: number;
}
interface ChiTietVe {
  _id: string;
  maChoNgoi: string;
  tenKhachHang: string;
  giaVeCoBan: number;
  trangThaiChiTiet: string;
}

// 2. BỎ DANH SÁCH GỢI Ý
// const CANCEL_REASONS = [ ... ];

const CancelFlowScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { veXeId } = route.params;

  // State chung
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [veXe, setVeXe] = useState<VeXe | null>(null);

  // 3. THAY ĐỔI STATE LÝ DO
  const [cancelReason, setCancelReason] = useState(""); // Bắt đầu bằng rỗng
  // 4. BỎ STATE GỢI Ý
  // const [showReasonSuggestions, setShowReasonSuggestions] = useState(false);

  // State cho Modals
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Tải thông tin vé xe
  const fetchVeXe = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api_booking_service.getVeXeById(veXeId);
      if (!response.success || !response.data) {
        throw new Error("Không tải được thông tin vé.");
      }
      setVeXe(response.data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải vé.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [veXeId, navigation]);

  useEffect(() => {
    fetchVeXe();
  }, [fetchVeXe]);

  // Xử lý nhấn "Hủy đơn hàng" -> Gọi API
  const handleConfirmCancel = async () => {
    setIsConfirmModalVisible(false);
    setIsSubmitting(true);

    try {
      const allChiTietIds =
        veXe?.chiTiet
          .filter((ct) => ct.trangThaiChiTiet !== "DA_HUY")
          .map((ct) => ct._id) || [];

      if (allChiTietIds.length === 0) {
        throw new Error("Không có vé nào để hủy.");
      }

      await api_booking_service.cancelMultipleTicketDetails(
        veXeId,
        allChiTietIds, // Gửi tất cả ID
        cancelReason // Gửi lý do đã nhập
      );

      setIsSuccessModalVisible(true);
    } catch (error: any) {
      Alert.alert("Hủy thất bại", error.message || "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý "Đóng" modal thành công
  const handleCloseSuccess = () => {
    setIsSuccessModalVisible(false);
    navigation.popToTop();
  };

  // ===========================================
  // RENDER CÁC THÀNH PHẦN
  // ===========================================

  const renderLoading = () => (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  // === Render chính (Chỉ còn 1 bước) ===
  const renderMainContent = () => {
    const activeChiTiet =
      veXe?.chiTiet.filter((ct) => ct.trangThaiChiTiet !== "DA_HUY") || [];

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.confirmScroll}
          keyboardShouldPersistTaps="handled" // Để xử lý click khi bàn phím mở
        >
          {/* A. Phần hiển thị các vé bị hủy */}
          <Text style={styles.reasonLabel}>Vé sẽ bị hủy</Text>
          <View style={styles.ticketListContainer}>
            {activeChiTiet.length > 0 ? (
              activeChiTiet.map((chiTiet) => (
                <View key={chiTiet._id} style={styles.ticketRow}>
                  <MaterialCommunityIcons
                    name="checkbox-marked" // Luôn luôn được chọn
                    size={24}
                    color={"#007AFF"} // Màu xanh
                  />
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketSeat}>
                      Ghế {chiTiet.maChoNgoi}
                    </Text>
                    <Text style={styles.ticketPassenger}>
                      {chiTiet.tenKhachHang}
                    </Text>
                  </View>
                  <View style={styles.ticketPrice}>
                    <Text style={styles.priceLabel}>Phí hủy</Text>
                    <Text style={styles.priceAmount}>0đ</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Không có vé nào để hủy.</Text>
            )}
          </View>

          {/* B. Phần nhập lý do */}
          <Text style={styles.reasonLabel}>Lí do hủy (bắt buộc)</Text>

          {/* 5. SỬA LẠI TEXTINPUT */}
          <TextInput
            style={styles.reasonInput}
            placeholder="Nhập lý do hủy của bạn..."
            placeholderTextColor="#999"
            value={cancelReason}
            onChangeText={setCancelReason}
            // onFocus={() => setShowReasonSuggestions(true)} // Bỏ onFocus
            multiline={true}
            autoFocus={false} // Không tự động focus
          />

          {/* 6. BỎ PHẦN GỢI Ý */}
          {/* {showReasonSuggestions && ( ... )} */}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              (isSubmitting || cancelReason.trim().length === 0) && // Giữ check lý do
                styles.footerButtonDisabled,
            ]}
            onPress={() => {
              if (cancelReason.trim().length === 0) {
                Alert.alert("Thiếu thông tin", "Vui lòng nhập lý do hủy vé.");
                return;
              }
              setIsConfirmModalVisible(true);
            }}
            disabled={isSubmitting || cancelReason.trim().length === 0} // Giữ check lý do
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.footerButtonText}>Hủy đơn hàng</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // === Render chính ===
  if (loading) {
    return renderLoading();
  }

  return (
    <View style={styles.container}>
      {/* Header (Tùy chỉnh theo bước) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận hủy</Text>
      </View>

      {/* Body (Tùy chỉnh theo bước) */}
      {renderMainContent()}

      {/* === Modal Xác Nhận === */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>?</Text>
            </View>
            <Text style={styles.modalTitle}>Xác nhận hủy</Text>
            <Text style={styles.modalSubtitle}>
              Chúng tôi sẽ không giữ chỗ bạn đã chọn nữa.
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setIsConfirmModalVisible(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleConfirmCancel}
              >
                <Text style={styles.modalButtonPrimaryText}>Hủy đơn hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* === Modal Thành Công === */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View
              style={[styles.modalIconCircle, { backgroundColor: "#27AE6030" }]}
            >
              <Feather name="check" size={40} color="#27AE60" />
            </View>
            <Text style={styles.modalTitle}>Hủy đơn hàng thành công</Text>
            <Text style={styles.modalSubtitle}>
              Bạn có thể đặt lại đơn hàng khác bất kỳ lúc nào.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonFull]}
              onPress={handleCloseSuccess}
            >
              <Text style={styles.modalButtonPrimaryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ===========================================
// STYLESHEET
// ===========================================
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  // Styles cho Bước 1: Chọn vé
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  ticketListContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
    marginBottom: 24, // Tăng khoảng cách
  },
  ticketInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ticketSeat: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  ticketPassenger: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  ticketPrice: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 13,
    color: "#666",
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E74C3C", // Màu đỏ
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  // Styles cho Bước 2: Xác nhận
  confirmScroll: {
    padding: 16,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  // THÊM STYLE CHO TEXTINPUT LÝ DO
  reasonInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },

  // 7. BỎ STYLES GỢI Ý
  // suggestionsContainer: { ... },
  // suggestionItem: { ... },
  // suggestionText: { ... },

  noteText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  // Styles cho Footer (BỎ footerRow)
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerButton: {
    backgroundColor: "#1E3A8A", // Màu xanh đậm
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonDisabled: {
    backgroundColor: "#AAA",
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Styles cho Modal (Giữ nguyên)
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "85%",
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF30", // Xanh nhạt
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF", // Xanh đậm
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonRow: {
    flexDirection: "row",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonSecondary: {
    backgroundColor: "#F0F2F5",
    marginRight: 8,
  },
  modalButtonSecondaryText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonPrimary: {
    backgroundColor: "#E74C3C", // Màu đỏ hủy
    marginLeft: 8,
  },
  modalButtonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonFull: {
    width: "100%",
    backgroundColor: "#1E3A8A", // Xanh đậm
  },
});

export default CancelFlowScreen;
