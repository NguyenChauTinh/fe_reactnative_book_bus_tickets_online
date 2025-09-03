import { View, Text, StyleSheet } from "react-native"
import CheckIcon from "./icons/CheckIcon"
import SupportIcon from "./icons/SupportIcon"
import DiscountIcon from "./icons/DiscountIcon"
import PaymentIcon from "./icons/PaymentIcon"

export default function FeatureIcons() {
  const features = [
    { icon: CheckIcon, text: "Chắc chắn\ncó chỗ" },
    { icon: SupportIcon, text: "Hỗ trợ\n24/7" },
    { icon: DiscountIcon, text: "Nhiều\nưu đãi" },
    { icon: PaymentIcon, text: "Thanh toán\nđa dạng" },
  ]

  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <feature.icon />
          <Text style={styles.featureText}>{feature.text}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    color: "#2C3E50",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
})
