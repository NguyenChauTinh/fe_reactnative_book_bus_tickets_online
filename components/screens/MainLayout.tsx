import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
      <View style={styles.body}>{children}</View>
  );
};

const styles = StyleSheet.create({
 
  body: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MainLayout;
