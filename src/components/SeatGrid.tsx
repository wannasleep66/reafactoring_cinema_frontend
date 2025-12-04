import React from "react";

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
  onSelectedSeatsChange?: (selectedSeats: string[]) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  tickets,
  categories,
  onSelectedSeatsChange,
}) => {
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    const newSelectedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

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
              gridTemplateColumns: `repeat(${rowSeats.length}, 50px)`,
              gap: "5px",
            }}
          >
            {rowSeats.map((seat) => {
              const status = getSeatStatus(seat.id);
              const category = getCategory(seat.categoryId);
              const isSelected = selectedSeats.includes(seat.id);

              let color = "btn-outline-light";
              if (status === "SOLD") color = "btn-danger";
              else if (status === "RESERVED") color = "btn-warning";
              else if (isSelected) color = "btn-success";

              return (
                <button
                  key={seat.id}
                  className={`btn ${color}`}
                  style={{ width: "50px", height: "50px" }}
                  disabled={status !== "AVAILABLE"}
                  onClick={() => handleSeatClick(seat.id)}
                  title={`${category?.name || "Место"} — ${
                    category ? category.priceCents : 0
                  } ₽`}
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
