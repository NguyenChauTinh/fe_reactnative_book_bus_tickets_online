import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PaymentCountdown = () => {
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // format mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.warningBox}>
      <Text style={styles.warningText}>
        Thời gian thanh toán còn lại {formatTime(secondsLeft)}
      </Text>
    </View>
  );
};

export default PaymentCountdown;

const styles = StyleSheet.create({
  warningBox: {
    backgroundColor: "#FFCC80",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: { color: "#E65100", fontWeight: "600" },
});
