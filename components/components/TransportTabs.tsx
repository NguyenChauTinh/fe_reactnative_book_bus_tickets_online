"use client"

import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import BikeIcon from "./icons/BikeIcon"
import BusIcon from "./icons/BusIcon"
import PlaneIcon from "./icons/PlaneIcon"
import TrainIcon from "./icons/TrainIcon"

export default function TransportTabs() {
  const [activeTab, setActiveTab] = useState("bus")

  const tabs = [
    { id: "bus", label: "Xe khách", icon: BusIcon, discount: null },
    { id: "plane", label: "Máy bay", icon: PlaneIcon, discount: "-20k" },
    { id: "train", label: "Tàu hòa", icon: TrainIcon, discount: null },
    { id: "bike", label: "Thuê xe", icon: BikeIcon, discount: "Mới" },
  ]

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <View style={styles.iconContainer}>
            <tab.icon active={activeTab === tab.id} />
            {tab.discount && (
              <View style={[styles.badge, tab.discount === "Mới" ? styles.newBadge : styles.discountBadge]}>
                <Text style={styles.badgeText}>{tab.discount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#F8F9FA",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
  },
  discountBadge: {
    backgroundColor: "#E74C3C",
  },
  newBadge: {
    backgroundColor: "#27AE60",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  activeTabLabel: {
    color: "#007AFF",
    fontWeight: "600",
  },
})
