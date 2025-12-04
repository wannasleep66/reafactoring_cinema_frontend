import React from "react";
import type { Seat } from "../api/halls";

interface Category {
  id: string;
  name: string;
  priceCents: number;
}

interface SeatRowProps {
  rowNum: number;
  seats: Seat[];
  selectedSeats: string[];
  categories: Category[];
  onSeatClick: (seatId: string) => void;
}

const SeatRow: React.FC<SeatRowProps> = ({
  rowNum,
  seats,
  selectedSeats,
  categories,
  onSeatClick,
}) => {
  const rowSeats = seats
    .filter((s) => s.row === rowNum)
    .sort((a, b) => a.number - b.number);

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${rowSeats.length}, 50px)`,
        gap: "5px",
      }}
    >
      {rowSeats.map((seat) => {
        const category = getCategory(seat.categoryId);
        const isSelected = selectedSeats.includes(seat.id);
        const isTaken = seat.status !== "AVAILABLE";

        const color = isTaken
          ? "btn-secondary"
          : isSelected
            ? "btn-success"
            : category?.name?.toLowerCase().includes("vip")
              ? "btn-primary"
              : "btn-outline-light";

        return (
          <button
            key={seat.id}
            className={`btn ${color}`}
            style={{ width: "50px", height: "50px" }}
            disabled={isTaken}
            onClick={() => onSeatClick(seat.id)}
            title={`${category?.name || "Место"} — ${
              category ? category.priceCents / 100 : 0
            } ₽`}
          >
            {seat.number}
          </button>
        );
      })}
    </div>
  );
};

export default SeatRow;
