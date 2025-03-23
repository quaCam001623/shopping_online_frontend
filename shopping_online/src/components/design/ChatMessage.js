// ChatScreen.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../../common/context/AuthContext";
import {
  createChatMessage,
  getChatMessages,
} from "../../services/chatMessageService";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { userId, user } = useContext(AuthContext);

  // Lấy dữ liệu tin nhắn từ API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getChatMessages(userId);

        // Group messages by conversation
        const userMessages = response.filter(
          (message) =>
            // Only show messages that belong to current user or are from admin to current user
            message.userId === userId ||
            (message.sender === "admin" && message.userId === userId)
        );

        setMessages(userMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Gửi tin nhắn mới
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMessage = {
      userId,
      username: `${user.firstName} ${user.lastName}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      await createChatMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Hiển thị tin nhắn
  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.adminMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userBubble : styles.adminBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : styles.adminMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.sender}>
            {isUserMessage ? item.username : "Admin"}
          </Text>
          {item.timestamp && (
            <Text style={styles.timestamp}>
              {formatTime(item.timestamp)}
              {isUserMessage && (
                <Text style={styles.readStatus}>
                  {" "}
                  · {item.read ? "Read" : "Delivered"}
                </Text>
              )}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Support</Text>
      </View> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start a conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted={false}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !text.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!text.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  adminMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#3485ff",
  },
  adminBubble: {
    backgroundColor: "#e6e6e6",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#fff",
  },
  adminMessageText: {
    color: "#333",
  },
  messageInfo: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sender: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  readStatus: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  sendButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#3485ff",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ChatScreen;
