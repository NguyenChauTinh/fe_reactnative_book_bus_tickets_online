import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import VexereIcon from "./icons/VexereIcon";

export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <VexereIcon />
        <Text style={styles.logo}>Vé xe</Text>
      </View>

      <TouchableOpacity
        style={styles.rightSection}
        onPress={() => navigation.navigate("AccountTab" as never)}
      >
        <Text style={styles.greeting}>Xin chào</Text>
        <ChevronRightIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
    marginBottom: 16,
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
