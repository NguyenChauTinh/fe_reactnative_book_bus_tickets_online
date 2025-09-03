import Svg, { Rect, Circle } from "react-native-svg"

export default function BusIcon({ active = false }) {
  const color = active ? "#4A90E2" : "#BDC3C7"

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Rect x="4" y="6" width="16" height="12" rx="2" fill={color} />
      <Rect x="6" y="8" width="3" height="4" rx="1" fill="white" />
      <Rect x="10" y="8" width="3" height="4" rx="1" fill="white" />
      <Rect x="15" y="8" width="3" height="4" rx="1" fill="white" />
      <Circle cx="7" cy="19" r="1" fill={color} />
      <Circle cx="17" cy="19" r="1" fill={color} />
    </Svg>
  )
}
