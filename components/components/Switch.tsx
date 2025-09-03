"use client"

import React from "react"
import { TouchableOpacity, StyleSheet, Animated } from "react-native"

export default function Switch({ value, onValueChange }) {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [value])

  const handlePress = () => {
    onValueChange(!value)
  }

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#BDC3C7", "#27AE60"],
  })

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
})
