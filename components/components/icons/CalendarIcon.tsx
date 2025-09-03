import Svg, { Rect, Path } from "react-native-svg"

export default function CalendarIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#4A90E2" />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}
