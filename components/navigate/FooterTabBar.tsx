import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// ====== CUSTOM SVG ICONS ======
const SearchIcon = ({
  size = 30,
  color = "#000",
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {filled ? (
      <Path
        d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0-2a9 9 0 0 0-7.485 14.008l-3.76 3.76 1.414 1.414 3.76-3.76A9 9 0 1 0 11 2Z"
        fill={color}
      />
    ) : (
      <Path
        d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0-2a9 9 0 0 0-7.485 14.008l-3.76 3.76 1.414 1.414 3.76-3.76A9 9 0 1 0 11 2Z"
        stroke={color}
        strokeLinecap="round"
      />
    )}
  </Svg>
);

const TicketIcon = ({
  size = 30,
  color = "#000",
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {filled ? (
      <>
        <Path
          d="M4 7.5a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5v1.2a2.3 2.3 0 0 0 0 4.6v1.2A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-1.2a2.3 2.3 0 0 0 0-4.6V7.5Z"
          fill={color}
        />
        <Path
          d="M12 6v12"
          stroke="#fff"
          strokeWidth={1.6}
          strokeDasharray="2 3"
        />
      </>
    ) : (
      <>
        <Path
          d="M5.5 6h13A1.5 1.5 0 0 1 20 7.5v1.2a2.3 2.3 0 0 0 0 4.6v1.2A1.5 1.5 0 0 1 18.5 17h-13A1.5 1.5 0 0 1 4 15.5v-1.2a2.3 2.3 0 0 0 0-4.6V7.5A1.5 1.5 0 0 1 5.5 6Z"
          stroke={color}
          strokeWidth={1.8}
          fill="none"
          strokeLinejoin="round"
        />
        <Path
          d="M12 6v12"
          stroke={color}
          strokeWidth={1.6}
          strokeDasharray="2 3"
        />
      </>
    )}
  </Svg>
);

const NotificationIcon = ({
  size = 30,
  color = "#000",
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {filled ? (
      <Path
        d="M12 2a7 7 0 0 0-7 7v5H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2h-1V9a7 7 0 0 0-7-7Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z"
        fill={color}
      />
    ) : (
      <>
        <Path
          d="M18 14V9a6 6 0 1 0-12 0v5H4v2h16v-2h-2Z"
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
        />
        <Path
          d="M9 18a3 3 0 0 0 6 0"
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
      </>
    )}
  </Svg>
);

const AccountIcon = ({
  size = 30,
  color = "#000",
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {filled ? (
      <Path
        d="M12 2a5 5 0 0 1 5 5 5 5 0 1 1-10 0 5 5 0 0 1 5-5Zm0 8a7 7 0 0 1 7 7v3H5v-3a7 7 0 0 1 7-7Z"
        fill={color}
      />
    ) : (
      <Path
        d="M12 2a5 5 0 0 1 5 5 5 5 0 1 1-10 0 5 5 0 0 1 5-5Zm0 8a7 7 0 0 1 7 7v3H5v-3a7 7 0 0 1 7-7Z"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    )}
  </Svg>
);

// ====== FOOTER TAB BAR ======
const FooterTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
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

        const normalizedName = route.name.replace(/Tab$/, "");

        const renderIcon = () => {
          switch (normalizedName) {
            case "Main":
              return (
                <SearchIcon
                  color={isFocused ? "#007AFF" : "#000"}
                  filled={isFocused}
                />
              );
            case "Ticket":
              return (
                <TicketIcon
                  color={isFocused ? "#007AFF" : "#000"}
                  filled={isFocused}
                />
              );
            case "Notification":
              return (
                <NotificationIcon
                  color={isFocused ? "#007AFF" : "#000"}
                  filled={isFocused}
                />
              );
            case "Account":
              return (
                <AccountIcon
                  color={isFocused ? "#007AFF" : "#000"}
                  filled={isFocused}
                />
              );
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            {renderIcon()}
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
