import Svg, { Circle, Path } from "react-native-svg"

export default function SearchIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Circle cx="11" cy="11" r="8" stroke="#BDC3C7" strokeWidth="2" fill="none" />
      <Path d="M21 21l-4.35-4.35" stroke="#BDC3C7" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}
