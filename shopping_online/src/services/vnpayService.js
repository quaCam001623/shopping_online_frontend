import apiService from "./apiService";
import { SERVER_URL } from "./baseService";

const endpoint = `${SERVER_URL}/vnpay`;

export const createURLPayment = (data) =>
  apiService.post(`${endpoint}/create_payment_url`, data);
