import React, { useState } from "react";
import * as movieApi from "../api/movie";
import ReviewsDisplay from "../components/ReviewsDisplay";
import SessionSelector from "../components/SessionSelector";
import SeatLegend from "../components/SeatLegend";
import SeatGrid from "../components/SeatGrid";
import BookingDisplay from "../components/BookingDisplay";
import PaymentForm from "../components/PaymentForm";
import { getSesssions, type Session } from "../api/session";
import { getHall } from "../api/halls";
import { getTickets, reserveTicket } from "../api/tickets";
import { createPurchase } from "../api/purchases";
import { processPayment } from "../api/payment";
import Card from "../types/card";
import type { SeatId } from "../types/ids";
import { useQuery } from "../hooks/query";

interface Props {
  movie: movieApi.Film;
  onBack: () => void;
}

interface Purchase {
  id: string;
  ticketIds: string[];
}

const MovieDetailsPage: React.FC<Props> = ({ movie, onBack }) => {
  const { data: sessions, loading: loadingSessions } = useQuery({
    queryFn: () => {
      return getSesssions({
        page: 0,
        size: 100,
        filmId: movie.id,
      }).then((res) => res.data);
    },
  });
  const {
    data: hall,
    loading: loadingHall,
    refetch: refetchHall,
  } = useQuery({
    queryFn: () => {
      if (!selectedSession) return;
      return getHall(selectedSession.hallId);
    },
  });
  const { data: tickets, refetch: refetchTickets } = useQuery({
    queryFn: () => {
      if (!selectedSession) return;
      return getTickets(selectedSession.id);
    },
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatId[]>([]);

  const getCategory = (catId: string) =>
    hall?.plan.categories.find((c) => c.id === catId);

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const seat = hall?.plan.seats.find((s) => s.id === (id as string));
    if (!seat) return sum;
    const cat = getCategory(seat.categoryId);
    return sum + (cat ? cat.priceCents : 0);
  }, 0);

  const canBook = selectedSeats.length > 0 && !purchase;
  const canPay = purchase !== null;

  const handleReserve = async () => {
    try {
      for (const seatId of selectedSeats) {
        const ticket = tickets?.find((t) => t.seatId === seatId);
        if (!ticket) continue;
        await reserveTicket(ticket.id);
      }
      alert("Места успешно забронированы!");

      const reservedTickets =
        tickets
          ?.filter((t) => selectedSeats.includes(t.seatId as unknown as SeatId))
          .map((t) => t.id) || [];

      const purchases = await createPurchase({
        ticketIds: reservedTickets,
      });
      setPurchase(purchases);
    } catch (err) {
      console.error("Ошибка при бронировании или покупке:", err);
      alert("Ошибка бронирования. Проверьте авторизацию и доступность мест.");
    }
  };

  const handlePayment = async (cardData: Card) => {
    try {
      await processPayment({
        purchaseId: purchase!.id,
        ...cardData.toApiPayload(),
      });
      alert("Оплата прошла успешно!");
      setPurchase(null);
      refetchTickets();
      refetchHall();
    } catch (err) {
      console.error("Ошибка оплаты:", err);
      alert("Ошибка оплаты. Проверьте данные карты.");
    }
  };

  return (
    <div className="app-container min-vh-100 d-flex flex-column bg-dark text-light">
      <div className="container py-5">
        <button className="btn btn-outline-light mb-4" onClick={onBack}>
          ← Назад
        </button>

        <div className="row g-4 align-items-start">
          <div className="col-md-4 text-center">
            <img
              src={movie.imageUrl || "https://placehold.co/300x450"}
              className="img-fluid rounded shadow mb-3"
              alt={movie.title}
            />
          </div>

          <div className="col-md-8">
            <h2 className="text-primary mb-3">{movie.title}</h2>

            <p>{movie.description}</p>
            <p>
              <strong>Возраст:</strong> {movie.ageRating}
            </p>

            <SessionSelector
              sessions={sessions}
              loadingSessions={loadingSessions}
              onSessionChange={(session) => {
                setSelectedSession(session);
                setSelectedSeats([]);
              }}
            />

            {selectedSession && (
              <div className="mt-4">
                <h5 className="text-light mb-3">Схема зала:</h5>
                {loadingHall && <p>Загрузка плана зала...</p>}
                {hall && (
                  <div
                    className="d-flex flex-column align-items-center mb-4"
                    style={{ gap: "10px" }}
                  >
                    <SeatLegend categories={hall.plan.categories} />

                    <SeatGrid
                      seats={hall.plan.seats}
                      selectedSeats={selectedSeats}
                      categories={hall.plan.categories}
                      onSeatClick={(seatId) => {
                        const newSelectedSeats = selectedSeats.includes(seatId as SeatId)
                          ? selectedSeats.filter((id) => id !== (seatId as SeatId))
                          : [...selectedSeats, seatId as SeatId];
                        setSelectedSeats(newSelectedSeats);
                      }}
                    />
                  </div>
                )}

                {canBook && hall && (
                  <BookingDisplay
                    selectedSeats={selectedSeats}
                    seats={hall.plan.seats}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tickets={tickets as any}
                    categories={hall.plan.categories}
                    totalPrice={totalPrice}
                    onAction={handleReserve}
                    mode="detailed"
                    actionLabel="Забронировать"
                  />
                )}

                {canPay && hall && (
                  <PaymentForm
                    purchase={purchase}
                    seats={hall.plan.seats}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tickets={tickets as any}
                    categories={hall.plan.categories}
                    onPayment={handlePayment}
                  />
                )}
              </div>
            )}
          </div>
          <ReviewsDisplay movieId={movie.id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
