import { api } from "./http";
import type { Pagination, PaginationQuery } from "./pagination";

export type SeatCategory = {
  id: string;
  name: string;
  priceCents: number;
};

export type SeatCategoryCreate = {
  name: string;
  priceCents: number;
};

export type SeatCategoryUpdate = {
  name: string;
  priceCents: number;
};

export type SeatCategoryListResponse = {
  data: SeatCategory[];
  pagination: Pagination;
};

export async function getCategories(token: string, params?: PaginationQuery) {
  const { data } = await api.get<SeatCategoryListResponse>("/seat-categories", {
    params: params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function createCategory(token: string, input: SeatCategoryCreate) {
  await api.post("/seat-categories", input, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateCategory(
  token: string,
  id: SeatCategory["id"],
  input: SeatCategoryUpdate
) {
  await api.put(`/seat-categories/${id}`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteCategory(token: string, id: SeatCategory["id"]) {
  await api.delete(`/seat-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
