import React from "react";
import type { Category } from "./SeatGrid";
import Money from "../types/money";

interface SeatLegendProps {
  categories: Category[];
}

const SeatLegend: React.FC<SeatLegendProps> = ({ categories }) => {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 mb-3">
      {categories.map((c) => (
        <div key={c.id} className="d-flex align-items-center gap-1">
          <span
            className="btn"
            style={{
              width: "20px",
              height: "20px",
              padding: 0,
              backgroundColor: c.name.toLowerCase().includes("vip")
                ? "#0d6efd"
                : "#fff",
              border: c.name.toLowerCase().includes("vip")
                ? "1px solid #0d6efd"
                : "1px solid #fff",
            }}
          ></span>
          <small className="text-light">
            {c.name} — {Money.formatCents(c.priceCents)}
          </small>
        </div>
      ))}

      <div className="d-flex align-items-center gap-1">
        <span
          className="btn btn-outline-light"
          style={{ width: "20px", height: "20px", padding: 0 }}
        ></span>
        <small>Свободно</small>
      </div>
      <div className="d-flex align-items-center gap-1">
        <span
          className="btn btn-warning"
          style={{ width: "20px", height: "20px", padding: 0 }}
        ></span>
        <small>Забронировано</small>
      </div>
      <div className="d-flex align-items-center gap-1">
        <span
          className="btn btn-danger"
          style={{ width: "20px", height: "20px", padding: 0 }}
        ></span>
        <small>Продано</small>
      </div>
    </div>
  );
};

export default SeatLegend;
