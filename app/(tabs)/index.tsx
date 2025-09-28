import FooterTabBar from "@/components/navigate/FooterTabBar";
import AccountInfoScreen from "@/components/screens/account_screens/AccountInfoScreen";
import AccountScreen from "@/components/screens/account_screens/AccountScreen";
import CustomerInfoScreen from "@/components/screens/main_screens/CustomerInfoScreen";
import DateSelectionScreen from "@/components/screens/main_screens/DateSelectionScreen";
import DepartureScreen from "@/components/screens/main_screens/DepartureScreen";
import DestinationScreen from "@/components/screens/main_screens/DestinationScreen";
import DropoffPointScreen from "@/components/screens/main_screens/DropoffPointScreen";
import MainScreen from "@/components/screens/main_screens/MainScreen";
import PaymentScreen from "@/components/screens/main_screens/PaymentScreen";
import PickupPointScreen from "@/components/screens/main_screens/PickupPointScreen";
import SearchResultsScreen from "@/components/screens/main_screens/SearchResultsScreen";
import SeatSelectionScreen from "@/components/screens/main_screens/SeatSelectionScreen";
import TripInfoScreen from "@/components/screens/main_screens/TripInfoScreen";
import MainLayout from "@/components/screens/MainLayout";
import NotificationScreen from "@/components/screens/notification_screens/NotificationScreen";
import TicketScreen from "@/components/screens/ticket_screens/TicketScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
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
  DateSelectionScreen: { departure: string; destination: string };
  DestinationScreen: undefined;
  DepartureScreen: { destinations: string[] };
  SearchResultsScreen: {
    departure: string;
    destination: string;
    date: string;
  };
  SeatSelectionScreen: { tripId: string };
  CustomerInfoScreen: { tripId: string; selectedSeats: string[] };
  DropoffPointScreen: { tripId: string; selectedSeats: string[] };
  PickupPointScreen: { tripId: string; selectedSeats: string[] };
  TripInfoScreen: { tripId: string };
  AccountInfoScreen: undefined;
  PaymentScreen: { tripId: string; selectedSeats: string[] };
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
  // useEffect(() => {
  //   const setupSocket = async () => {
  //     const userId = "1";
  //     // const userId = await AsyncStorage.getItem("userId");
  //     if (!userId) return;

  //     const socket = io("http://localhost:8081", {
  //       query: { userId },
  //       transports: ["websocket"],
  //     });

  //     socket.on("connect", () => {
  //       console.log("Socket connected");
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("Socket disconnected");
  //     });
  //   };

  //   setupSocket();
  // }, []);

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
        {/* =========================== */}
        {/* Main screen */}
        <Stack.Screen
          name="DateSelectionScreen"
          component={DateSelectionScreen}
        />
        <Stack.Screen
          name="DestinationScreen"
          component={DestinationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DepartureScreen"
          component={DepartureScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchResultsScreen"
          component={SearchResultsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeatSelectionScreen"
          component={SeatSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomerInfoScreen"
          component={CustomerInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DropoffPointScreen"
          component={DropoffPointScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PickupPointScreen"
          component={PickupPointScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TripInfoScreen"
          component={TripInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        {/* ================================ */}
      </Stack.Navigator>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({});
