export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  ageRating: string;
}

export interface Hall {
  id: number;
  name: string;
  number: number;
  rows: number;
}

export interface Category {
  id: number;
  name: string;
  priceCents: number;
}

export interface Session {
  id: number;
  movieId: number;
  hallId: number;
  date: string;
  time: string;
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  seatRow: number;
  seatNumber: number;
  price: number;
  isTaken: boolean;
}
