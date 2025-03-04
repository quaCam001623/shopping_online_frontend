import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/users`;
export const getUsers = () => apiService.get(endpoint);
export const createUsers = (params) => apiService.post(endpoint, params);
