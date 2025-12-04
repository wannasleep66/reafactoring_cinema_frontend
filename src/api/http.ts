import axios from "axios";
import { CONFIG } from "../constants/config";

export const API_URL = CONFIG.API.BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    CONFIG.STORAGE_KEYS.AUTH_TOKEN
  )}`;
  return config;
});
