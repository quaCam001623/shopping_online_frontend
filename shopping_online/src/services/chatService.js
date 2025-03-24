import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "./baseService";
import apiService from "./apiService";

const endpoint = "/api/chats";

// export const getMessagesByUser = () => apiService.get(endpoint);
// export const updateMessage = (userId, data) =>
//   apiService.put(`${endpoint}/update/${userId}`, data);
// export const createMessage = (data) =>
//   apiService.post(`${endpoint}/create`, data);

// // Get chat history
export const getChatHistory = async (userId, token) => {
  try {
    // Ưu tiên sử dụng userId và token từ tham số
    if (!userId) {
      userId = await AsyncStorage.getItem("userId");
      token = await AsyncStorage.getItem("token");
    }

    // Nếu có token, dùng API yêu cầu xác thực
    if (token) {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/chats/current-user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Retrieved chat history with authentication");
        return response.data;
      } catch (error) {
        console.log(
          "Auth token failed for chat history, falling back to userId endpoint"
        );
      }
    }

    // Nếu không có token hoặc request thất bại, dùng endpoint không cần xác thực
    if (userId) {
      console.log("Getting chat history for userId:", userId);
      const response = await axios.get(
        `${SERVER_URL}/api/chats/history/${userId}`
      );
      return response.data;
    }

    throw new Error("No userId available to fetch chat history");
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return []; // Trả về mảng rỗng thay vì lỗi
  }
};

// Send a message
export const sendMessage = async (messageData, userId, token) => {
  try {
    // Ưu tiên sử dụng userId và token từ tham số
    if (!userId) {
      userId = await AsyncStorage.getItem("userId");
      token = await AsyncStorage.getItem("token");
    }

    // Nếu có token, dùng API yêu cầu xác thực
    if (token) {
      try {
        console.log("Attempting to send message with authentication");
        const response = await axios.post(
          `${SERVER_URL}/api/chats/message`,
          messageData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Message sent with authentication");
        return response.data;
      } catch (error) {
        console.log(
          "Auth token failed for sending message, falling back to userId endpoint"
        );
      }
    }

    // Nếu không có token hoặc request thất bại, dùng endpoint không cần xác thực
    if (userId) {
      console.log("Sending message without auth for userId:", userId);
      const response = await axios.post(
        `${SERVER_URL}/api/chats/message/${userId}`,
        messageData
      );
      console.log("Message sent without authentication");
      return response.data;
    }

    throw new Error("No userId available to send message");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (userId, token) => {
  try {
    // Ưu tiên sử dụng userId và token từ tham số
    if (!userId) {
      userId = await AsyncStorage.getItem("userId");
      token = await AsyncStorage.getItem("token");
    }

    if (!token) {
      console.log("No token available to mark messages as read");
      return { success: false };
    }

    const response = await axios.put(
      `${SERVER_URL}/api/chats/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false };
  }
};

// Get unread message count
export const getUnreadCount = async (userId, token) => {
  try {
    // Ưu tiên sử dụng userId và token từ tham số
    if (!userId) {
      userId = await AsyncStorage.getItem("userId");
      token = await AsyncStorage.getItem("token");
    }

    if (!token) {
      console.log("No token available to get unread count");
      return 0;
    }

    const response = await axios.get(`${SERVER_URL}/api/chats/unread/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.unreadCount;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};
