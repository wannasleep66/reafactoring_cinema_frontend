import React from "react";
import { type Film } from "../api/movie";

interface MoviesListProps {
  movies: Film[] | undefined;
  onEdit: (movie: Film) => void;
  onDelete: (id: string) => void;
}

export default function MoviesList({ movies, onEdit, onDelete }: MoviesListProps) {
  return (
    <div>
      {movies?.length === 0 ? (
        <p>Нет фильмов. Добавьте новый.</p>
      ) : (
        <div className="row">
          {movies?.map((m) => (
            <div key={m.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <p className="card-text small">
                    {m.description.length > 100
                      ? m.description.slice(0, 100) + "..."
                      : m.description}
                  </p>
                  <p className="mb-1 text-light">
                    ⏱ <strong>{m.durationMinutes}</strong> мин
                  </p>
                  <p className="mb-2 text-light">
                    Возрастной рейтинг: <strong>{m.ageRating}</strong>
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onEdit(m)}
                    >
                      ✏ Редактировать
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(m.id)}
                    >
                      🗑 Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}