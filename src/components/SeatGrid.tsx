import React from "react";
import { CONFIG } from "../constants/config";
import { clsx } from "../utils/clsx";
import Money from "../types/money";
import type { SeatId } from "../types/ids";
import { SeatStatusValues } from "../types/seat";

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

interface SeatGridProps {
  seats: Seat[];
  tickets: Ticket[] | undefined;
  categories: Category[];
  onSelectedSeatsChange?: (selectedSeats: SeatId[]) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  tickets,
  categories,
  onSelectedSeatsChange,
}) => {
  const [selectedSeats, setSelectedSeats] = React.useState<SeatId[]>([]);

  const handleSeatClick = (seatId: string) => {
    const sid = seatId as SeatId;
    const newSelectedSeats = selectedSeats.includes(sid)
      ? selectedSeats.filter((id) => id !== sid)
      : [...selectedSeats, sid];

    setSelectedSeats(newSelectedSeats);
    onSelectedSeatsChange?.(newSelectedSeats);
  };

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const getSeatStatus = (seatId: string): Ticket["status"] => {
    return (
      (tickets?.find((t) => t.seatId === seatId)?.status as Ticket["status"]) ||
      "AVAILABLE"
    );
  };

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort(
    (a, b) => a - b
  );

  return (
    <div
      className="d-flex flex-column align-items-center mb-4"
      style={{ gap: "10px" }}
    >
      {rows.map((rowNum) => {
        const rowSeats = seats
          .filter((s) => s.row === rowNum)
          .sort((a, b) => a.number - b.number);

        return (
          <div
            key={rowNum}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${rowSeats.length}, ${CONFIG.UI.SEAT_BUTTON_SIZE})`,
              gap: CONFIG.UI.SEAT_BUTTON_GAP,
            }}
          >
            {rowSeats.map((seat) => {
              const status = getSeatStatus(seat.id);
              const category = getCategory(seat.categoryId);
              const isSelected = selectedSeats.includes(seat.id as SeatId);
              return (
                <button
                  key={seat.id}
                  className={clsx([
                    "btn",
                    {
                      "btn-danger": status === SeatStatusValues.Sold,
                      "btn-warning": status === SeatStatusValues.Reserved,
                      "btn-success": isSelected,
                      "btn-outline-light":
                        status === SeatStatusValues.Available && !isSelected,
                    },
                  ])}
                  style={{
                    width: CONFIG.UI.SEAT_BUTTON_SIZE,
                    height: CONFIG.UI.SEAT_BUTTON_SIZE,
                  }}
                  disabled={status !== "AVAILABLE"}
                  onClick={() => handleSeatClick(seat.id)}
                  title={`${category?.name || "Место"} — ${Money.formatCents(
                    category ? category.priceCents : 0
                  )}`}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SeatGrid;
