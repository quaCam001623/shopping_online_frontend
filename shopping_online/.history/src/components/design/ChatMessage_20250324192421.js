// ChatScreen.js
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { AuthContext } from "../../common/context/AuthContext";
import {
  createChatMessage,
  getChatMessages,
} from "../../services/chatMessageService";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIMARY_COLOR } from "../../utils/enums";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const { userId, user } = useContext(AuthContext);
  const flatListRef = useRef(null);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChatMessages(userId);

      // Group messages by conversation
      const userMessages = response.filter(
        (message) =>
          message.userId === userId ||
          (message.sender === "admin" && message.userId === userId)
      );

      setMessages(userMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Format timestamp to readable format
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, []);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!text.trim()) return;

    try {
      setSending(true);
      setError(null);

      const newMessage = {
        userId,
        username: `${user.firstName} ${user.lastName}`,
        sender: "user",
        text: text.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };

      await createChatMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setText("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  }, [text, userId, user, scrollToBottom]);

  // Render message
  const renderMessage = useCallback(
    ({ item }) => {
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
                isUserMessage
                  ? styles.userMessageText
                  : styles.adminMessageText,
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
    },
    [formatTime]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

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
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start a conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={styles.input}
            multiline
            disabled={sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

ChatScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
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
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
});

export default ChatScreen;
