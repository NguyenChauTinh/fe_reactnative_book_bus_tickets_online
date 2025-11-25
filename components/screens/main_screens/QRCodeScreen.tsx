import * as MediaLibrary from 'expo-media-library'; // <--- THƯ VIỆN EXPO CHUẨN
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import { api_booking_service } from '../../../apis/api_booking_service';

// --- ICONS ---
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SaveIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <Path d="M17 21v-8H7v8" />
    <Path d="M7 3v5h8" />
  </Svg>
);

const QRCodeScreen = ({ navigation, route }) => {
  const { 
    paymentUrl, 
    maHoaDon, 
    finalPrice,
    ...bookingSuccessParams 
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions(); // <--- Hook quyền của Expo
  const viewShotRef = useRef(null);

  // Hàm lưu ảnh QR dùng Expo MediaLibrary
  const handleSaveQrCode = async () => {
    try {
      setLoading(true);

      // 1. Kiểm tra quyền truy cập thư viện ảnh
      if (!permissionResponse?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền lưu ảnh để tải mã QR về máy.");
          setLoading(false);
          return;
        }
      }

      // 2. Chụp ảnh View (ViewShot vẫn hoạt động tốt trên Expo)
      const uri = await viewShotRef.current.capture();
      
      // 3. Lưu vào thư viện ảnh (Gallery)
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // (Tùy chọn) Tạo album riêng tên là "VeXeApp" để user dễ tìm
      await MediaLibrary.createAlbumAsync('VeXeApp', asset, false);

      Alert.alert("Thành công", "Mã QR đã được lưu vào thư viện ảnh.");

    } catch (error) {
      console.error("Lưu ảnh lỗi:", error);
      Alert.alert("Lỗi", "Không thể lưu mã QR. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response = await api_booking_service.checkBillStatus(maHoaDon);

      if (response.success) {
        const { trangThai, data } = response; 

        if (trangThai === 'THANH_CONG') {
          Alert.alert("Thành công", "Thanh toán đã được xác nhận!");
          
          navigation.replace("BookingSuccessScreen", {
             ...bookingSuccessParams,
             ticketInfo: data,     
             finalPrice: finalPrice
          });

        } else if (trangThai === 'CHO_THANH_TOAN') {
          Alert.alert("Thông báo", "Giao dịch vẫn đang chờ thanh toán. Vui lòng thử lại sau ít phút.");
        } else {
          Alert.alert("Thất bại", "Giao dịch đã bị hủy hoặc lỗi.");
          navigation.goBack();
        }
      } else {
        Alert.alert("Lỗi", response.message || "Không thể kiểm tra trạng thái.");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái:", error);
      Alert.alert("Lỗi hệ thống", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán qua QR</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Vui lòng sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR bên dưới.
        </Text>
        
        <Text style={styles.amountText}>
          Tổng tiền: <Text style={styles.amountValue}>{finalPrice.toLocaleString()}đ</Text>
        </Text>
        
        {/* ViewShot bao bọc QR Code */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
                {/* Lưu ý: Nếu value quá dài, hãy giảm size hoặc tăng level 'L'/'M' */}
                <QRCode value={paymentUrl} size={250} />
            </View>
            <Text style={styles.orderIdText}>Mã đơn hàng: {maHoaDon}</Text>
        </ViewShot>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveQrCode} disabled={loading}>
          <SaveIcon />
          <Text style={styles.saveButtonText}>Lưu mã QR</Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          Sau khi thanh toán thành công, vui lòng nhấn nút "Xác nhận thanh toán" bên dưới.
        </Text>

        <TouchableOpacity style={styles.checkButton} onPress={handleCheckStatus} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkButtonText}>Xác nhận thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 30, // Thêm margin top nếu dùng iPhone tai thỏ mà chưa có SafeAreaView
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginLeft: 16 },
  content: { flex: 1, alignItems: 'center', padding: 24 },
  instructionText: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  amountText: { fontSize: 18, color: '#333', marginBottom: 20 },
  amountValue: { fontWeight: 'bold', color: '#E74C3C', fontSize: 22 },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  orderIdText: { marginTop: 12, fontSize: 14, color: '#777' },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  noteText: { fontSize: 14, color: '#777', textAlign: 'center', marginBottom: 20 },
  checkButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  checkButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default QRCodeScreen;