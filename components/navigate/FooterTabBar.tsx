import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// ====== CUSTOM SVG ICONS (ĐÃ THIẾT KẾ LẠI) ======
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
        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill={color}
      />
    ) : (
      <Path
        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
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
          d="M9 19a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H9Z"
          fill={color}
        />
        <Path
          d="M12 3v18"
          stroke="#fff"
          strokeWidth={1.5}
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M9 19a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H9Z"
          stroke={color}
          strokeWidth={1.8}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <Path
          d="M12 3v18"
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="2 3"
          strokeLinecap="round"
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
        d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-6-6 6 6 0 0 0-6 6v5l-2 2v1h16v-1l-2-2z"
        fill={color}
      />
    ) : (
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
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
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill={color}
      />
    ) : (
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    )}
  </Svg>
);

// ====== FOOTER TAB BAR (Giữ nguyên logic) ======
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

        // Tên tab chuẩn hóa (ví dụ: "MainTab" -> "Main")
        const normalizedName = route.name.endsWith("Tab")
          ? route.name.slice(0, -3)
          : route.name;

        const renderIcon = () => {
          const iconColor = isFocused ? "#007AFF" : "#8E8E93"; // Màu active và inactive
          const iconSize = 28; // Cỡ icon

          switch (normalizedName) {
            case "Main":
              return (
                <SearchIcon
                  size={iconSize}
                  color={iconColor}
                  filled={isFocused}
                />
              );
            case "Ticket":
              return (
                <TicketIcon
                  size={iconSize}
                  color={iconColor}
                  filled={isFocused}
                />
              );
            case "Notification":
              return (
                <NotificationIcon
                  size={iconSize}
                  color={iconColor}
                  filled={isFocused}
                />
              );
            case "Account":
              return (
                <AccountIcon
                  size={iconSize}
                  color={iconColor}
                  filled={isFocused}
                />
              );
            default:
              return null;
          }
        };

        // Đổi tên nhãn cho dễ hiểu
        let tabLabel;
        switch (normalizedName) {
          case "Main":
            tabLabel = "Tìm kiếm";
            break;
          case "Ticket":
            tabLabel = "Vé của tôi";
            break;
          case "Notification":
            tabLabel = "Thông báo";
            break;
          case "Account":
            tabLabel = "Tài khoản";
            break;
          default:
            tabLabel = label;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            {renderIcon()}
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {tabLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ====== STYLES (Tinh chỉnh lại một chút) ======
const styles = StyleSheet.create({
  container: {
    height: 85, // Tăng chiều cao 1 chút cho an toàn (iPhone có tai thỏ)
    paddingTop: 8,
    paddingBottom: 20, // Padding cho an toàn vùng dưới
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    color: "#8E8E93", // Màu chữ inactive
    marginTop: 4,
  },
  activeLabel: {
    color: "#007AFF", // Màu chữ active
    fontWeight: "600",
  },
});

export default FooterTabBar;
