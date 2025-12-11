import { api } from "./http";
import { setAuthToken, clearAuthToken, getAuthToken } from "../utils/auth";

export type TokenPayload = {
  sub: string;
  role: "ADMIN" | "USER";
  exp: number;
  iat: number;
};

export interface AuthResponse {
  accessToken: string;
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "MALE" | "FEMALE";
}): Promise<AuthResponse> {
  const response = await api.post("/auth/register", data, {
    headers: { "Content-Type": "application/json" },
  });
  setAuthToken(response.data.accessToken);
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await api.post("/auth/login", data, {
    headers: { "Content-Type": "application/json" },
  });
  setAuthToken(response.data.accessToken);
  return response.data;
}

export function logout() {
  clearAuthToken();
}

export function getStoredAuthToken() {
  const token = getAuthToken();
  return token ? { accessToken: token } : null;
}

// Backwards-compatible alias: prefer getStoredAuthToken
export { getStoredAuthToken as getCurrentUser };
