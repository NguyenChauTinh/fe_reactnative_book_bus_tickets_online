import { Api_Auth_Customer } from "@/apis/api_auth";
import moment from 'moment';
import { useEffect, useState } from "react";
import React, { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from 'react-native-svg';

const DepartureDotIcon = ({ size = 16, color = "#007AFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="6" fill={color} />
    <Circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.3" strokeWidth="2" />
  </Svg>
);

const DestinationPinIcon = ({ size = 16, color = "#E74C3C" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill={color}
    />
  </Svg>
);
const ArrowRightIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <Path d="M5 12H19M12 5L19 12L12 19" stroke="#7F8C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);

type SearchItem = {
  diemDiId: string;
  diemDenId: string;
  tenDiemDi: string;
  tenDiemDen: string;
  ngayKhoiHanh: string;
  timestamp: string;
};
type RecentSearchesProps = {
  refreshKey: number;
  onSelectRecentSearch: (searchItem: SearchItem) => void; 
};
export default function RecentSearches({ refreshKey, onSelectRecentSearch }: RecentSearchesProps) {
  const [searches, setSearches] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const fetchRecentSearches = async () => {
        setIsLoading(true);
        try {
            const response = await Api_Auth_Customer.getRecentSearches();
            
            if (response.success) {
                setSearches(response.data); 
            } else {
                setSearches([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch sử tìm kiếm:", error);
            setSearches([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (refreshKey > 0) { 
            fetchRecentSearches();
        }
    }, [refreshKey]);
    

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Tìm kiếm gần đây</Text>
                <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />
            </View>
        );
    }
    if (!isLoading && searches.length === 0) {
        return null; 
    }
  return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tìm kiếm gần đây</Text>
                <TouchableOpacity onPress={() => console.log('Xóa tất cả')}>
                    <Text style={styles.clearAll}>Xóa tất cả</Text>
                </TouchableOpacity>
            </View>

            {searches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.searchItem} 
                onPress={() => onSelectRecentSearch(search)}
                >
                    <View style={styles.routeContainer}>
                        <View style={styles.locationContainer}>
                            <DepartureDotIcon size={16} color="#007AFF" /> 
                            <Text style={styles.locationText}>{search.tenDiemDi}</Text>
                        </View>

                        <ArrowRightIcon />

                        <View style={styles.locationContainer}>
                            <DestinationPinIcon size={16} color="#E74C3C" /> 
                            <Text style={styles.locationText}>{search.tenDiemDen}</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.dateText}>
                        Tìm kiếm: {moment(search.timestamp).format('HH:mm DD/MM/YYYY')}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  clearAll: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  searchItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: "#2C3E50",
    marginLeft: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
});
