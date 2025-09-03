import FooterTabBar from "@/components/navigate/FooterTabBar";
import AccountInfoScreen from "@/components/screens/account_screens/AccountInfoScreen";
import AccountScreen from "@/components/screens/account_screens/AccountScreen";
import DateSelectionScreen from "@/components/screens/main_screens/DateSelectionScreen";
import DepartureScreen from "@/components/screens/main_screens/DepartureScreen";
import DestinationScreen from "@/components/screens/main_screens/DestinationScreen";
import MainScreen from "@/components/screens/main_screens/MainScreen";
import SearchResultsScreen from "@/components/screens/main_screens/SearchResultsScreen";
import SeatSelectionScreen from "@/components/screens/main_screens/SeatSelectionScreen";
import MainLayout from "@/components/screens/MainLayout";
import NotificationScreen from "@/components/screens/notification_screens/NotificationScreen";
import TicketScreen from "@/components/screens/ticket_screens/TicketScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { io } from "socket.io-client";
import { SocketProvider } from "../../contexts/SocketContext";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();
const TicketStack = createNativeStackNavigator();
const NotificationStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();

export type RootStackParamList = {
  Main: undefined;
  Ticket: undefined;
  Notification: undefined;
  Account: undefined;
};

// Stack Navigator cho phần Contact/Friends
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FooterTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="MainTab" options={{ tabBarLabel: "Tìm kiếm" }}>
        {() => (
          <MainLayout>
            <MainStackNavigator />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="TicketTab" options={{ tabBarLabel: "Vé của tôi" }}>
        {() => (
          <MainLayout>
            <TicketStackNavigator />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="NotificationTab" options={{ tabBarLabel: "Thông báo" }}>
        {() => (
          <MainLayout>
            <NotificationStackNavigator />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="AccountTab" options={{ tabBarLabel: "Tài khoản" }}>
        {() => (
          <MainLayout>
            <AccountStackNavigator />
          </MainLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Stack Navigator cho phần chính
function MainStackNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none", // Disable animations
      }}
    >
      <MainStack.Screen name="MainScreen" component={MainScreen} />
      <MainStack.Screen
        name="DateSelectionScreen"
        component={DateSelectionScreen}
      />
      <MainStack.Screen
        name="DestinationScreen"
        component={DestinationScreen}
      />
      <MainStack.Screen name="DepartureScreen" component={DepartureScreen} />
      <MainStack.Screen
        name="SearchResultsScreen"
        component={SearchResultsScreen}
      />
      <MainStack.Screen
        name="SeatSelectionScreen"
        component={SeatSelectionScreen}
      />
    </MainStack.Navigator>
  );
}

// Stack Navigator cho phần vé
function TicketStackNavigator() {
  return (
    <TicketStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none", // Disable animations
      }}
    >
      <TicketStack.Screen name="TicketScreen" component={TicketScreen} />
    </TicketStack.Navigator>
  );
}

// Stack Navigator cho phần thông báo
function NotificationStackNavigator() {
  return (
    <NotificationStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none", // Disable animations
      }}
    >
      <NotificationStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
    </NotificationStack.Navigator>
  );
}

// Stack Navigator cho phần tài khoản
function AccountStackNavigator() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none", // Disable animations
      }}
    >
      <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
      <AccountStack.Screen
        name="AccountInfoScreen"
        component={AccountInfoScreen}
      />
    </AccountStack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const setupSocket = async () => {
      const userId = "1";
      // const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const socket = io("http://localhost:8081", {
        query: { userId },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    };

    setupSocket();
  }, []);

  return (
    <SocketProvider>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: "none", // Disable animations
        }}
      >
        {/* Main Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Ticket"
          component={TicketStackNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationStackNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={AccountStackNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({});
