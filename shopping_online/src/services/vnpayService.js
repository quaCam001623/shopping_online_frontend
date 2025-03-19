import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/payment`;

export const createURLPayment = (data) =>
  apiService.post(`${endpoint}/create-url-vnpay`, data);
