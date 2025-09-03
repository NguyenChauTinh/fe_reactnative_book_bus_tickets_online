import { View, TextInput, StyleSheet } from "react-native"
import SearchIcon from "./icons/SearchIcon"

export default function SearchInput({ placeholder }) {
  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#BDC3C7" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 8,
  },
})
