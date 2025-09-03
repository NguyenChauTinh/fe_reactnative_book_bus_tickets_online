import Svg, { Circle, Path } from "react-native-svg"

export default function SupportIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="#3498DB" />
      <Path
        d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
