import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/wishlists`;

export const getWishlistByUser = (userId) =>
  apiService.get(`${endpoint}/${userId}`);
export const createWishlist = (params) => apiService.post(endpoint, params);
export const deleteWishlist = (userId, productId) =>
  apiService.delete(`${endpoint}/${userId}/${productId}`);
