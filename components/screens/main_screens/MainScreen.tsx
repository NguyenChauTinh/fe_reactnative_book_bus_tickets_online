"use client";

import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSelector from "../../components/DateSelector";
import FeatureIcons from "../../components/FeatureIcons";
import Header from "../../components/Header";
import LocationSelector from "../../components/LocationSelector";
import RecentSearches from "../../components/RecentSearches";
import SearchButton from "../../components/SearchButton";
import { AiChatbot } from "./ChatModal";

export default function MainScreen({ navigation }) {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departureLocation, setDepartureLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleDeparturePress = () => {
    navigation.navigate("DepartureScreen", {
      onSelect: (location) => {
        console.log("Location received for Departure:", location);
        setDepartureLocation(location);

        // ✅ THAY ĐỔI: Bỏ comment dòng này.
        // Khi chọn điểm đi mới, ta phải xóa điểm đến cũ
        // vì nó có thể không còn hợp lệ.
        setDestination(null);
      },

      // ✅ THAY ĐỔI: Xóa ID điểm đến.
      // Luôn gửi `null` để DepartureScreen luôn tải danh sách đầy đủ.
      destinationId: null,
    });
  };

  const handleDestinationPress = () => {
    navigation.navigate("DestinationScreen", {
      onSelect: (location) => {
        console.log("Location received for Destination:", location);
        setDestination(location);
      },

      // ✅ GIỮ NGUYÊN: Vẫn gửi ID của điểm đi.
      // Logic này đúng: chọn điểm đi sẽ lọc điểm đến.
      departureId: departureLocation?._id,
    });
  };

  const handleDatePress = () => {
    navigation.navigate("DateSelectionScreen", {
      isRoundTrip,
      departureDate,
      returnDate,
      onSelect: (departure, returnDate, updatedRoundTrip) => {
        setDepartureDate(departure);
        if (returnDate) setReturnDate(returnDate);
        if (updatedRoundTrip !== undefined) {
          setIsRoundTrip(updatedRoundTrip);
          if (!updatedRoundTrip) {
            setReturnDate(null);
          }
        }
      },
    });
  };

  const handleSwapLocations = () => {
    const temp = departureLocation;
    setDepartureLocation(destination);
    setDestination(temp);

    // ✅ CÂN NHẮC: Sau khi swap, điểm đến mới (temp)
    // có thể không hợp lệ. Bạn có thể muốn reset nó.
    // setDestination(null); // (Tùy chọn)
  };

  console.log("Current Departure State:", departureLocation);
  console.log("Current Destination State:", destination);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      <Header />

      <ScrollView style={styles.content}>
        <View style={styles.bookingCard}>
          <LocationSelector
            departureLocation={departureLocation?.tenDiaDiem || ""}
            destination={destination?.tenDiaDiem || ""}
            onDeparturePress={handleDeparturePress}
            onDestinationPress={handleDestinationPress}
            // onSwap={handleSwapLocations}
          />

          <DateSelector
            isRoundTrip={isRoundTrip}
            setIsRoundTrip={(value) => {
              setIsRoundTrip(value);
              if (!value) {
                setReturnDate(null);
              }
            }}
            departureDate={departureDate}
            returnDate={returnDate}
            onDatePress={handleDatePress}
          />
        </View>

        <SearchButton
          departureLocation={departureLocation}
          destination={destination}
          departureDate={departureDate}
          returnDate={returnDate}
          isRoundTrip={isRoundTrip}
          navigation={navigation}
          onDateSelect={(departure, returnDate, updatedRoundTrip) => {
            setDepartureDate(departure);
            if (returnDate) setReturnDate(returnDate);
            if (updatedRoundTrip !== undefined) {
              setIsRoundTrip(updatedRoundTrip);
              if (!updatedRoundTrip) {
                setReturnDate(null);
              }
            }
          }}
          onDepartureSelect={(location) => setDepartureLocation(location)}
          onDestinationSelect={(location) => setDestination(location)}
        />

        <FeatureIcons />

        <RecentSearches />
      </ScrollView>
      <AiChatbot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
