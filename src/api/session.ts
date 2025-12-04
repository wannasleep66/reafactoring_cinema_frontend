import { api } from "./http";
import type { Pagination, PaginationQuery } from "./pagination";

export type Session = {
  id: string;
  filmId: string;
  hallId: string;
  startAt: string;
  timeslot: {
    start: string;
    end: string;
  };
};

export type SessionCreate = {
  filmId: string;
  hallId: string;
  startAt: string;
  periodicConfig?: {
    period: "EVERY_DAY" | "EVERY_WEEK";
    periodGenerationEndsAt: string;
  };
};

export type SessionUpdate = {
  fimdId?: string;
  hallId: string;
  startAt: string;
};

export type SessionListResponse = {
  data: Session[];
  pagination: Pagination;
};

export type GetSessionsQueryParams = PaginationQuery & {
  filmId?: string;
  date?: string;
};

export async function getSesssions(params?: GetSessionsQueryParams) {
  const { data } = await api.get<SessionListResponse>("/sessions", {
    params: params,
  });

  return data;
}

export async function getSession(id: Session["id"]) {
  const res = await api.get<Session>(`/sessions/${id}`);
  return res.data;
}

export async function createSession(input: SessionCreate) {
  const { data } = await api.post<Session>("/sessions", input);
  return data;
}

export async function updateSession(id: Session["id"], input: SessionUpdate) {
  const { data } = await api.put<Session>(`/sessions/${id}`, input);
  return data;
}

export async function deleteSession(id: Session["id"]) {
  const { data } = await api.delete(`/sessions/${id}`);
  return data;
}
