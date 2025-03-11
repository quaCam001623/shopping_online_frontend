import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/users`;
export const getUsers = () => apiService.get(endpoint);
export const getUserById = (userId) => apiService.get(`${endpoint}/${userId}`);
export const createUsers = (params) => apiService.post(endpoint, params);
export const updateUser = (userId, data) =>
  apiService.put(`${endpoint}/${userId}`, data);
