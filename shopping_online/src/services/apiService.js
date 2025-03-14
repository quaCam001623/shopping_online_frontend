import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "./baseService";

const api = axios.create({
  // baseURL: "http://localhost:9999", // Thay bằng URL của server
  baseURL: SERVER_URL, // Thay bằng URL của server
  headers: { "Content-Type": "application/json" },
});

// 🛠️ Thêm Interceptor để tự động gắn token vào request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      console.log("post error", error);
    }
  },
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },
  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
      // if (response.ok) {
      //   return true;
      // } else {
      //   return false;
      // }
    } catch (error) {
      console.log(error);
    }
  },
};

export default apiService;
