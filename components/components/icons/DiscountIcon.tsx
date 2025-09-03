import Svg, { Circle, Path } from "react-native-svg"

export default function DiscountIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="#9B59B6" />
      <Path
        d="M15 9l-6 6M9 9h.01M15 15h.01"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
