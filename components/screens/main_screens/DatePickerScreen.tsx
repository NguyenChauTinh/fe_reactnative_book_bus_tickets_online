"use client";

import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DatePickerScreen = ({ route, navigation }) => {
  const { type, minDate, onDateSelected } = route.params || {};
  const currentDate = new Date("2025-08-31T14:07:00+07:00"); // Current date: 02:07 PM +07, 31/08/2025
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [days, setDays] = useState([]);

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  useEffect(() => {
    if (isLeapYear(currentYear)) daysInMonth[1] = 29;
    else daysInMonth[1] = 28;
    generateCalendar();
  }, [currentMonth, currentYear]);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = daysInMonth[currentMonth];
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(day);
    }

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }

    setDays(calendarDays);
  };

  const handleDaySelect = (day) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      if (newDate >= minDate) {
        setSelectedDate(newDate);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedDate >= minDate) {
      onDateSelected(selectedDate.toISOString().split("T")[0]);
      navigation.goBack();
    }
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chọn ngày</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.toggleText}>Khứ hồi</Text>
        </TouchableOpacity>
      </View>

      {/* Date Range */}
      <View style={styles.dateRange}>
        <Text>Ngày đi</Text>
        <Text>CN, 31/08/2025</Text>
        <Text>Ngày về</Text>
        <Text>T5, 04/09/2025</Text>
      </View>

      {/* Calendar Controls */}
      <View style={styles.calendarControls}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.controlText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {months[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.controlText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Days of Week */}
      <View style={styles.dayNames}>
        {dayNames.map((day, index) => (
          <Text key={index} style={styles.dayName}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day === selectedDate.getDate() &&
                currentMonth === selectedDate.getMonth() &&
                currentYear === selectedDate.getFullYear() &&
                styles.selectedDay,
              day &&
                new Date(currentYear, currentMonth, day) < minDate &&
                styles.disabledDay,
            ]}
            onPress={() => handleDaySelect(day)}
            disabled={
              !day || new Date(currentYear, currentMonth, day) < minDate
            }
          >
            {day && (
              <Text style={styles.dayText}>
                {day}
                {day === 1 && (
                  <Text style={styles.dayNameSmall}>
                    {
                      dayNames[
                        new Date(currentYear, currentMonth, day).getDay()
                      ]
                    }
                  </Text>
                )}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedDate >= minDate && styles.enabledButton,
        ]}
        onPress={handleConfirm}
        disabled={selectedDate < minDate}
      >
        <Text style={styles.confirmText}>Xác nhận</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E90FF",
    padding: 16,
    alignItems: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  toggleButton: {
    padding: 4,
  },
  toggleText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  dateRange: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  calendarControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  controlText: {
    fontSize: 18,
    color: "#333333",
  },
  monthYear: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  dayNames: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  dayCell: {
    width: Dimensions.get("window").width / 7 - 16,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: "#1E90FF",
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
    color: "#333333",
  },
  dayNameSmall: {
    fontSize: 10,
    color: "#666666",
  },
  confirmButton: {
    backgroundColor: "#D3D3D3",
    padding: 12,
    alignItems: "center",
    margin: 16,
    borderRadius: 4,
  },
  enabledButton: {
    backgroundColor: "#1E90FF",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DatePickerScreen;
