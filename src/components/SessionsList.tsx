import type { Film } from "../api/movie";
import type { Hall } from "../api/halls";
import type { Session } from "../api/session";

interface SessionsListProps {
  sessions: Session[] | undefined;
  movies: Film[] | undefined;
  halls: Hall[] | undefined;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

export default function SessionsList({
  sessions,
  movies,
  halls,
  onEdit,
  onDelete,
}: SessionsListProps) {
  if (sessions?.length === 0) {
    return <p>Сеансов пока нет.</p>;
  }

  return (
    <div className="row">
      {sessions?.map((s) => (
        <div key={s.id} className="col-md-6 mb-3">
          <div className="card shadow-sm p-3 text-light">
            <strong>
              {movies?.find((m) => m.id === s.filmId)?.title || s.filmId}
            </strong>{" "}
            — <em>{halls?.find((h) => h.id === s.hallId)?.name || s.hallId}</em>
            <div>🕒 {new Date(s.startAt).toLocaleString()}</div>
            <div className="mt-2 d-flex justify-content-between">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => onEdit(s)}
              >
                ✏ Редактировать
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(s.id)}
              >
                🗑 Удалить
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
