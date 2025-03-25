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
    if (!userId || !user) {
      console.error("User ID or user data is missing");
      return;
    }
    console.log("Writing user data:", userId, user, message);
    const chatId = `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    set(ref(database, "chats/" + chatId), {
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      message: message,
    }).catch((error) => {
      console.error("Error writing to Firebase:", error);
    });
  }

  useEffect(() => {
    // Fetch data from the correct path in Realtime Database
    const messagesRef = ref(database, "chats/");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data from Firebase:", data); // Log data from Firebase
      if (data) {
        const loadedMessages = Object.entries(data).map(([key, value]) => ({
          id: key,
          text: value.message,
          email: value.email,
          username: value.username,
          admin: value["admin-replies"],
        }));
        console.log("Loaded Messages:", loadedMessages); // Log loaded messages
        setMessages(loadedMessages);
      }
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    writeUserData(userId, user, message);
    // // Save message to the correct path in Realtime Database
    // const messagesRef = ref(database, "messages/");
    // push(messagesRef, { text: message })
    //   .then(() => {
    //     console.log("Message sent successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Error sending message to Firebase:", error);
    //   });
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
