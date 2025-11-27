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

export async function getPurchases(token: string, params?: PaginationQuery) {
  const { data } = await api.get<PurchaseListResponse>("/purchases", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

export async function getPurchase(token: string, id: Purchase["id"]) {
  const { data } = await api.get<Purchase>(`/purchases/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function createPurchase(token: string, purchase: PurchaseCreate) {
  const { data } = await api.post<Purchase>("/purchases", purchase, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function cancelPurchase(token: string, id: Purchase["id"]) {
  const { data } = await api.post<Purchase>(`/purchases/${id}/cancel`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
