import Svg, { Circle, Rect, Path } from "react-native-svg"

export default function PaymentIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="#16A085" />
      <Rect x="8" y="10" width="8" height="4" rx="1" fill="white" />
      <Path d="M8 12h8" stroke="#16A085" strokeWidth="1" />
    </Svg>
  )
}
