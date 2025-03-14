import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/messages`;
export const getAllMessages = (messageId) => apiService.get(endpoint);
export const getMessageById = (messageId) =>
  apiService.get(`${endpoint}/${messageId}`);
export const createMessage = (params) => apiService.post(endpoint, params);
export const updateMessage = (messageId, data) =>
  apiService.put(`${endpoint}/${messageId}`, data);
