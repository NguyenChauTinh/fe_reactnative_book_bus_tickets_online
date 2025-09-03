import Svg, { Rect, Circle } from "react-native-svg"

export default function TrainIcon({ active = false }) {
  const color = active ? "#4A90E2" : "#BDC3C7"

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Rect x="4" y="6" width="16" height="10" rx="2" fill={color} />
      <Rect x="6" y="8" width="5" height="3" rx="1" fill="white" />
      <Rect x="13" y="8" width="5" height="3" rx="1" fill="white" />
      <Circle cx="8" cy="18" r="1" fill={color} />
      <Circle cx="16" cy="18" r="1" fill={color} />
      <Rect x="10" y="13" width="4" height="1" fill="white" />
    </Svg>
  )
}
