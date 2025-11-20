//
// --- NỘI DUNG MỚI CHO SeatMapDisplay.tsx ---
//
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Định nghĩa kiểu dữ liệu cho một ghế trong layout
interface SeatLayoutItem {
  maSoGhe: string;
  tang: string;
  hang: number;
  cot: number;
  trangThai: boolean;
  isBooked: boolean;
}

// Định nghĩa kiểu cho props
interface SeatMapDisplayProps {
  seatMap: {
    busType: string;
    layout: SeatLayoutItem[];
  };
  // (Tạm thời chúng ta chỉ hiển thị, chưa cho phép chọn)
  // onSelectSeat?: (seatId: string) => void;
}

/**
 * Hàm này nhận vào một mảng các ghế (đã lọc theo tầng)
 * và render chúng ra thành một cái lưới (grid)
 */
const renderFloor = (seatsOnFloor: SeatLayoutItem[]) => {
  if (!seatsOnFloor || seatsOnFloor.length === 0) {
    return null;
  }

  // Tìm số hàng và số cột tối đa
  const maxRow = Math.max(...seatsOnFloor.map((s) => s.hang));
  const maxCol = Math.max(...seatsOnFloor.map((s) => s.cot));

  const rows = [];
  for (let r = 1; r <= maxRow; r++) {
    const cells = [];
    for (let c = 1; c <= maxCol; c++) {
      // Tìm ghế tại vị trí (hàng, cột) này
      const seat = seatsOnFloor.find((s) => s.hang === r && s.cot === c);

      if (!seat) {
        // Nếu không có gì ở ô này (dữ liệu DB bị thiếu)
        cells.push(<View key={`empty-${r}-${c}`} style={styles.emptyCell} />);
      } else if (seat.trangThai === false) {
        // Nếu là Lối Đi (trangThai: false)
        cells.push(<View key={seat.maSoGhe} style={styles.aisleCell} />);
      } else {
        // Nếu là GHẾ THẬT (trangThai: true)
        const isBooked = seat.isBooked;
        cells.push(
          <TouchableOpacity
            key={seat.maSoGhe}
            style={[
              styles.seat,
              isBooked ? styles.seatBooked : styles.seatAvailable,
            ]}
            disabled={true} // Tạm thời disabled
            // onPress={() => onSelectSeat(seat.maSoGhe)}
          >
            {/* Cắt bớt (D) và (T) cho gọn */}
            <Text
              style={
                isBooked ? styles.seatTextBooked : styles.seatTextAvailable
              }
            >
              {seat.maSoGhe.split("(")[0]}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    // Tạo một hàng
    rows.push(
      <View key={`row-${r}`} style={styles.row}>
        {cells}
      </View>
    );
  }
  return rows;
};

// COMPONENT CHÍNH
const SeatMapDisplay: React.FC<SeatMapDisplayProps> = ({ seatMap }) => {
  // Phân chia ghế theo tầng
  const { lowerFloorSeats, upperFloorSeats } = useMemo(() => {
    const lower = seatMap.layout.filter(
      (s) => s.tang && s.tang.toLowerCase().includes("dưới")
    );
    const upper = seatMap.layout.filter(
      (s) => s.tang && s.tang.toLowerCase().includes("trên")
    );
    return { lowerFloorSeats: lower, upperFloorSeats: upper };
  }, [seatMap.layout]);

  return (
    <View style={styles.container}>
      {/* Tầng dưới */}
      <View style={styles.floorContainer}>
        <Text style={styles.floorTitle}>Tầng Dưới</Text>
        {renderFloor(lowerFloorSeats)}
      </View>

      {/* Tầng trên */}
      <View style={styles.floorContainer}>
        <Text style={styles.floorTitle}>Tầng Trên</Text>
        {renderFloor(upperFloorSeats)}
      </View>
    </View>
  );
};

// STYLES
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0E0E0", // Nền xám nhạt cho toàn bộ sơ đồ
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  floorContainer: {
    flex: 1,
    alignItems: "center",
  },
  floorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5, // Giảm khoảng cách hàng
  },
  seat: {
    width: 38, // Giảm kích thước ô ghế
    height: 32, // Giảm kích thước ô ghế
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 2, // Giảm khoảng cách cột
    borderWidth: 1,
  },
  seatAvailable: {
    backgroundColor: "#FFF",
    borderColor: "#4A90E2",
  },
  seatTextAvailable: {
    color: "#4A90E2",
    fontSize: 10, // Giảm cỡ chữ
    fontWeight: "bold",
  },
  seatBooked: {
    backgroundColor: "#BDBDBD",
    borderColor: "#9E9E9E",
  },
  seatTextBooked: {
    color: "#FFFFFF",
    fontSize: 10,
    textDecorationLine: "line-through",
  },
  aisleCell: {
    width: 38,
    height: 32,
    marginHorizontal: 2,
  },
  emptyCell: {
    width: 38,
    height: 32,
    marginHorizontal: 2,
  },
});

export default SeatMapDisplay;
