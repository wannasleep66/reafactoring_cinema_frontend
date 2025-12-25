import React from "react";
import type { Seat, Category, Ticket } from "../types/seats";
import Money from "../types/money";
import type { SeatId } from "../types/ids";

export type BookingDisplayMode = 'detailed' | 'summary';

interface BookingDisplayProps {
  selectedSeats: SeatId[] | string[];  // Поддержка обоих типов идентификаторов
  seats?: Seat[];                      // Необходимо для детализированного режима
  tickets?: Ticket[];                  // Необходимо для детализированного режима
  categories?: Category[];             // Необходимо для детализированного режима
  totalPrice: number;
  onAction: () => void;                // Унифицированное имя функции действия
  actionLabel?: string;                // Надпись на кнопке действия
  mode?: BookingDisplayMode;           // Режим отображения: детализированный или краткий
}

const BookingDisplay: React.FC<BookingDisplayProps> = ({
  selectedSeats,
  seats,
  tickets,
  categories,
  totalPrice,
  onAction,
  actionLabel = "Забронировать",      // По умолчанию используется "Забронировать"
  mode = 'summary'                    // По умолчанию краткий режим
}) => {
  // Если нет выбранных мест, ничего не отображаем
  if (selectedSeats.length === 0) {
    return null;
  }

  // Функция получения категории (только для детализированного режима)
  const getCategory = (catId: string) => 
    categories?.find((c) => c.id === catId);

  // Для детального режима формируем информацию о местах
  let seatsInfo = "";
  if (mode === 'detailed' && seats && tickets && categories) {
    seatsInfo = selectedSeats
      .map((id) => {
        const ticket = tickets?.find((t) => t.seatId === (id as string));
        if (!ticket) return "";
        const seat = seats.find((s) => s.id === (id as string));
        if (!seat) return "";
        const cat = getCategory(ticket.categoryId);
        return `Ряд ${seat.row + 1}, №${seat.number} (${cat?.name} — ${Money.formatCents(
          cat ? cat.priceCents : 0
        )})`;
      })
      .filter(Boolean)
      .join("; ");
  }

  return (
    <div className="text-center mb-3">
      {mode === 'detailed' && seatsInfo && (
        <p>
          <strong>Выбраны места:</strong> {seatsInfo}
        </p>
      )}
      {mode === 'summary' && (
        <p>
          <strong>Выбрано мест:</strong> {selectedSeats.length}
        </p>
      )}
      <p>
        <strong>Итого:</strong> {totalPrice} ₽
      </p>
      <button 
        className="btn btn-primary px-5"
        disabled={selectedSeats.length === 0}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default BookingDisplay;