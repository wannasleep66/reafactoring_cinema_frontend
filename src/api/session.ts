import { createCrudOperations } from "./crud";
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

// Создаем универсальные CRUD операции для Session
const sessionCrud = createCrudOperations<Session, SessionCreate, SessionUpdate>(
  "/sessions"
);

// Экспортируем CRUD операции
export const {
  get: getSession,
  create: createSession,
  update: updateSession,
  delete: deleteSession
} = sessionCrud;

// Экспортируем функцию получения списка с параметрами запроса (так как у нее специфичная сигнатура)
export async function getSesssions(params?: GetSessionsQueryParams) {
  const { data } = await api.get<SessionListResponse>("/sessions", {
    params: params,
  });
  return data;
}