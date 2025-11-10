"use client";

import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Calendar({
  isRoundTrip,
  selectedDepartureDate,
  selectedReturnDate,
  onDepartureDateSelect,
  onReturnDateSelect,
}) {
  const scrollViewRef = useRef(null);
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Bỏ useEffect scroll khi chọn ngày - chỉ scroll khi mới vào giao diện

  const isInDateRange = (year, month, day) => {
    if (!isRoundTrip || !selectedDepartureDate || !selectedReturnDate)
      return false;

    const currentDateObj = new Date(year, month - 1, day);
    const departureMatch = selectedDepartureDate.match(
      /(\d{2})\/(\d{2})\/(\d{4})/
    );
    const returnMatch = selectedReturnDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (!departureMatch || !returnMatch) return false;

    const departureDate = new Date(
      departureMatch[3],
      departureMatch[2] - 1,
      departureMatch[1]
    );
    const returnDate = new Date(
      returnMatch[3],
      returnMatch[2] - 1,
      returnMatch[1]
    );

    return currentDateObj >= departureDate && currentDateObj <= returnDate;
  };

  const generateMonths = () => {
    const months = [];
    const startMonth = currentMonth - 1;

    for (let i = 0; i < 7; i++) {
      const monthOffset = startMonth + i;
      let month = ((monthOffset - 1) % 12) + 1;
      let year = currentYear + Math.floor((monthOffset - 1) / 12);

      if (month <= 0) {
        month += 12;
        year -= 1;
      }

      months.push({
        name: `Tháng ${month}, ${year}`,
        month,
        year,
      });
    }
    return months;
  };

  const months = generateMonths();

  const compareDates = (dateString1, dateString2) => {
    const match1 = dateString1.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const match2 = dateString2.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (!match1 || !match2) return 0;

    const date1 = new Date(match1[3], match1[2] - 1, match1[1]);
    const date2 = new Date(match2[3], match2[2] - 1, match2[1]);

    return date1.getTime() - date2.getTime();
  };

  const generateMonthCalendar = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
    const days = [];

    for (let i = 1; i < adjustedFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayButton} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateObj = new Date(year, month - 1, day);
      const todayObj = new Date(currentYear, currentMonth - 1, currentDay);
      const isPastDate = currentDateObj < todayObj;

      const dateString = `T${
        new Date(year, month - 1, day).getDay() + 1 || 7
      }, ${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;

      const isSelectedDeparture = selectedDepartureDate?.includes(
        `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}`
      );
      const isSelectedReturn = selectedReturnDate?.includes(
        `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}`
      );

      const isInRange =
        isInDateRange(year, month, day) &&
        !isSelectedDeparture &&
        !isSelectedReturn;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isPastDate && styles.disabledDay,
            isSelectedDeparture && styles.selectedDepartureDay,
            isSelectedReturn && styles.selectedReturnDay,
            isInRange && styles.rangeDay,
          ]}
          disabled={isPastDate}
          onPress={() => {
            if (!isPastDate) {
              if (!selectedDepartureDate || !isRoundTrip) {
                onDepartureDateSelect(dateString);
              } else if (
                isRoundTrip &&
                selectedDepartureDate &&
                !selectedReturnDate
              ) {
                if (compareDates(dateString, selectedDepartureDate) < 0) {
                  onReturnDateSelect(selectedDepartureDate);
                  onDepartureDateSelect(dateString);
                } else {
                  onReturnDateSelect(dateString);
                }
              } else {
                onDepartureDateSelect(dateString);
                if (isRoundTrip) onReturnDateSelect(null);
              }
            }
          }}
        >
          <Text
            style={[
              styles.dayText,
              isPastDate && styles.disabledDayText,
              isSelectedDeparture && styles.selectedDayText,
              isSelectedReturn && styles.selectedDayText,
              isInRange && styles.rangeDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleLayout = () => {
    console.log("Content rendered, scrolling to selected date...");

    // Sử dụng timeout để đảm bảo component đã render xong
    setTimeout(() => {
      if (scrollViewRef.current) {
        // Scroll to selected date if available, otherwise current month
        const dateToScroll = selectedReturnDate || selectedDepartureDate;

        if (dateToScroll) {
          const dateMatch = dateToScroll.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          if (dateMatch) {
            const selectedMonth = Number.parseInt(dateMatch[2]);
            const selectedYear = Number.parseInt(dateMatch[3]);

            const startMonth = currentMonth - 1;
            const startYear = currentYear;
            const monthDiff =
              (selectedYear - startYear) * 12 + (selectedMonth - startMonth);

            if (monthDiff >= 0 && monthDiff < 7) {
              // Tính toán vị trí scroll để title tháng hiển thị ở đầu
              const monthTitleHeight = 50; // Chiều cao của title tháng
              const scrollPosition = monthDiff * 400 - monthTitleHeight;
              console.log(
                "Scrolling to selected date position:",
                scrollPosition
              );
              scrollViewRef.current.scrollTo({
                x: 0,
                y: Math.max(0, scrollPosition), // Đảm bảo không scroll âm
                animated: false,
              });
              return;
            }
          }
        }

        // Fallback: scroll to current month với title hiển thị
        const monthTitleHeight = 50;
        const currentMonthPosition = Math.max(0, 0 * 400 - monthTitleHeight);
        console.log(
          "Scrolling to current month position:",
          currentMonthPosition
        );
        scrollViewRef.current.scrollTo({
          x: 0,
          y: currentMonthPosition,
          animated: false,
        });
      }
    }, 200); // Tăng timeout để đảm bảo render hoàn tất
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      onLayout={handleLayout}
    >
      {months.map(({ name, month, year }) => (
        <View key={`${month}-${year}`}>
          <Text style={styles.monthTitle}>{name}</Text>
          <View style={styles.calendar}>
            {generateMonthCalendar(year, month)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 200, // để chắc chắn có khoảng trống để scroll
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
    marginTop: 16,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayButton: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  disabledDay: {
    opacity: 0.3,
    backgroundColor: "transparent",
  },
  selectedDepartureDay: {
    backgroundColor: "#F1C40F",
    borderRadius: 8,
  },
  selectedReturnDay: {
    backgroundColor: "#F1C40F",
    borderRadius: 8,
  },
  rangeDay: {
    backgroundColor: "#FFF3CD",
    borderRadius: 0,
  },
  dayText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  disabledDayText: {
    color: "#BDC3C7",
  },
  selectedDayText: {
    color: "#2C3E50",
  },
  rangeDayText: {
    color: "#856404",
  },
});
