import type { SeatCategory } from "./categories";
import { api } from "./http";
import type { Pagination } from "./pagination";

export type Hall = {
  id: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type Plan = {
  rows: number;
  seats: Seat[];
  categories: SeatCategory[];
};

export type HallDetails = Hall & {
  plan: Plan;
};

export type HallListResponse = {
  data: Hall[];
  pagination: Pagination;
};

type SeatStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "CANCELLED";

export type Seat = {
  id: string;
  row: number;
  number: number;
  categoryId: string;
  status: SeatStatus;
};

export type SeatCreate = {
  row: number;
  number: number;
  categoryId: number;
};

export type HallCreate = {
  name: string;
  number: number; // min: 1
  rows: number; // min: 1
  seats: SeatCreate[];
};

export type HallUpdate = {
  name: string;
  number: number;
};

export async function getHalls() {
  const { data } = await api.get<HallListResponse>("/halls");
  return data;
}

export async function getHall(id: Hall["id"]): Promise<HallDetails> {
  const hallPlanResponse = await api.get<Plan>(`/halls/${id}/plan`);
  const hallRepsponse = await api.get<Hall>(`/halls/${id}`);
  return {
    ...hallRepsponse.data,
    plan: hallPlanResponse.data,
  };
}

export async function createHall(input: HallCreate) {
  await api.post("/halls", input);
}

export async function updateHall(id: Hall["id"], input: HallUpdate) {
  await api.put(`/halls/${id}`, input);
}

export async function deleteHall(id: Hall["id"]) {
  await api.delete(`/halls/${id}`);
}
