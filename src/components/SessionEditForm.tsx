import React, { useState } from "react";
import type { Film } from "../api/movie";
import type { Hall } from "../api/halls";

type SessionFormSchema = {
  id?: string;
  filmId: string;
  hallId: string;
  startAt: string;
  periodicConfig?: {
    period: "EVERY_DAY" | "EVERY_WEEK";
    periodGenerationEndsAt: string;
  };
};

interface SessionEditFormProps {
  session: SessionFormSchema;
  movies: Film[];
  halls: Hall[];
  onSave: (session: SessionFormSchema) => void;
  onCancel: () => void;
}

export default function SessionEditForm({
  session,
  movies,
  halls,
  onSave,
  onCancel,
}: SessionEditFormProps) {
  const [form, setForm] = useState<SessionFormSchema>(session);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">Редактирование сеанса</h5>

      <select
        name="filmId"
        value={form.filmId}
        onChange={handleChange}
        className="form-control mb-2"
      >
        {movies.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      <select
        name="hallId"
        value={form.hallId}
        onChange={handleChange}
        className="form-control mb-2"
      >
        {halls.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>

      <label className="text-light">Дата и время начала:</label>
      <input
        className="form-control mb-3"
        type="datetime-local"
        name="startAt"
        value={form.startAt}
        onChange={handleChange}
      />

      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-success me-2" onClick={() => onSave(form)}>
          💾 Сохранить
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          ✖ Отмена
        </button>
      </div>
    </div>
  );
}
