"use client";

import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import DateSelector from "../../components/DateSelector";
import FeatureIcons from "../../components/FeatureIcons";
import Header from "../../components/Header";
import LocationSelector from "../../components/LocationSelector";
import RecentSearches from "../../components/RecentSearches";
import SearchButton from "../../components/SearchButton";
import { AiChatbot } from "./ChatModal";

type Location = {
  _id: string;
  tenDiaDiem: string;
};

export default function MainScreen({ navigation }: { navigation: any }) {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departureLocation, setDepartureLocation] = useState<Location | null>(
    null
  );
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState<string | null>("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchRefreshKey, setSearchRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setSearchRefreshKey(prevKey => prevKey + 1); 
    }, [])
  );

  const handleDeparturePress = () => {
    navigation.navigate("DepartureScreen", {
      onSelect: (location: any) => {
        setDepartureLocation(location);

        setDestination(null);
      },

      destinationId: null,
    });
  };

  const handleDestinationPress = () => {
    navigation.navigate("DestinationScreen", {
      onSelect: (location: any) => {
        console.log("Location received for Destination:", location);
        setDestination(location);
      },

      departureId: departureLocation?._id,
    });
  };

  const handleDatePress = () => {
    navigation.navigate("DateSelectionScreen", {
      isRoundTrip,
      departureDate,
      returnDate,
      onSelect: (
        departure: string,
        returnDate: string | null,
        updatedRoundTrip?: boolean
      ) => {
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

  const handleRecentSearchSelect = useCallback((searchItem: any) => {
    setDepartureLocation({
      _id: searchItem.diemDiId,
      tenDiaDiem: searchItem.tenDiemDi,
    });
    setDestination({
      _id: searchItem.diemDenId,
      tenDiaDiem: searchItem.tenDiemDen,
    });

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />

      <Header />

      <ScrollView style={styles.content}>
        <View style={styles.bookingCard}>
          <LocationSelector
            departureLocation={departureLocation?.tenDiaDiem || ""}
            destination={destination?.tenDiaDiem || ""}
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
          departureLocation={departureLocation || null}
          destination={destination || null}
          departureDate={departureDate}
          returnDate={returnDate}
          isRoundTrip={isRoundTrip}
          navigation={navigation}
          onDateSelect={(departure: string, returnDate?: string | null) => {
            setDepartureDate(departure);
            if (returnDate) setReturnDate(returnDate);
          }}
          onDepartureSelect={(location: Location) =>
            setDepartureLocation({ _id: location._id, tenDiaDiem: location.tenDiaDiem })
          }
          onDestinationSelect={(location: Location) => setDestination({ _id: location._id, tenDiaDiem: location.tenDiaDiem })}
        />

        <FeatureIcons />

        <RecentSearches refreshKey={searchRefreshKey} onSelectRecentSearch={handleRecentSearchSelect} />
      </ScrollView>
      <AiChatbot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
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
