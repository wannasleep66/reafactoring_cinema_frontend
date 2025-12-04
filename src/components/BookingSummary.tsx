import React from "react";

interface BookingSummaryProps {
  selectedSeatsCount: number;
  totalPrice: number;
  onBook: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedSeatsCount,
  totalPrice,
  onBook,
}) => {
  return (
    <div className="text-center mb-3">
      <p>
        <strong>Выбрано мест:</strong> {selectedSeatsCount}
      </p>
      <p>
        <strong>Итого:</strong> {totalPrice} ₽
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
