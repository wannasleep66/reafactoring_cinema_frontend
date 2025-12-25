import React from "react";
import { type Hall } from "../api/halls";

interface HallsListProps {
  halls: Hall[] | undefined;
  onEdit: (hall: Hall) => void;
  onDelete: (id: string) => void;
}

export default function HallsList({ halls, onEdit, onDelete }: HallsListProps) {
  return (
    <div>
      {halls?.length === 0 ? (
        <p>Залов пока нет.</p>
      ) : (
        <div className="row">
          {halls?.map((h) => (
            <div key={h.id} className="col-md-6 mb-3">
              <div className="card shadow-sm p-3 text-light">
                <strong>{h.name}</strong> — №{h.number}
                <div className="mt-2 d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => onEdit(h)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(h.id!)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}