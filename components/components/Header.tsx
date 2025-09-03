import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import VexereIcon from "./icons/VexereIcon";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <VexereIcon />
        <Text style={styles.logo}>vexere</Text>
      </View>

      <TouchableOpacity style={styles.rightSection}>
        <Text style={styles.greeting}>Chào Tình</Text>
        <ChevronRightIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#4A90E2",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 16,
    right: 16,
  },
  greeting: {
    color: "white",
    fontSize: 16,
    marginRight: 4,
  },
  subtitle: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
});
