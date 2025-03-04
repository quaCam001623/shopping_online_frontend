import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://localhost:9999", // Thay bằng URL của server
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
  post: async (endpoint, params) => {
    try {
      const response = await api.post(endpoint, params);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

export default apiService;
