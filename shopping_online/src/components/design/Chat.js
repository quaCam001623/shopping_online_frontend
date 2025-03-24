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
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createChatMessage,
  getChatMessages,
} from "../../services/chatMessageService";
import { SERVER_URL } from "../../services/baseService";
import { AuthContext } from "../../common/context/AuthContext";
import { PRIMARY_COLOR } from "../../utils/enums";

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
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const flatListRef = useRef(null);
  const { userId, user } = useContext(AuthContext);

  console.log("userId", userId);
  // console.log("user", user);

  // Lấy tin nhắn từ API
  const fetchMessages = useCallback(
    async (pageNum = 1, refresh = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        }
        setError(null);

        // Lấy tin nhắn từ API với phân trang
        // Giả sử API hỗ trợ phân trang với tham số page và limit
        const data = await getChatMessages(userId);
        console.log("data", data);
        if (Array.isArray(data)) {
          const formattedMessages = data.map((msg) => ({
            text: msg.text || "",
            username: msg.username || "",
            userId: msg.userId,
            sender: msg.sender || "user",
            timestamp: msg.timestamp,
            read: msg.read || false,
            _id: msg._id,
          }));

          // Cập nhật danh sách tin nhắn
          if (pageNum === 1 || refresh) {
            setMessages(formattedMessages);
          } else {
            // Nối tin nhắn cũ vào đầu danh sách
            setMessages((prevMessages) => [
              ...formattedMessages,
              ...prevMessages,
            ]);
          }

          // Kiểm tra xem còn tin nhắn cũ hơn không
          setHasMoreMessages(formattedMessages.length === 20);

          // Lưu tin nhắn vào bộ nhớ cục bộ khi tải từ API
          if (pageNum === 1) {
            await saveMessagesToStorage(formattedMessages);
          }
        } else {
          setHasMoreMessages(false);
        }
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn từ API:", err);
        setError(`Không thể tải tin nhắn: ${err?.message || "Lỗi kết nối"}`);

        // Nếu là lần đầu tiên tải, thử tải từ bộ nhớ cục bộ
        if (pageNum === 1) {
          const savedMessages = await loadMessagesFromStorage();
          if (savedMessages && savedMessages.length > 0) {
            setMessages(savedMessages);
          }
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  // Hàm để tải thêm tin nhắn cũ hơn
  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  }, [fetchMessages, hasMoreMessages, loading, page, refreshing]);

  // Hàm làm mới danh sách tin nhắn
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchMessages(1, true);
  }, [fetchMessages]);

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
    fetchMessages(1);

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

        // Lưu tin nhắn vào bộ nhớ cục bộ khi nhận từ socket
        saveMessagesToStorage(formattedMsgs);

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

        // Kiểm tra nếu tin nhắn rỗng hoặc không hợp lệ
        if (!msg || !msg.text) {
          console.log("Bỏ qua tin nhắn không hợp lệ:", msg);
          return;
        }

        // Kiểm tra nếu là tin nhắn trùng lặp (có thể là echo từ server)
        const lastMsg = messages[messages.length - 1];
        if (
          lastMsg &&
          lastMsg.text === msg.text &&
          lastMsg.userId === msg.userId &&
          new Date(msg.timestamp) - new Date(lastMsg.timestamp) < 5000
        ) {
          console.log("Bỏ qua tin nhắn trùng lặp:", msg);
          return;
        }

        // Chỉ thêm tin nhắn từ người khác hoặc từ server/admin
        if (msg.sender === "admin" || msg.userId !== user._id) {
          // Format tin nhắn để đảm bảo có đủ các trường
          const formattedMsg = {
            text: msg.text || "",
            username: msg.username || "Admin",
            userId: msg.userId,
            sender: msg.sender || "admin",
            timestamp: msg.timestamp || new Date().toISOString(),
            read: false,
            _id: msg._id || `socket-${Date.now()}`,
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, formattedMsg];
            // Lưu tin nhắn vào bộ nhớ cục bộ khi nhận tin nhắn mới
            saveMessagesToStorage(updatedMessages);
            return updatedMessages;
          });

          // Cuộn xuống dưới khi có tin nhắn mới
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
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
          text: msg,
          sender: "user",
          userId: user?._id,
          timestamp: new Date().toISOString(),
          _id: `msg-str-${index}-${Date.now()}`,
        };
      }

      if (typeof msg === "object" && msg !== null) {
        // Trường hợp API trả về text thay vì content
        const text =
          msg.text ||
          (msg.content ? String(msg.content) : "[Nội dung không hỗ trợ]");
        const sender = msg.sender || "user";

        return {
          text: text,
          username:
            msg.username ||
            (sender === "admin"
              ? "Admin"
              : user?.firstName + " " + user?.lastName),
          userId: msg.userId || user?._id,
          sender: sender,
          timestamp: msg.timestamp || new Date().toISOString(),
          read: msg.read || false,
          _id: msg._id || `msg-obj-${index}-${Date.now()}`,
        };
      }

      return {
        text: "Tin nhắn không hợp lệ",
        sender: "admin",
        userId: null,
        timestamp: new Date().toISOString(),
        _id: `msg-inv-${index}-${Date.now()}`,
      };
    } catch (err) {
      console.error("Lỗi định dạng tin nhắn:", err, msg);
      return {
        text: "Lỗi xử lý tin nhắn",
        sender: "admin",
        userId: null,
        timestamp: new Date().toISOString(),
        _id: `msg-err-${index}-${Date.now()}`,
      };
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        setSending(true);
        // Tạo đối tượng tin nhắn
        const newMessage = {
          text: message,
          username: `${user.firstName} ${user.lastName}`,
          userId: user._id,
          sender: "user",
          timestamp: new Date().toISOString(),
          read: false,
        };

        // Cập nhật UI trước
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          saveMessagesToStorage(updatedMessages);
          return updatedMessages;
        });

        // Gửi tin nhắn qua socket
        socket.emit("chat message", newMessage);

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
      } finally {
        setSending(false);
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
                onRefresh={onRefresh}
                colors={[PRIMARY_COLOR]}
                tintColor={PRIMARY_COLOR}
              />
            }
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loading && messages.length > 0 ? (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                  <Text style={styles.loadingMoreText}>
                    Đang tải thêm tin nhắn...
                  </Text>
                </View>
              ) : null
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
