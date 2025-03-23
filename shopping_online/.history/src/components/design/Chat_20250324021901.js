import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllChatMessages,
  createChatMessage,
  getChatMessages,
} from "../../services/chatMessageService";
import { SERVER_URL } from "../../services/baseService";
import { AuthContext } from "../../common/context/AuthContext";

// Địa chỉ socket
const socket = io(SERVER_URL); // Android Emulator dùng 10.0.2.2
const MESSAGES_STORAGE_KEY = "user_chat_messages";

// Lấy thông tin người dùng hiện tại từ AsyncStorage
const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const { userId, user } = useContext(AuthContext);

  console.log("userId", userId);
  console.log("user", user);

  // Lấy tin nhắn từ API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Sử dụng chatMessageService để lấy tin nhắn
      const data = await getChatMessages(userId);
      console.log("Dữ liệu tin nhắn từ API:", JSON.stringify(data));

      if (Array.isArray(data)) {
        const formattedMessages = data.map((msg, index) => ({
          content: msg.text,
          sender: msg.username || msg.sender,
          id: msg.userId,
          timestamp: msg.timestamp,
          _key: msg._id || `api-msg-${index}-${Date.now()}`,
        }));

        setMessages(formattedMessages);

        // Cuộn xuống dưới sau khi tải tin nhắn
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn từ API:", err);
      setError(`Không thể tải tin nhắn: ${err?.message || "Lỗi kết nối"}`);

      // Nếu không thể kết nối API, tải tin nhắn từ bộ nhớ cục bộ
      loadMessagesFromStorage().then((savedMessages) => {
        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages);
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 200);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Lưu tin nhắn xuống bộ nhớ cục bộ
  const saveMessagesToStorage = async (updatedMessages) => {
    try {
      await AsyncStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn:", error);
    }
  };

  // Tải tin nhắn từ bộ nhớ cục bộ
  const loadMessagesFromStorage = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn từ bộ nhớ cục bộ:", error);
      return [];
    }
  };

  useEffect(() => {
    // Tải tin nhắn từ API khi component mount
    fetchMessages();

    // Xử lý kết nối socket
    socket.on("connect", () => {
      console.log("Đã kết nối Socket.io:", socket.id);
    });

    // Xử lý nhận messages ban đầu
    socket.on("load messages", (msgs) => {
      try {
        console.log("Dữ liệu nhận được từ server:", JSON.stringify(msgs));

        if (!Array.isArray(msgs)) {
          console.error("Dữ liệu không phải mảng:", typeof msgs);
          return;
        }

        const formattedMsgs = msgs.map((msg, index) => {
          const formattedMsg = safeFormatMessage(msg, index);
          return formattedMsg;
        });

        setMessages(formattedMsgs);

        // Cuộn xuống dưới sau khi tải tin nhắn
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      } catch (err) {
        console.error("Lỗi khi xử lý tin nhắn ban đầu:", err);
        setError("Lỗi khi tải tin nhắn");
      }
    });

    // Xử lý nhận message mới
    socket.on("chat message", (msg) => {
      try {
        console.log("Tin nhắn mới từ server:", JSON.stringify(msg));

        // Kiểm tra nếu là tin nhắn người dùng đã gửi từ thiết bị này
        // Nếu tin nhắn này có cùng nội dung và thời gian gần với tin nhắn cuối cùng
        // thì không thêm vào để tránh trùng lặp
        const formattedMsg = safeFormatMessage(msg, messages.length);

        setMessages((prevMessages) => {
          // Kiểm tra xem tin nhắn có bị trùng không
          const lastMsg = prevMessages[prevMessages.length - 1];

          // Nếu đã có tin nhắn cục bộ với cùng nội dung gần đây (trong vòng 5 giây)
          if (
            lastMsg &&
            lastMsg.isLocalMessage &&
            lastMsg.content === formattedMsg.content &&
            new Date(formattedMsg.timestamp) - new Date(lastMsg.timestamp) <
              5000
          ) {
            return prevMessages; // Không thêm tin nhắn trùng
          }

          return [...prevMessages, formattedMsg];
        });

        // Cuộn xuống dưới khi có tin nhắn mới
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (err) {
        console.error("Lỗi khi xử lý tin nhắn mới:", err);
        setError("Lỗi khi nhận tin nhắn mới");
      }
    });

    // Xử lý lỗi socket
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("Lỗi kết nối: " + err.message);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("load messages");
      socket.off("chat message");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  // Hàm an toàn để định dạng tin nhắn
  const safeFormatMessage = (msg, index) => {
    try {
      if (typeof msg === "string") {
        return {
          content: msg,
          sender: "Người dùng",
          id: null,
          timestamp: new Date().toISOString(),
          _key: `msg-str-${index}-${Date.now()}`,
        };
      }

      if (typeof msg === "object" && msg !== null) {
        // Kiểm tra nếu content chứa một đối tượng tin nhắn đầy đủ (trường hợp lồng nhau)
        if (
          msg.content &&
          typeof msg.content === "object" &&
          msg.content.content
        ) {
          return {
            content: String(msg.content.content),
            sender: msg.content.sender || "Người dùng",
            id: msg.content.id || msg.id || null,
            timestamp: msg.content.timestamp || new Date().toISOString(),
            _key: `msg-nested-${index}-${Date.now()}`,
          };
        }

        // Xử lý tin nhắn thông thường
        let content = "";
        if (typeof msg.content === "string") {
          content = msg.content;
        } else if (msg.content !== undefined) {
          content = String(msg.content);
        } else {
          content = "[Nội dung không hỗ trợ]";
        }

        return {
          content: content,
          sender: msg.sender || "Người dùng",
          id: msg.id || null,
          timestamp: msg.timestamp || new Date().toISOString(),
          _key: `msg-obj-${index}-${Date.now()}`,
        };
      }

      return {
        content: "Tin nhắn không hợp lệ",
        sender: "Hệ thống",
        id: null,
        timestamp: new Date().toISOString(),
        _key: `msg-inv-${index}-${Date.now()}`,
      };
    } catch (err) {
      console.error("Lỗi định dạng tin nhắn:", err, msg);
      return {
        content: "Lỗi xử lý tin nhắn",
        sender: "Hệ thống",
        id: null,
        timestamp: new Date().toISOString(),
        _key: `msg-err-${index}-${Date.now()}`,
      };
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        // Tạo đối tượng tin nhắn
        const newMessage = {
          text: message,
          sender: "user",
          username: `${user.firstName} ${user.lastName}`,
          userId: user._id,
          timestamp: new Date().toISOString(),
        };

        // Tạo tin nhắn cục bộ để hiển thị ngay
        const localMessage = {
          content: message,
          sender: `${user.firstName} ${user.lastName}`,
          id: user._id, // Sử dụng user._id thay vì socket.id để phân biệt
          timestamp: new Date().toISOString(),
          _key: `msg-local-${Date.now()}`,
          isLocalMessage: true, // Đánh dấu tin nhắn cục bộ
        };

        // Cập nhật UI trước
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, localMessage];
          saveMessagesToStorage(updatedMessages);
          return updatedMessages;
        });

        // Gửi tin nhắn qua socket
        socket.emit("chat message", message);

        // Gửi tin nhắn lên API sử dụng chatMessageService
        const response = await createChatMessage(newMessage);

        if (!response) {
          throw new Error("Không thể lưu tin nhắn lên máy chủ");
        }

        // Reset input
        setMessage("");

        // Cuộn xuống khi gửi tin nhắn
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
        setError(`Không thể gửi tin nhắn: ${err?.message || "Lỗi kết nối"}`);
      }
    }
  };

  // Format thời gian hiển thị
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  // Render từng tin nhắn
  const renderMessage = ({ item }) => {
    // Kiểm tra nếu là tin nhắn của người dùng hiện tại
    const isMyMessage = item.id === user._id || item.isLocalMessage;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {!isMyMessage && <Text style={styles.senderName}>{item.sender}</Text>}

        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>

        <Text
          style={[
            styles.timestamp,
            isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Trò chuyện</Text>
        </View> */}

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._key || `fallback-${Math.random()}`}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#4a6da7",
    padding: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 15,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  senderName: {
    color: "#666",
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 2,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessageBubble: {
    backgroundColor: "#4a6da7",
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    color: "#999",
  },
  myTimestamp: {
    alignSelf: "flex-end",
    marginRight: 5,
  },
  otherTimestamp: {
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: "#c62828",
    fontSize: 20,
    fontWeight: "bold",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    color: "#333",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4a6da7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  loadingText: {
    color: "#1976d2",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Chat;
