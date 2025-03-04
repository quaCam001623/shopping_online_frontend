import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/categories`;
export const getCategories = () => apiService.get(endpoint);
