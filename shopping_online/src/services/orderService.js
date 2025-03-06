import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/orders`;

export const getOrderByUser = (userId) =>
  apiService.get(`${endpoint}/${userId}`);

export const getOrderById = (orderId) =>
  apiService.get(`${endpoint}/${orderId}/orderId`);

export const createOrder = (data) => apiService.post(endpoint, data);
