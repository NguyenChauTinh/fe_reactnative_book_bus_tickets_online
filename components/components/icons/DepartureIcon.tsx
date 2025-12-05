import React from "react"
import Svg, { Circle } from "react-native-svg"
export default function DepartureIcon({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="8" fill="#007AFF" />
      <Circle cx="12" cy="12" r="3" fill="white" />
    </Svg>
  )
}
