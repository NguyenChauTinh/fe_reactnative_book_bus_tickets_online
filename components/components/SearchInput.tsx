import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View
} from "react-native";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isLoading?: boolean; 
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChangeText,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={22}
        color="#8E8E93"
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        value={value} 
        onChangeText={onChangeText} 
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading && (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={styles.spinner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Màu nền xám nhạt
    borderRadius: 10,
    height: 48, // Chiều cao cố định
    paddingHorizontal: 12,
    marginTop: 16, // Giữ khoảng cách với header
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%", // Đảm bảo TextInput chiếm đủ chiều cao
  },
  spinner: {
    marginLeft: 8,
  },
});

export default SearchInput;