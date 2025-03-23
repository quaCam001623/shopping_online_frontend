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
      setMessages(msgs);
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
          // Ensure item is properly handled whether it's an object or string
          const sender =
            item?.id === socket.id ? "Bạn" : item?.sender || "Người dùng";
          const content =
            typeof item === "string"
              ? item
              : item?.content || JSON.stringify(item);

          return (
            <Text style={styles.message}>
              {sender}: {content}
            </Text>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
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
