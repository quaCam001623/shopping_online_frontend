import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/products`;
export const getProducts = () => apiService.get(endpoint);
export const getProductById = (id) => apiService.get(`${endpoint}/${id}`);
