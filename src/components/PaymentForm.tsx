import React, { useState } from "react";
import type { Seat, Category, Ticket } from "./SeatGrid";
import Money from "../types/money";

interface Purchase {
  id: string;
  ticketIds: string[];
}

interface PaymentFormProps {
  purchase: Purchase;
  seats: Seat[];
  tickets: Ticket[] | undefined;
  categories: Category[];
  onPayment: (cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  }) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  purchase,
  seats,
  tickets,
  categories,
  onPayment,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  const handlePaymentClick = () => {
    onPayment({ cardNumber, expiryDate, cvv, cardHolderName });
  };
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const seatsInfo = tickets
    ?.filter((t) => purchase.ticketIds.includes(t.id))
    .map((t) => {
      const cat = getCategory(t.categoryId);
      const seat = seats.find((s) => s.id === t.seatId);
      return seat
        ? `Ряд ${seat.row + 1}, №${seat.number} (${cat?.name} — ${Money.formatCents(
            cat?.priceCents || 0
          )})`
        : "";
    })
    .join("; ");

  const totalAmount = tickets
    ?.filter((t) => purchase.ticketIds.includes(t.id))
    .reduce((sum, t) => {
      const cat = getCategory(t.categoryId);
      return sum + (cat ? cat.priceCents : 0);
    }, 0);

  return (
    <div className="text-center mt-4 p-3 border border-light rounded">
      <h5>Оплата</h5>
      <p>
        <strong>Места:</strong> {seatsInfo}
      </p>
      <p>
        <strong>Сумма:</strong> {Money.formatCents(totalAmount || 0)}
      </p>
      <div className="d-flex flex-column align-items-center gap-2">
        <input
          placeholder="Номер карты"
          className="form-control"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <input
          placeholder="Срок (MM/YY)"
          className="form-control"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          placeholder="CVV"
          className="form-control"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <input
          placeholder="Имя владельца карты"
          className="form-control"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
        />
        <button
          className="btn btn-success px-5 mt-2"
          onClick={handlePaymentClick}
        >
          Оплатить
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
