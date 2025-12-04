import { api } from "./http";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  roleType: "USER" | "ADMIN";
  gender: "MALE" | "FEMALE";
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateCurrentUser(
  input: Partial<
    Pick<User, "firstName" | "lastName" | "email" | "age" | "gender">
  >
): Promise<User> {
  const { data } = await api.put<User>("/users/me", input);
  return data;
}
