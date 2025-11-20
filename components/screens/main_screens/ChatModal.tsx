import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { runConversation } from "../../../apis/geminiService";

const ChatIcon = ({ onPress }) => (
  <TouchableOpacity style={styles.chatIconContainer} onPress={onPress}>
    <AntDesign name="wechat-work" size={30} color="white" />
  </TouchableOpacity>
);

// Màn hình Chat Modal
export const ChatModal = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Xin chào! Tôi có thể giúp bạn tìm và đặt vé xe. Bạn muốn đi đâu?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Math.random().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Gọi "bộ não" AI
      // Lưu ý: Đảm bảo 'runConversation' được import đúng
      const botResponseText = await runConversation(userMessage.text);

      const botMessage = {
        id: Math.random().toString(),
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      const errorMessage = {
        id: Math.random().toString(),
        text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  }, [messages]);

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text
        style={
          item.sender === "user"
            ? styles.userMessageText
            : styles.botMessageText
        }
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trợ lý đặt xe</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingText}>Trợ lý đang nhập...</Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Bạn cần tìm chuyến xe...?"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                isLoading && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// Component chính bạn sẽ import vào MainScreen
export const AiChatbot = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.chatbotContainer}>
      <ChatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <ChatIcon onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatbotContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  chatIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  // Styles cho Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#4A90E2",
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userMessageText: {
    color: "white",
    fontSize: 16,
  },
  botMessageText: {
    color: "#333",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
