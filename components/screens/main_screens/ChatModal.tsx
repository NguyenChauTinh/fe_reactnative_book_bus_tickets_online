import { useAuth } from "@/contexts/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Api_Auth_Customer } from "../../../apis/api_auth";

import {
  ActivityIndicator,
  Alert,
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
import { useAnalytics } from "../../../contexts/BookingAnalyticsContext";

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
  const [activeTab, setActiveTab] = useState<string>("");

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

  const floors = processedLayout.reduce((acc: any, item: any) => {
    const rawFloor = item.tang ? String(item.tang) : "chung";
    const displayFloor = floorMapping[rawFloor] || rawFloor;
    if (!acc[rawFloor]) acc[rawFloor] = { title: displayFloor, seats: [] };
    acc[rawFloor].seats.push(item);
    return acc;
  }, {});

  const sortedFloorKeys = Object.keys(floors).sort((a, b) => {
    if (a === "lower" || a === "1") return -1;
    if (b === "lower" || b === "1") return 1;
    return 0;
  });

  useEffect(() => {
    if (sortedFloorKeys.length > 0 && activeTab === "") {
      setActiveTab(sortedFloorKeys[0]);
    }
  }, [sortedFloorKeys]);

  const handleToggleSeat = (seatCode: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatCode)) {
        return prev.filter((s) => s !== seatCode);
      } else {
        return [...prev, seatCode];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    const seatString = selectedSeats.join(", ");
    onSelectSeat(`Tôi chọn ghế ${seatString}`);
  };

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
              const isSelected = selectedSeats.includes(seat.maSoGhe);
              const shortName = seat.maSoGhe.split("(")[0];

              return (
                <TouchableOpacity
                  key={seat.maSoGhe}
                  style={[
                    styles.seatItem,
                    isBooked ? styles.seatBooked : styles.seatAvailable,
                    isSelected && styles.seatSelected,
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
      <View style={styles.gridContainer}>
        {activeTab !== "" && renderGrid(activeTab)}
      </View>
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
  const { startTracking, logStep, endTracking } = useAnalytics();
  const { user: contextUser } = useAuth();

  const initialMessage = {
    id: "1",
    text: "Xin chào! Tôi có thể giúp bạn tìm và đặt vé xe. Bạn muốn đi đâu?",
    sender: "bot",
    type: "text",
  };

  const [messages, setMessages] = useState<any[]>([initialMessage]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState(() =>
    Math.random().toString(36).substring(2)
  );
  const flatListRef = useRef<FlatList>(null);

  const [otpVisible, setOtpVisible] = useState(false); // Hiển thị Modal OTP
  const [otpCode, setOtpCode] = useState(new Array(6).fill("")); // Mảng 6 số
  const [phoneToVerify, setPhoneToVerify] = useState(""); // SĐT cần xác thực
  const [verifying, setVerifying] = useState(false); // Loading khi xác thực
  const inputRefs = useRef<Array<TextInput | null>>([]); // Ref cho ô nhập OTP
  const [pendingActionValue, setPendingActionValue] = useState<string | null>(
    null
  ); // Lưu hành động "Xác nhận" để chạy sau khi OTP xong

  const extractPhoneFromLastMessage = () => {
    // Tìm tin nhắn bot cuối cùng
    const lastBotMsg = [...messages].reverse().find((m) => m.sender === "bot");
    if (!lastBotMsg) return null;

    // Regex tìm SĐT VN (84 hoặc 0 + 9 số)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    const match = lastBotMsg.text.match(phoneRegex);
    return match ? match[0] : null;
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Tự động verify khi đủ 6 số
    if (index === 5 && text.length === 1) {
      // Gom code lại để gọi verify (chúng ta dùng useEffect hoặc gọi trực tiếp ở đây)
      const fullCode = newOtp.join("");
      // Gọi verify ngay (cần xử lý async cẩn thận)
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      otpCode[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otpCode];
      newOtp[index - 1] = "";
      setOtpCode(newOtp);
    }
  };

  // Hàm Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otpCode.join("");
    if (otpString.length < 6) return;

    setVerifying(true);
    try {
      const response = await Api_Auth_Customer.verifyOtpCus({
        soDienThoai: phoneToVerify,
        otp: otpString,
      });

      const isSuccess =
        response?.data?.success ||
        response?.success ||
        response?.status === 200;

      if (isSuccess) {
        setOtpVisible(false);
        setOtpCode(new Array(6).fill(""));
        Alert.alert("Thành công", "Xác thực số điện thoại thành công!");

        // QUAN TRỌNG: Tiếp tục gửi tin nhắn "Xác nhận" cho Bot
        if (pendingActionValue) {
          handleSend(pendingActionValue);
          setPendingActionValue(null);
        }
      } else {
        Alert.alert("Lỗi", "Mã OTP không đúng.");
        setOtpCode(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setVerifying(false);
    }
  };

  const handleActionPress = async (value: string) => {
    // Chỉ chặn khi user bấm "Xác nhận" (Value này phải khớp với backend trả về)
    // Backend của bạn trả về: value: "Xác nhận"
    if (value === "Xác nhận") {
      const detectedPhone = extractPhoneFromLastMessage();

      if (!detectedPhone) {
        // Không tìm thấy sđt trong tin nhắn -> Cho qua luôn (hoặc báo lỗi tùy logic)
        handleSend(value);
        return;
      }

      // 1. Kiểm tra: SĐT có trùng với User đang đăng nhập không?
      if (contextUser && contextUser.soDienThoai === detectedPhone) {
        // Trùng khớp -> Không cần OTP -> Gửi luôn
        handleSend(value);
        return;
      }

      // 2. Nếu không trùng -> Yêu cầu OTP
      setPhoneToVerify(detectedPhone);
      setPendingActionValue(value); // Lưu hành động để thực hiện sau khi OTP xong

      try {
        // Gọi API gửi OTP
        const res = await Api_Auth_Customer.requestOtpCus({
          soDienThoai: detectedPhone,
        });
        const isSuccess =
          res?.data?.success || res?.success || res?.status === 200;

        if (isSuccess) {
          setOtpVisible(true); // Mở Modal OTP
        } else {
          Alert.alert("Lỗi", "Không thể gửi OTP đến số " + detectedPhone);
        }
      } catch (err) {
        Alert.alert("Lỗi", "Lỗi kết nối khi gửi OTP.");
      }
    } else {
      // Các nút khác (Hủy, Sửa...) -> Gửi bình thường
      handleSend(value);
    }
  };

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

  // [ĐÃ SỬA] Hàm xử lý Refresh ngay lập tức, không Alert
  const handleRefresh = () => {
    setMessages([initialMessage]);
    setSessionId(Math.random().toString(36).substring(2));
    setInputText("");
    endTracking(false);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (textToSend.trim().length === 0) return;

    if (messages.length === 1) {
      startTracking("AI_CHATBOT");
      saveToHistory(textToSend.trim());
    }

    logStep();

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

      if (
        rawReply.toLowerCase().includes("đặt vé thành công") ||
        rawReply.toLowerCase().includes("tôi đã đặt vé thành công")
      ) {
        endTracking(true);
      }

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

      let actionData = null;
      if (botText.includes("<<<ACTION_BUTTONS>>>")) {
        const parts = botText.split("<<<ACTION_BUTTONS>>>");
        botText = parts[0].trim();
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
        type: seatMapData ? "seat_map" : actionData ? "action_buttons" : "text",
        data: seatMapData || actionData,
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
    handleSend(`Tôi chọn ghế ${seatCode}`);
  };

  useEffect(() => {
    if (flatListRef.current)
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === "user";
    const isSeatMap = !isUser && item.type === "seat_map";
    const isAction = !isUser && item.type === "action_buttons";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
          (isSeatMap || isAction) && styles.fullWidthMessage,
        ]}
      >
        {isUser ? (
          <Text style={styles.userMessageText}>{item.text}</Text>
        ) : (
          <View style={isSeatMap || isAction ? { paddingHorizontal: 12 } : {}}>
            <Markdown style={markdownStyles}>{item.text}</Markdown>
          </View>
        )}

        {!isUser && item.type === "seat_map" && item.data && (
          <SeatMapRender
            data={item.data}
            onSelectSeat={handleSelectSeatFromMap}
          />
        )}

        {!isUser && item.type === "action_buttons" && item.data && (
          <ActionButtonsRender
            data={item.data}
            onAction={(val) => handleActionPress(val)}
          />
        )}
      </View>
    );
  };

  const handleCloseModal = () => {
    endTracking(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Header có nút Refresh */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trợ lý đặt xe</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleRefresh}
              style={[styles.closeButton, { marginRight: 8 }]}
            >
              <AntDesign name="reload" size={22} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={otpVisible}
          onRequestClose={() => setOtpVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Xác thực SĐT</Text>
              <Text style={styles.modalSubText}>
                Nhập mã OTP gửi đến {phoneToVerify}
              </Text>

              <View style={styles.otpContainer}>
                {otpCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[styles.otpBox, digit !== "" && styles.otpBoxFilled]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => {
                    setOtpVisible(false);
                    setPendingActionValue(null);
                  }}
                >
                  <Text style={styles.modalBtnTextCancel}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnConfirm]}
                  onPress={handleVerifyOtp}
                  disabled={verifying}
                >
                  {verifying ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.modalBtnTextConfirm}>Xác nhận</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

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

const markdownStyles = StyleSheet.create({
  body: { color: "#333", fontSize: 16 },
  strong: { fontWeight: "bold", color: "#000" },
  list_item_bullet: { color: "#333", fontSize: 16 },
  paragraph: { marginTop: 0, marginBottom: 8 },
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
  },
  busTypeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  floorContainer: { marginRight: 15, alignItems: "center" },
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
  seatRow: { flexDirection: "row", marginBottom: 8, justifyContent: "center" },
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
  modalContainer: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
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
  userMessage: { alignSelf: "flex-end", backgroundColor: "#4A90E2" },
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
  historyChipText: { fontSize: 13, color: "#333" },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
    paddingBottom: 5,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    minWidth: 100,
    alignItems: "center",
  },
  actionBtnPrimary: { backgroundColor: "#4A90E2" },
  actionBtnDanger: { backgroundColor: "#FF5252" },
  actionBtnText: { fontSize: 14, fontWeight: "600", color: "#333" },
  actionBtnTextLight: { color: "white" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Tối hơn chút để nổi bật trên nền chat
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 5, // Thêm gap nhỏ
  },
  otpBox: {
    width: 40, // Nhỏ hơn chút cho vừa Modal
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  otpBoxFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  modalBtnCancel: { backgroundColor: "#f5f5f5" },
  modalBtnConfirm: { backgroundColor: "#007AFF" },
  modalBtnTextCancel: { color: "#333", fontWeight: "bold" },
  modalBtnTextConfirm: { color: "white", fontWeight: "bold" },
});
