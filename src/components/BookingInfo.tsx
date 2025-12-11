import React from "react";
import type { Seat, Category, Ticket } from "./SeatGrid";
import { formatCents } from "../utils/money";

interface BookingInfoProps {
  selectedSeats: string[];
  seats: Seat[];
  tickets: Ticket[] | undefined;
  categories: Category[];
  totalCents: number;
  onReserve: () => void;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  selectedSeats,
  seats,
  tickets,
  categories,
  totalCents,
  onReserve,
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  if (selectedSeats.length === 0) {
    return null;
  }

  const seatsInfo = selectedSeats
    .map((id) => {
      const ticket = tickets?.find((t) => t.seatId === id);
      if (!ticket) return "";
      const seat = seats.find((s) => s.id === id);
      if (!seat) return "";
      const cat = getCategory(ticket.categoryId);
      return `Ряд ${seat.row + 1}, №${seat.number} (${cat?.name} — ${
        cat ? formatCents(cat.priceCents) : formatCents(0)
      })`;
    })
    .filter(Boolean)
    .join("; ");

  return (
    <div className="text-center mb-3">
      <p>
        <strong>Выбраны места:</strong> {seatsInfo}
      </p>
      <p>
        <strong>Итого:</strong> {formatCents(totalCents)}
      </p>
      <button className="btn btn-primary px-5" onClick={onReserve}>
        Забронировать
      </button>
    </div>
  );
};

export default BookingInfo;
