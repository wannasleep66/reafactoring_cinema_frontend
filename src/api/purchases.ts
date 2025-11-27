import { api } from "./http";
import type { Pagination, PaginationQuery } from "./pagination";

export type PurchaseStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";

export type Purchase = {
  id: string;
  clientId: string;
  filmId: string;
  ticketIds: string[];
  totalCents: number;
  status: PurchaseStatus;
  createdAt: string;
};

export type PurchaseCreate = {
  ticketIds: string[];
};

export type PurchaseListResponse = {
  data: Purchase[];
  pagination: Pagination;
};

export async function getPurchases(params?: PaginationQuery) {
  const { data } = await api.get<PurchaseListResponse>("/purchases", {
    params,
  });
  return data;
}

export async function getPurchase(id: Purchase["id"]) {
  const { data } = await api.get<Purchase>(`/purchases/${id}`);
  return data;
}

export async function createPurchase(purchase: PurchaseCreate) {
  const { data } = await api.post<Purchase>("/purchases", purchase);
  return data;
}

export async function cancelPurchase(id: Purchase["id"]) {
  const { data } = await api.post<Purchase>(`/purchases/${id}/cancel`, null);
  return data;
}
