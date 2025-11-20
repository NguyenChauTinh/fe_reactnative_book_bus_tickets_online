import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api_trip_schedule_service } from "../../../apis/api_trip_schedule_service";
import BackButton from "../../components/BackButton";
import SearchInput from "../../components/SearchInput";
import LocationIcon from "../../components/icons/LocationIcon";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function DepartureScreen({ navigation, route }) {
  const { onSelect, destinationId } = route.params;

  const [popularLocations, setPopularLocations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Chờ 300ms sau khi ngừng gõ

  useEffect(() => {
    const fetchPopularLocations = async () => {
      try {
        setLoading(true); 
        const params = {
          findType: "don",
          relatedId: destinationId,
        };
        const response = await api_trip_schedule_service.getDiaDiemKetNoi(
          params
        );
        const data = response?.data || (Array.isArray(response) ? response : []);
        setPopularLocations(data);
        setSearchResults([]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa điểm đón:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularLocations();
  }, [destinationId]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log(searchQuery);
      if (debouncedSearchQuery.trim() === "") {
        setSearchResults([]); 
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true); 
        const response = await api_trip_schedule_service.timDiaDiemTheoTen(
          debouncedSearchQuery
        );
        const data = response?.data || (Array.isArray(response) ? response : []);
        setSearchResults(data);
      } catch (error) {
        console.error("Lỗi khi tìm địa điểm:", error.message);
        setSearchResults([]); 
      } finally {
        setIsSearching(false); 
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]); 

  const handleLocationSelect = (location) => {
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

  const displayedLocations = searchQuery.trim()
    ? searchResults
    : popularLocations;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Đang tải địa điểm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} edges={["top", "left", "right"]}>

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Nơi xuất phát</Text>
      </View>

      <View style={styles.content}>
        <SearchInput
          placeholder="Tên tỉnh/thành phố, quận/huyện"
          value={searchQuery}
          onChangeText={setSearchQuery}
          isLoading={isSearching}
        />

        <Text style={styles.note}>
          *Lưu ý: Sử dụng tên địa phương trước sáp nhập
        </Text>

        <Text style={styles.sectionTitle}>
          {searchQuery.trim() ? "Kết quả tìm kiếm" : "Địa danh phổ biến"}
        </Text>

        {isSearching && !loading ? (
          <ActivityIndicator color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={displayedLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item, index) =>
              item._id?.toString() || item.maDiaDiem || index.toString()
            }
            style={styles.locationList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? "Không tìm thấy địa điểm."
                  : "Không có địa điểm phổ biến."}
              </Text>
            }
            keyboardShouldPersistTaps="handled" 
          />
        )}
      </View>
    </View>
  );
}

// 12. Cập nhật Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007AFF",
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
  // Thêm style cho loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  // Thêm style cho text rỗng
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});