import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";

const socket = io("http://localhost:9999"); // Android Emulator dùng 10.0.2.2

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Đã kết nối Socket.io:", socket.id);
    });

    socket.on("load messages", (msgs) => {
      console.log("Dữ liệu nhận được từ server:", msgs);
      // Ensure each message is in a consistent format
      const formattedMsgs = Array.isArray(msgs) ? msgs.map(formatMessage) : [];
      setMessages(formattedMsgs);
    });

    socket.on("chat message", (msg) => {
      console.log("Nhận tin nhắn mới:", msg);
      // Format the incoming message
      const formattedMsg = formatMessage(msg);
      setMessages((prevMessages) => [...prevMessages, formattedMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper function to ensure consistent message format
  const formatMessage = (msg) => {
    if (typeof msg === "string") {
      return {
        content: msg,
        sender: "Người dùng",
        id: null,
        timestamp: new Date().toISOString(),
      };
    } else if (typeof msg === "object" && msg !== null) {
      return {
        content: msg.content || JSON.stringify(msg),
        sender: msg.sender || "Người dùng",
        id: msg.id || null,
        timestamp: msg.timestamp || new Date().toISOString(),
      };
    } else {
      return {
        content: "Tin nhắn không hợp lệ",
        sender: "Hệ thống",
        id: null,
        timestamp: new Date().toISOString(),
      };
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          return (
            <Text style={styles.message}>
              {item.id === socket.id ? "Bạn" : item.sender}: {item.content}
            </Text>
          );
        }}
        keyExtractor={(item, index) =>
          `msg-${index}-${item.timestamp || Date.now()}`
        }
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
});

export default App;
