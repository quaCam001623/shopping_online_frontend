import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createChatMessage,
  getChatMessages,
} from "../../services/chatMessageService";
import { SERVER_URL } from "../../services/baseService";
import { AuthContext } from "../../common/context/AuthContext";
import { PRIMARY_COLOR } from "../../utils/enums";
import { db } from "../../config/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Define the storage key
const MESSAGES_STORAGE_KEY = "user_chat_messages";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const flatListRef = useRef(null);
  const { userId, user } = useContext(AuthContext);

  console.log("userId", userId);
  // console.log("user", user);

  // Fetch messages from Firestore
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, "messages"), orderBy("timestamp"));
      const snapshot = await getDocs(q);
      const formattedMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }));

      setMessages(formattedMessages);
      await saveMessagesToStorage(formattedMessages);
    } catch (err) {
      console.error("Error fetching messages from Firestore:", err);
      setError(`Cannot load messages: ${err?.message || "Connection error"}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Listen for new messages in Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formattedMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }));

      setMessages(formattedMessages);
      saveMessagesToStorage(formattedMessages);
    });

    return () => unsubscribe();
  }, []);

  // Send message to Firestore
  const sendMessage = async () => {
    if (message.trim()) {
      try {
        setSending(true);
        const newMessage = {
          text: message,
          username: `${user.firstName} ${user.lastName}`,
          userId: user._id,
          sender: "user",
          timestamp: serverTimestamp(),
          read: false,
        };

        await addDoc(collection(db, "messages"), newMessage);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        setError(`Cannot send message: ${err?.message || "Connection error"}`);
      } finally {
        setSending(false);
      }
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

  // Hiển thị ngày
  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  // Kiểm tra xem có cần hiển thị ngày không
  const shouldShowDate = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();

    return currentDate !== prevDate;
  };

  // Render header ngày
  const renderDateHeader = (date) => {
    return (
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
    );
  };

  // Render message
  const renderMessage = useCallback(
    ({ item, index }) => {
      const isUserMessage = item.sender === "user";
      const prevMsg = index > 0 ? messages[index - 1] : null;
      const showDate = shouldShowDate(item, prevMsg);

      return (
        <>
          {showDate && renderDateHeader(item.timestamp)}
          <View
            style={[
              styles.messageContainer,
              isUserMessage
                ? styles.userMessageContainer
                : styles.adminMessageContainer,
            ]}
          >
            {!isUserMessage && (
              <Text style={styles.senderName}>{item.username}</Text>
            )}
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
                {item.text || ""}
              </Text>
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.timestamp}>
                {formatTime(item.timestamp)}
                {isUserMessage && (
                  <Text style={styles.readStatus}>
                    {" "}
                    · {item.read ? "Read" : "Delivered"}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </>
      );
    },
    [messages]
  );

  // Hàm cuộn xuống cuối
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

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

        {loading && messages.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
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

        {messages.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start a conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) =>
              item._id || item._key || Math.random().toString()
            }
            renderItem={renderMessage}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchMessages}
                colors={[PRIMARY_COLOR]}
                tintColor={PRIMARY_COLOR}
              />
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={styles.input}
            multiline
            disabled={sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim() || sending}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
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
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  adminMessageContainer: {
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 2,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "100%",
  },
  userBubble: {
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: "#E8E8E8",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  adminMessageText: {
    color: "#000000",
  },
  messageInfo: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#666666",
  },
  readStatus: {
    fontSize: 12,
    color: "#666666",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#666666",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
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
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#1976d2",
    fontSize: 14,
    marginTop: 10,
  },
  loadingMoreContainer: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingMoreText: {
    marginLeft: 8,
    color: "#666666",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
    paddingBottom: 15,
  },
});

export default Chat;
