import { useAuth } from "@/contexts/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // Import Icon ghế
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { api_ai_service } from "../../../apis/api_ai_service";

const HISTORY_KEY = "CHAT_HISTORY_KEY";
const { width } = Dimensions.get("window");

const ChatIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.chatIconContainer} onPress={onPress}>
    <AntDesign name="wechat-work" size={30} color="white" />
  </TouchableOpacity>
);

const SeatMapRender = ({
  data,
  onSelectSeat,
}: {
  data: any;
  onSelectSeat: (text: string) => void;
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>(""); // Lưu tầng đang xem

  if (!data || !data.layout || !Array.isArray(data.layout)) {
    return (
      <Text style={{ color: "red", padding: 10 }}>Đang cập nhật sơ đồ...</Text>
    );
  }

  const { layout, busType } = data;

  const floorMapping: Record<string, string> = {
    lower: "Tầng Dưới",
    upper: "Tầng Trên",
    "1": "Tầng Dưới",
    "2": "Tầng Trên",
  };

  const processedLayout = layout.map((seat: any) => {
    let col = seat.cot;
    if (!col) {
      if (seat.maSoGhe.includes("A")) col = 1;
      else if (seat.maSoGhe.includes("B")) col = 2;
      else if (seat.maSoGhe.includes("C")) col = 3;
      else col = 2;
    }
    return { ...seat, cot: col };
  });

  // Gom nhóm tầng
  const floors = processedLayout.reduce((acc: any, item: any) => {
    const rawFloor = item.tang ? String(item.tang) : "chung";
    const displayFloor = floorMapping[rawFloor] || rawFloor;
    if (!acc[rawFloor]) acc[rawFloor] = { title: displayFloor, seats: [] };
    acc[rawFloor].seats.push(item);
    return acc;
  }, {});

  // Sắp xếp tầng: lower/1 lên trước
  const sortedFloorKeys = Object.keys(floors).sort((a, b) => {
    if (a === "lower" || a === "1") return -1;
    if (b === "lower" || b === "1") return 1;
    return 0;
  });

  // Set tab mặc định lần đầu render
  useEffect(() => {
    if (sortedFloorKeys.length > 0 && activeTab === "") {
      setActiveTab(sortedFloorKeys[0]);
    }
  }, [sortedFloorKeys]);

  // --- HÀM XỬ LÝ CHỌN GHẾ ---
  const handleToggleSeat = (seatCode: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatCode)) {
        return prev.filter((s) => s !== seatCode); // Bỏ chọn
      } else {
        return [...prev, seatCode]; // Chọn thêm
      }
    });
  };

  // --- HÀM XÁC NHẬN ---
  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    // Gửi 1 câu hoàn chỉnh cho Bot xử lý
    const seatString = selectedSeats.join(", ");
    onSelectSeat(`Tôi chọn ghế ${seatString}`);
  };

  // Hàm vẽ lưới (Chỉ vẽ tầng đang active)
  const renderGrid = (floorKey: string) => {
    if (!floors[floorKey]) return null;
    const { seats } = floors[floorKey];

    const maxRow = Math.max(...seats.map((s: any) => parseInt(s.hang) || 0), 0);
    const maxCol = 3;

    return (
      <View style={styles.seatGrid}>
        {Array.from({ length: maxRow }).map((_, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.seatRow}>
            {Array.from({ length: maxCol }).map((_, colIndex) => {
              const currentRow = rowIndex + 1;
              const currentCol = colIndex + 1;
              const seat = seats.find(
                (s: any) =>
                  parseInt(s.hang) === currentRow && s.cot === currentCol
              );

              if (!seat || seat.trangThai === false) {
                return (
                  <View
                    key={`empty-${rowIndex}-${colIndex}`}
                    style={styles.seatPlaceholder}
                  />
                );
              }

              const isBooked = seat.isBooked;
              // Check xem ghế này đang được user chọn (trong phiên này) hay không
              const isSelected = selectedSeats.includes(seat.maSoGhe);
              const shortName = seat.maSoGhe.split("(")[0];

              return (
                <TouchableOpacity
                  key={seat.maSoGhe}
                  style={[
                    styles.seatItem,
                    isBooked ? styles.seatBooked : styles.seatAvailable,
                    isSelected && styles.seatSelected, // Style đè lên nếu đang chọn
                  ]}
                  disabled={isBooked}
                  onPress={() => handleToggleSeat(seat.maSoGhe)}
                >
                  <MaterialCommunityIcons
                    name="seat-passenger"
                    size={25}
                    color={
                      isBooked ? "#bdc3c7" : isSelected ? "white" : "#4A90E2"
                    }
                  />
                  <Text
                    style={[
                      styles.seatText,
                      isBooked && styles.seatTextBooked,
                      isSelected && styles.seatTextSelected,
                    ]}
                  >
                    {shortName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mapContainer}>
      <Text style={styles.busTypeLabel}>{busType}</Text>

      {/* 1. THANH TAB CHUYỂN TẦNG */}
      <View style={styles.tabContainer}>
        {sortedFloorKeys.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tabButton,
              activeTab === key && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.tabTextActive,
              ]}
            >
              {floors[key].title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2. LƯỚI GHẾ (Chỉ hiện tầng active) */}
      <View style={styles.gridContainer}>
        {activeTab !== "" && renderGrid(activeTab)}
      </View>

      {/* 3. NÚT XÁC NHẬN (Chỉ hiện khi có chọn ghế) */}
      {selectedSeats.length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>
            Xác nhận chọn {selectedSeats.length} ghế ({selectedSeats.join(", ")}
            )
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ActionButtonsRender = ({
  data,
  onAction,
}: {
  data: any;
  onAction: (val: string) => void;
}) => {
  if (!data || !data.buttons || !Array.isArray(data.buttons)) return null;

  return (
    <View style={styles.actionButtonsContainer}>
      {data.buttons.map((btn: any, index: number) => {
        // Xác định style màu sắc dựa trên cấu hình server
        const isPrimary = btn.style === "PRIMARY";
        const isDanger = btn.style === "DANGER";

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionBtn,
              isPrimary && styles.actionBtnPrimary,
              isDanger && styles.actionBtnDanger,
            ]}
            onPress={() => onAction(btn.value)}
          >
            <Text
              style={[
                styles.actionBtnText,
                (isPrimary || isDanger) && styles.actionBtnTextLight,
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// --- MAIN COMPONENT ---
export const ChatModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { user: contextUser } = useAuth();
  // Khởi tạo tin nhắn chào mừng
  const initialMessage = {
    id: "1",
    text: "Xin chào! Tôi có thể giúp bạn tìm và đặt vé xe. Bạn muốn đi đâu?",
    sender: "bot",
    type: "text", // 'text' | 'seat_map'
  };

  const [messages, setMessages] = useState<any[]>([initialMessage]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (history) setSearchHistory(JSON.parse(history));
    } catch (error) {}
  };

  const saveToHistory = async (text: string) => {
    if (!text) return;
    try {
      let newHistory = [text, ...searchHistory.filter((item) => item !== text)];
      if (newHistory.length > 8) newHistory = newHistory.slice(0, 8);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {}
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (textToSend.trim().length === 0) return;

    // --- LOGIC MỚI: Chỉ lưu lịch sử nếu đây là tin nhắn đầu tiên của user ---
    // (messages.length === 1 vì lúc đầu chỉ có 1 tin bot chào)
    if (messages.length === 1) {
      saveToHistory(textToSend.trim());
    }

    const userMessage = {
      id: Math.random().toString(),
      text: textToSend,
      sender: "user",
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await api_ai_service.sendMessageToAI(
        userMessage.text,
        contextUser?.taiKhoanId,
        sessionId
      );

      if (!response.success) throw new Error(response.message);

      const rawReply = response.data?.reply || response.reply;

      // 1. TÁCH SƠ ĐỒ GHẾ (Code cũ giữ nguyên)
      let botText = rawReply;
      let seatMapData = null;
      if (rawReply.includes("<<<SEAT_MAP_DATA>>>")) {
        const parts = rawReply.split("<<<SEAT_MAP_DATA>>>");
        botText = parts[0].trim();
        const jsonPart = parts[1].split("<<<END_SEAT_MAP_DATA>>>")[0];
        try {
          seatMapData = JSON.parse(jsonPart);
        } catch (e) {}
      }

      // 2. [MỚI] TÁCH NÚT BẤM (Action Buttons)
      let actionData = null;
      // Lưu ý: botText ở đây là text đã được xử lý (hoặc chưa) từ bước trên
      if (botText.includes("<<<ACTION_BUTTONS>>>")) {
        const parts = botText.split("<<<ACTION_BUTTONS>>>");
        botText = parts[0].trim(); // Cập nhật lại lời thoại sạch
        const jsonPart = parts[1].split("<<<END_ACTION_BUTTONS>>>")[0];
        try {
          actionData = JSON.parse(jsonPart);
        } catch (e) {
          console.error(e);
        }
      }

      const botMessage = {
        id: Math.random().toString(),
        text: botText,
        sender: "bot",
        // Xác định type ưu tiên: nếu có seat map thì ưu tiên map, nếu có action thì action
        type: seatMapData ? "seat_map" : actionData ? "action_buttons" : "text",
        data: seatMapData || actionData, // Lưu data tương ứng
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Math.random().toString(),
        text: "Xin lỗi, tôi đang gặp sự cố kết nối.",
        sender: "bot",
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSeatFromMap = (seatCode: string) => {
    // Khi user bấm vào ghế trên sơ đồ -> Tự động chat "Tôi chọn ghế A1"
    handleSend(`Tôi chọn ghế ${seatCode}`);
  };

  useEffect(() => {
    if (flatListRef.current)
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";
    const isSeatMap = !isUser && item.type === "seat_map";
    // [MỚI] Check type action
    const isAction = !isUser && item.type === "action_buttons";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
          (isSeatMap || isAction) && styles.fullWidthMessage, // [SỬA] Cho phép cả Action cũng full width
        ]}
      >
        {isUser ? (
          <Text style={styles.userMessageText}>{item.text}</Text>
        ) : (
          <View style={isSeatMap || isAction ? { paddingHorizontal: 12 } : {}}>
            <Markdown style={markdownStyles}>{item.text}</Markdown>
          </View>
        )}

        {/* Render Sơ đồ ghế */}
        {!isUser && item.type === "seat_map" && item.data && (
          <SeatMapRender
            data={item.data}
            onSelectSeat={handleSelectSeatFromMap}
          />
        )}

        {/* [MỚI] Render Nút bấm */}
        {!isUser && item.type === "action_buttons" && item.data && (
          <ActionButtonsRender
            data={item.data}
            onAction={(val) => handleSend(val)} // Khi bấm nút -> Gửi text (Xác nhận/Hủy)
          />
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Header (Giữ nguyên) */}
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
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingText}>Trợ lý đang nhập...</Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* THANH GỢI Ý LỊCH SỬ (Chỉ hiện khi chưa loading) */}
          {!isLoading && searchHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyLabel}>Gợi ý:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {searchHistory.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.historyChip}
                    onPress={() => handleSend(item)}
                  >
                    <Text style={styles.historyChipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* INPUT (Giữ nguyên) */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhập yêu cầu..."
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                isLoading && styles.sendButtonDisabled,
              ]}
              onPress={() => handleSend()}
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

// ... (Giữ nguyên component AiChatbot)
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

// [NEW] Styles cho Markdown (Bot)
const markdownStyles = StyleSheet.create({
  body: {
    color: "#333",
    fontSize: 16,
  },
  strong: {
    fontWeight: "bold",
    color: "#000",
  },
  list_item_bullet: {
    color: "#333",
    fontSize: 16,
  },

  // Xử lý khoảng cách giữa các đoạn văn
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
});

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    // maxWidth: width * 0.85,
  },
  busTypeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  floorContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f0f2f5",
    borderRadius: 8,
    padding: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: { fontSize: 13, color: "#666" },
  tabTextActive: { fontSize: 13, color: "#4A90E2", fontWeight: "bold" },
  floorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
  },
  gridContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  seatGrid: {},
  seatRow: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "center",
  },
  seatPlaceholder: { width: 50, height: 50 },
  seatItem: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  seatAvailable: { backgroundColor: "white", borderColor: "#4A90E2" },
  seatBooked: { backgroundColor: "#f0f0f0", borderColor: "#e0e0e0" },
  seatSelected: { backgroundColor: "#4A90E2", borderColor: "#4A90E2" },
  seatText: { fontSize: 12, marginTop: 1, color: "#4A90E2", fontWeight: "600" },
  seatTextBooked: { color: "#999" },
  seatTextSelected: { color: "white" },
  chatbotContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  confirmButton: {
    marginTop: 12,
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontWeight: "bold", fontSize: 13 },
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
  closeButton: { padding: 8 },
  closeButtonText: { fontSize: 16, color: "#4A90E2" },
  chatList: { flex: 1, paddingHorizontal: 10 },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "85%",
  },
  fullWidthMessage: {
    maxWidth: "85%",
    width: "85%",
    padding: 0,
    borderWidth: 0,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userMessageText: { color: "white", fontSize: 16 },
  botMessageText: { color: "#333", fontSize: 16 },
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
  sendButtonDisabled: { backgroundColor: "#a0a0a0" },
  sendButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  historyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  historyLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 8,
    fontWeight: "600",
  },
  historyChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  historyChipText: {
    fontSize: 13,
    color: "#333",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Căn giữa các nút
    marginTop: 10,
    gap: 10, // Khoảng cách giữa 2 nút
    paddingBottom: 5,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0", // Màu mặc định (xám)
    minWidth: 100,
    alignItems: "center",
  },
  actionBtnPrimary: {
    backgroundColor: "#4A90E2", // Màu xanh (Xác nhận)
  },
  actionBtnDanger: {
    backgroundColor: "#FF5252", // Màu đỏ (Hủy)
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  actionBtnTextLight: {
    color: "white", // Chữ trắng cho nút màu đậm
  },
});
