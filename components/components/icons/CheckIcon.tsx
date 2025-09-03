import Svg, { Circle, Path } from "react-native-svg"

export default function CheckIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="#27AE60" />
      <Path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
