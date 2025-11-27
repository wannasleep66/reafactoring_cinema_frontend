import { api } from "./http";
import type { Session } from "./session";

export type TicketStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "CANCELLED";

export type Ticket = {
  id: string;
  sessionId: string;
  seatId: string;
  categoryId: string;
  priceCents: number;
  status: TicketStatus;
  reservedUntil: string;
};

export type GetTicketQuery = {
  status?: TicketStatus;
};

export async function getTickets(
  sessionId: Session["id"],
  params?: GetTicketQuery
) {
  const { data } = await api.get<Ticket[]>(`/sessions/${sessionId}/tickets`, {
    params,
  });
  return data;
}

export async function reserveTicket(token: string, id: Ticket["id"]) {
  const { data } = await api.post<Ticket>(`/tickets/${id}/reserve`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function cancelReservation(token: string, id: Ticket["id"]) {
  const { data } = await api.post<Ticket>(`/tickets/${id}/cancel`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
