import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/cards`;

export const getCards = (userId) => apiService.get(`${endpoint}/${userId}`);

export const createCard = (userId, data) =>
  apiService.post(`${endpoint}/${userId}`, data);

export const updateCard = (cardId, quantity) =>
  apiService.put(`${endpoint}/${cardId}`, quantity);

export const deleteCard = (cardId) => {
  apiService.delete(`${endpoint}/${cardId}`);
};
