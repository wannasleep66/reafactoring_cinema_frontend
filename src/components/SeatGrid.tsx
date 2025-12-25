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
  selectedSeats: SeatId[];  // Получаем выбранные места извне
  categories: Category[];
  onSeatClick: (seatId: string) => void;  // Единый обработчик клика
  rowNum?: number;          // Опциональный параметр для отображения конкретного ряда
}

const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeats,
  categories,
  onSeatClick,
  rowNum                   // Если указан, отображаем только этот ряд
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  // Фильтруем места по ряду, если rowNum указан
  const filteredSeats = rowNum !== undefined
    ? seats.filter(s => s.row === rowNum)
    : seats;

  // Сортируем места в ряду по номеру
  const sortedSeats = filteredSeats.sort((a, b) => a.number - b.number);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sortedSeats.length}, ${CONFIG.UI.SEAT_BUTTON_SIZE})`,
        gap: CONFIG.UI.SEAT_BUTTON_GAP,
      }}
    >
      {sortedSeats.map((seat) => {
        const category = getCategory(seat.categoryId);
        const isSelected = selectedSeats.includes(seat.id as SeatId);

        // Проверяем статус места
        const isAvailable = seat.status === "AVAILABLE";
        const isReserved = seat.status === "RESERVED";
        const isSold = seat.status === "SOLD";

        return (
          <button
            key={seat.id}
            className={clsx([
              "btn",
              {
                "btn-danger": isSold,
                "btn-warning": isReserved,
                "btn-success": isSelected,
                "btn-outline-light":
                  isAvailable && !isSelected,
              },
            ])}
            style={{
              width: CONFIG.UI.SEAT_BUTTON_SIZE,
              height: CONFIG.UI.SEAT_BUTTON_SIZE,
            }}
            disabled={!isAvailable}
            onClick={() => onSeatClick(seat.id)}
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
};

export default SeatGrid;
