import Svg, { Circle, Path } from "react-native-svg"

export default function BikeIcon({ active = false }) {
  const color = active ? "#007AFF" : "#BDC3C7"

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="18" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M9 18h6M12 6l3 12M9 6h6l-3-3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}
