import { TouchableOpacity, StyleSheet } from "react-native"
import BackIcon from "./icons/BackIcon"

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BackIcon />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
})
