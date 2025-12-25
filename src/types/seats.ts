export interface Seat {
  id: string;
  row: number;
  number: number;
  categoryId: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  priceCents: number;
}

export interface Ticket {
  id: string;
  seatId: string;
  categoryId: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  priceCents: number;
}