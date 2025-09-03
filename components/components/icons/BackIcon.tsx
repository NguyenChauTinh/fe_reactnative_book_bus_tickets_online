import Svg, { Path } from "react-native-svg"

export default function BackIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}
