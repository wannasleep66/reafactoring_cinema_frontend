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

export async function getCategories(params?: PaginationQuery) {
  const { data } = await api.get<SeatCategoryListResponse>("/seat-categories", {
    params: params,
  });
  return data;
}

export async function createCategory(input: SeatCategoryCreate) {
  await api.post("/seat-categories", input);
}

export async function updateCategory(
  id: SeatCategory["id"],
  input: SeatCategoryUpdate
) {
  await api.put(`/seat-categories/${id}`, input);
}

export async function deleteCategory(id: SeatCategory["id"]) {
  await api.delete(`/seat-categories/${id}`);
}
