import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type CustomTextInputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function CustomTextInput({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}: CustomTextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    width: "100%",
  },
  eyeIcon: {
    marginLeft: 8,
  },
});
