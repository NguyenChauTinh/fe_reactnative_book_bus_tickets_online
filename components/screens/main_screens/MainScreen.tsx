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

export default function MainScreen({ navigation }) {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departureLocation, setDepartureLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleDeparturePress = () => {
    navigation.navigate("DepartureScreen", {
      onSelect: (location) => setDepartureLocation(location),
    });
  };

  const handleDestinationPress = () => {
    navigation.navigate("DestinationScreen", {
      onSelect: (location) => setDestination(location),
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      <Header />

      <ScrollView style={styles.content}>
        <View style={styles.bookingCard}>
          <LocationSelector
            departureLocation={departureLocation}
            destination={destination}
            onDeparturePress={handleDeparturePress}
            onDestinationPress={handleDestinationPress}
            onSwap={handleSwapLocations}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
