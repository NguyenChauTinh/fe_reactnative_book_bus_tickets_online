import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FooterTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const iconMap: Record<
    string,
    {
      focused: keyof typeof Ionicons.glyphMap;
      unfocused: keyof typeof Ionicons.glyphMap;
    }
  > = {
    Main: { focused: "search", unfocused: "search-outline" },
    Ticket: { focused: "ticket", unfocused: "ticket-outline" },
    Notification: {
      focused: "notifications",
      unfocused: "notifications-outline",
    },
    Account: { focused: "person", unfocused: "person-outline" },
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Chuẩn hóa tên: bỏ chữ "Tab" nếu có
        const normalizedName = route.name.replace(/Tab$/, "");

        const icon =
          iconMap[normalizedName]?.[isFocused ? "focused" : "unfocused"] ||
          (isFocused ? "alert-circle" : "alert-circle-outline");

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={icon}
              size={30}
              color={isFocused ? "#007AFF" : "#000000"}
            />
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {typeof label === "string" ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  activeLabel: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default FooterTabBar;
