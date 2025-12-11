import React from "react";
import { formatCents } from "../utils/money";

interface BookingSummaryProps {
  selectedSeatsCount: number;
  totalCents: number;
  onBook: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSeatsCount,
  totalCents,
  onBook,
}) => {
  return (
    <div className="text-center mb-3">
      <p>
        <strong>Выбрано мест:</strong> {selectedSeatsCount}
      </p>
      <p>
        <strong>Итого:</strong> {formatCents(totalCents)}
      </p>
      <button
        className="btn btn-primary px-5"
        disabled={selectedSeatsCount === 0}
        onClick={onBook}
      >
        Забронировать
      </button>
    </div>
  );
};

export default BookingSummary;
