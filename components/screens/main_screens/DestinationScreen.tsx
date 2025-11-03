import { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api_trip_schedule_service } from "../../../apis/api_trip_schedule_service";
import BackButton from "../../components/BackButton";
import SearchInput from "../../components/SearchInput";
import LocationIcon from "../../components/icons/LocationIcon";

export default function DestinationScreen({ navigation, route }) {
  // ✅ THAY ĐỔI: Nhận thêm 'departureId'
  const { onSelect, departureId } = route.params;
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // ✅ THAY ĐỔI: Gọi API mới với tham số
        const params = {
          findType: "tra", // Màn hình này tìm điểm TRẢ
          relatedId: departureId, // ID của điểm ĐI đã chọn (hoặc null)
        };

        // Giả sử bạn đã tạo hàm 'getDiaDiemKetNoi' trong service
        const response = await api_trip_schedule_service.getDiaDiemKetNoi(
          params
        );
        console.log(
          `Finding 'tra' locations related to departure ${departureId}:`,
          response
        );

        // ✅ Gán dữ liệu vào state
        if (Array.isArray(response)) {
          setLocations(response);
        } else if (response?.data) {
          // tuỳ theo response structure (Axios hoặc fetch)
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa điểm đến:", error);
      }
    };

    fetchLocation();
    // ✅ THAY ĐỔI: Thêm dependency
  }, [departureId]);

  const handleLocationSelect = (location) => {
    console.log("Location selected:", JSON.stringify(location, null, 2));
    onSelect(location);
    navigation.goBack();
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <LocationIcon />
      <Text style={styles.locationText}>{item.tenDiaDiem}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Bạn muốn đi đâu?</Text>
      </View>

      <View style={styles.content}>
        <SearchInput placeholder="Tên tỉnh/thành phố, quận/huyện" />

        <Text style={styles.note}>
          *Lưu ý: Sử dụng tên địa phương trước sáp nhập
        </Text>

        <Text style={styles.sectionTitle}>Địa danh phổ biến</Text>

        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item, index) =>
            item._id?.toString() || item.maDiaDiem || index.toString()
          }
          style={styles.locationList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  note: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#BDC3C7",
    marginBottom: 16,
  },
  locationList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  locationText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
  },
});
