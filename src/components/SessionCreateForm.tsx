import React, { useEffect, useState } from "react";
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

interface SessionCreateFormProps {
  movies: Film[];
  halls: Hall[];
  onSave: (session: SessionFormSchema) => void;
  onCancel: () => void;
}

export default function SessionCreateForm({
  movies,
  halls,
  onSave,
  onCancel,
}: SessionCreateFormProps) {
  const [form, setForm] = useState<SessionFormSchema>({
    id: "",
    filmId: movies?.[0]?.id || "",
    hallId: halls?.[0]?.id || "",
    startAt: new Date().toISOString().slice(0, 16),
    periodicConfig: undefined,
  });
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [period, setPeriod] = useState<"EVERY_DAY" | "EVERY_WEEK">("EVERY_DAY");
  const [periodEnd, setPeriodEnd] = useState("");
  const [sessionCount, setSessionCount] = useState<number | null>(null);

  useEffect(() => {
    if (!periodEnd && isPeriodic && form.startAt) {
      const date = new Date(form.startAt);
      date.setDate(date.getDate() + 7);
      setPeriodEnd(date.toISOString().slice(0, 16));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPeriodic, form.startAt]);

  useEffect(() => {
    if (!isPeriodic || !periodEnd) {
      setSessionCount(null);
      return;
    }

    const start = new Date(form.startAt);
    const end = new Date(periodEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setSessionCount(null);
      return;
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const count =
      period === "EVERY_DAY"
        ? Math.floor(diffDays) + 1
        : Math.floor(diffDays / 7) + 1;

    setSessionCount(count);
  }, [form.startAt, periodEnd, period, isPeriodic]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">Новый сеанс</h5>

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

      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="periodicCheck"
          checked={isPeriodic}
          onChange={() => setIsPeriodic(!isPeriodic)}
        />
        <label htmlFor="periodicCheck" className="mb-0 text-light">
          Повторять сеанс
        </label>
      </div>

      {isPeriodic && (
        <>
          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as "EVERY_DAY" | "EVERY_WEEK")
            }
            className="form-control mb-2"
          >
            <option value="EVERY_DAY">Каждый день</option>
            <option value="EVERY_WEEK">Каждую неделю</option>
          </select>

          <label className="text-light">До даты:</label>
          <input
            className="form-control mb-2"
            type="datetime-local"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
          />

          {sessionCount && (
            <div className="alert alert-info p-2 mt-2">
              📅 Будет создано <strong>{sessionCount}</strong>{" "}
              {sessionCount === 1 ? "сеанс" : "сеансов"} до{" "}
              {new Date(periodEnd).toLocaleDateString("ru-RU")}
            </div>
          )}
        </>
      )}

      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-success me-2"
          onClick={() =>
            onSave({
              ...form,
              periodicConfig: isPeriodic
                ? {
                    period,
                    periodGenerationEndsAt: new Date(periodEnd).toISOString(),
                  }
                : undefined,
            })
          }
        >
          💾 Сохранить
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          ✖ Отмена
        </button>
      </div>
    </div>
  );
}
