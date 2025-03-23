import React, { useState, useEffect, useRef } from "react";
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

// Địa chỉ socket
const socket = io("http://localhost:9999"); // Android Emulator dùng 10.0.2.2

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
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

        const formattedMsg = safeFormatMessage(msg, messages.length);
        setMessages((prevMessages) => [...prevMessages, formattedMsg]);

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

  const sendMessage = () => {
    if (message.trim()) {
      try {
        socket.emit("chat message", message);
        setMessage("");
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
        setError("Không thể gửi tin nhắn");
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
    const isMyMessage = item.id === socket.id;

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trò chuyện</Text>
        </View>

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
});

export default Chat;
