import React, { useState } from "react";
import { getSession } from "../api/session";
import { getHall } from "../api/halls";
import { useQuery } from "../hooks/query";
import SeatRow from "../components/SeatRow";
import BookingSummary from "../components/BookingSummary";
import Fallback from "../components/shared/Fallback";

interface Props {
  sessionId: string;
  onBack: () => void;
}

const SessionPage: React.FC<Props> = ({ sessionId, onBack }) => {
  const { data: plan, loading } = useQuery({
    queryFn: async () => {
      const session = await getSession(sessionId);
      const plan = await getHall(session.hallId);
      return { ...plan.plan, hallId: plan.id };
    },
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const rows = Array.from(new Set(plan?.seats.map((s) => s.row))).sort(
    (a, b) => a - b
  );

  const getCategory = (catId: string) =>
    plan?.categories.find((c) => c.id === catId);

  const totalCents = selectedSeats.reduce((sum, id) => {
    const seat = plan?.seats.find((s) => s.id === id);
    if (!seat) return sum;
    const cat = getCategory(seat.categoryId);
    return sum + (cat ? cat.priceCents : 0);
  }, 0);

  return (
    <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
      <div className="container py-5">
        <button className="btn btn-outline-light mb-4" onClick={onBack}>
          ← Назад
        </button>
        <Fallback
          loading={loading}
          loader={
            <div className="text-center text-light py-5">
              <h3>Загрузка данных...</h3>
            </div>
          }
        >
          <>
            {" "}
            <h2 className="text-center text-primary mb-4">
              Схема зала — Зал {plan!.hallId}
            </h2>
            <div
              className="d-flex flex-column align-items-center mb-4"
              style={{ gap: "10px" }}
            >
              {rows.map((rowNum) => (
                <SeatRow
                  key={rowNum}
                  rowNum={rowNum}
                  seats={plan!.seats}
                  selectedSeats={selectedSeats}
                  categories={plan!.categories}
                  onSeatClick={handleSeatClick}
                />
              ))}
            </div>
            <BookingSummary
              selectedSeatsCount={selectedSeats.length}
              totalCents={totalCents}
              onBook={() => {
                // Логика бронирования
              }}
            />
          </>
        </Fallback>
      </div>
    </div>
  );
};

export default SessionPage;
