import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import SearchInput from "../../components/SearchInput";
import LocationIcon from "../../components/icons/LocationIcon";

const locations = [
  "Hà Nội",
  "Đà Nẵng",
  "Hồ Chí Minh",
  "Ba Rịa-Vũng Tàu",
  "Quy Nhơn - Bình Định",
  "Nha Trang - Khánh Hòa",
  "Đà Lạt - Lâm Đồng",
];

export default function DepartureScreen({ navigation, route }) {
  const { onSelect } = route.params;

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
      <Text style={styles.locationText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Nơi xuất phát</Text>
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
          keyExtractor={(item) => item}
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
