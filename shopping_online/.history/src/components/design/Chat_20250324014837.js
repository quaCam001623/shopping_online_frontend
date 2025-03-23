import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import io from "socket.io-client";

// Địa chỉ socket
const socket = io("http://localhost:9999"); // Android Emulator dùng 10.0.2.2

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Đóng" onPress={() => setError(null)} />
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={({ item }) => {
          return (
            <Text style={styles.message}>
              {item.id === socket.id ? "Bạn" : item.sender}: {item.content}
            </Text>
          );
        }}
        keyExtractor={(item) => item._key || `fallback-${Math.random()}`}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "#c62828",
    marginBottom: 5,
  },
});

export default Chat;
