import Svg, { Path } from "react-native-svg"

export default function SwapIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        d="M16 17l4-4-4-4M8 7l-4 4 4 4"
        stroke="#4A90E2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M20 13H4M4 11h16" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
