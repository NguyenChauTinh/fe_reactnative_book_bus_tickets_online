// BookingTimeline.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// 1. Định nghĩa các bước
const STEPS = [
  { number: 1, name: "Chọn chỗ" },
  { number: 2, name: "Điểm đón" },
  { number: 3, name: "Điểm trả" },
  { number: 4, name: "Thông tin" },
  { number: 5, name: "Xác nhận" },
];

const BookingTimeline = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <React.Fragment key={step.number}>
            {/* 2. Hiển thị vòng tròn và chữ */}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.activeStepNumber,
                  ]}
                >
                  {isCompleted ? "✓" : step.number}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepName,
                  isActive && styles.activeStepName,
                  isCompleted && styles.completedStepName,
                ]}
              >
                {step.name}
              </Text>
            </View>

            {/* 3. Hiển thị đường gạch nối (trừ item cuối) */}
            {index < STEPS.length - 1 && (
              <View
                style={[styles.line, isCompleted && styles.completedLine]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  stepItem: {
    alignItems: "center",
    maxWidth: 60, // Giới hạn chiều rộng để chữ tự xuống dòng
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    borderColor: "#4A90E2",
    backgroundColor: "#e3f2fd",
  },
  completedCircle: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e8",
  },
  stepNumber: {
    color: "#999",
    fontWeight: "bold",
  },
  activeStepNumber: {
    color: "#333", // Màu số cho bước active/completed
  },
  stepName: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
  },
  activeStepName: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  completedStepName: {
    color: "#333", // Màu chữ cho bước đã hoàn thành
    fontWeight: "500",
  },
  line: {
    flex: 1, // Tự động co giãn
    height: 2,
    backgroundColor: "#ccc",
    marginTop: 15, // Căn giữa với vòng tròn (height 28 / 2 + border)
    marginHorizontal: 4,
  },
  completedLine: {
    backgroundColor: "#4CAF50",
  },
});

export default BookingTimeline;
