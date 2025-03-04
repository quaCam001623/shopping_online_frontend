import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/login`;

export const loginApi = (params) => {
  return apiService.post(endpoint, params);
};
