import Svg, { Path } from "react-native-svg"

export default function PlaneIcon({ active = false }) {
  const color = active ? "#007AFF" : "#BDC3C7"

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill={color}
      />
    </Svg>
  )
}
