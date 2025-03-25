import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { database } from "../../config/firebase";
import { ref, push, onValue } from "firebase/database";
import { set } from "firebase/database";
import { AuthContext } from "../../common/context/AuthContext";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId, user } = useContext(AuthContext);

  function writeUserData(userId, user, message) {
    database;
    set(ref(db, "users/" + userId), {
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      message: message,
    });
  }

  useEffect(() => {
    // Lấy dữ liệu từ Realtime Database
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data from Firebase:", data); // Log data from Firebase
      if (data) {
        const loadedMessages = Object.entries(data).map(([key, value]) => ({
          id: key,
          text: value.text,
        }));
        console.log("Loaded Messages:", loadedMessages); // Log loaded messages
        setMessages(loadedMessages);
      }
    });
  }, []);

  const sendMessage = () => {
    writeUserData(userId, user, message);
    if (message.trim() === "") return;

    // Lưu tin nhắn vào Realtime Database
    const messagesRef = ref(database, "messages");
    push(messagesRef, { text: message });
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.text}</Text>
        )}
      />

      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Nhập tin nhắn..."
        style={styles.input}
      />

      <Button title="Gửi" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  message: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    marginBottom: 5,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#ccc",
  },
});

export default ChatScreen;
