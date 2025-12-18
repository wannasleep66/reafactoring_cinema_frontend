import { CONFIG } from "../constants/config";

export function getAuthToken(): string | null {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

export function setAuthToken(token: string) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
}

export function clearAuthToken() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};
