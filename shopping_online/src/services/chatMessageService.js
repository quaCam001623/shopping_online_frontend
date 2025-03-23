import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/chats`;

export const getChatMessages = (userId) =>
  apiService.get(`${endpoint}/user/${userId}`);

export const getAllChatMessages = () => apiService.get(`${endpoint}/all`);

export const createChatMessage = (data) =>
  apiService.post(`${endpoint}/create`, data);

export const updateChatMessage = (chatMessageId, data) =>
  apiService.put(`${endpoint}/update/${chatMessageId}`, data);
