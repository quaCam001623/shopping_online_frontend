import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/addresses`;

export const getAddressByUser = (userId) =>
  apiService.get(`${endpoint}/${userId}`);

export const createAddress = (data) => apiService.post(endpoint, data);
