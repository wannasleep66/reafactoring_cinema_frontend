import axios from "axios";
import { CONFIG } from "../constants/config";
import { getAuthToken } from "../utils/auth";

export const API_URL = CONFIG.API.BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    // set Authorization header; cast to any to avoid AxiosHeaders typing complexity
    (config.headers as any) = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
