import React, { useState } from "react";
import type { Seat, Category, Ticket } from "./SeatGrid";

interface Purchase {
  id: string;
  ticketIds: string[];
}

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

interface PaymentFormProps {
  purchase: Purchase;
  seats: Seat[];
  tickets: Ticket[] | undefined;
  categories: Category[];
  onPayment: (cardData: CardData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  purchase,
  seats,
  tickets,
  categories,
  onPayment,
}) => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  const handlePaymentClick = () => {
    onPayment(cardData);
  };

  const handleCardDataChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const seatsInfo = tickets
    ?.filter((t) => purchase.ticketIds.includes(t.id))
    .map((t) => {
      const cat = getCategory(t.categoryId);
      const seat = seats.find((s) => s.id === t.seatId);
      return seat
        ? `Ряд ${seat.row + 1}, №${seat.number} (${cat?.name} — ${cat?.priceCents} ₽)`
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
        <strong>Сумма:</strong> {totalAmount} ₽
      </p>
      <div className="d-flex flex-column align-items-center gap-2">
        <input
          placeholder="Номер карты"
          className="form-control"
          value={cardData.cardNumber}
          onChange={(e) => handleCardDataChange('cardNumber', e.target.value)}
        />
        <input
          placeholder="Срок (MM/YY)"
          className="form-control"
          value={cardData.expiryDate}
          onChange={(e) => handleCardDataChange('expiryDate', e.target.value)}
        />
        <input
          placeholder="CVV"
          className="form-control"
          value={cardData.cvv}
          onChange={(e) => handleCardDataChange('cvv', e.target.value)}
        />
        <input
          placeholder="Имя владельца карты"
          className="form-control"
          value={cardData.cardHolderName}
          onChange={(e) => handleCardDataChange('cardHolderName', e.target.value)}
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
