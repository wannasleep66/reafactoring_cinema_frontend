// Branded/opaque id types to avoid mixing different id primitives
export type Brand<K, T> = K & { __brand: T };

export type SeatId = Brand<string, "SeatId">;
export type TicketId = Brand<string, "TicketId">;
export type MovieId = Brand<string, "MovieId">;
export type HallId = Brand<string, "HallId">;
export type PurchaseId = Brand<string, "PurchaseId">;
export type ClientId = Brand<string, "ClientId">;

export const SeatId = {
  of(s: string): SeatId {
    return s as SeatId;
  },
};

export const TicketId = {
  of(s: string): TicketId {
    return s as TicketId;
  },
};

export const MovieId = {
  of(s: string): MovieId {
    return s as MovieId;
  },
};

export const PurchaseId = {
  of(s: string): PurchaseId {
    return s as PurchaseId;
  },
};

export default {} as const;
