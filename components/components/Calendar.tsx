"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    let targetMonth = 0; // Default to current month (0-based index)

    // If user has selected a departure date, scroll to that month
    if (selectedDepartureDate) {
      const dateMatch = selectedDepartureDate.match(
        /(\d{2})\/(\d{2})\/(\d{4})/
      );
      if (dateMatch) {
        const selectedMonth = Number.parseInt(dateMatch[2]);
        const selectedYear = Number.parseInt(dateMatch[3]);

        // Calculate month offset from the start month
        const startMonth = currentMonth - 1;
        const startYear = currentYear;
        const monthDiff =
          (selectedYear - startYear) * 12 + (selectedMonth - startMonth);

        if (monthDiff >= 0 && monthDiff < 6) {
          targetMonth = monthDiff;
        }
      }
    }

    const scrollPosition = targetMonth * 400; // Approximate height per month

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
      }
    }, 100);
  }, [selectedDepartureDate]);

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
    const startMonth = currentMonth - 1; // 1 month in the past

    for (let i = 0; i < 6; i++) {
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

    // Add empty cells for days before month starts
    for (let i = 1; i < adjustedFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayButton} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateObj = new Date(year, month - 1, day);
      const todayObj = new Date(currentYear, currentMonth - 1, currentDay);
      const isPastDate = currentDateObj < todayObj;

      const dateString = `T${
        new Date(year, month - 1, day).getDay() || 7
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
                  // Selected date is earlier than departure, swap them
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

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
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
  container: {
    padding: 16,
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
