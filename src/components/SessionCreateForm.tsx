import React, { useEffect, useState } from "react";
import type { Film } from "../api/movie";
import type { Hall } from "../api/halls";
import { calculatePeriodEnd, calculateSessionCount } from "../utils/date";

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

interface PeriodicConfig {
  enabled: boolean;
  period: "EVERY_DAY" | "EVERY_WEEK";
  endAt: string;
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
  const [periodicConfig, setPeriodicConfig] = useState<PeriodicConfig>({
    enabled: false,
    period: "EVERY_DAY",
    endAt: "",
  });
  const [sessionCount, setSessionCount] = useState<number | null>(null);

  useEffect(() => {
    if (!periodicConfig.endAt && periodicConfig.enabled && form.startAt) {
      const date = new Date(form.startAt);
      date.setDate(date.getDate() + 7);
      setPeriodicConfig(prev => ({ ...prev, endAt: date.toISOString().slice(0, 16) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodicConfig.enabled, form.startAt]);

  useEffect(() => {
    if (periodicConfig.enabled && !periodicConfig.endAt) {
      setPeriodicConfig(prev => ({ ...prev, endAt: calculatePeriodEnd(form.startAt) }));
    }
    setSessionCount(calculateSessionCount(form.startAt, periodicConfig.endAt, periodicConfig.period));
  }, [periodicConfig.enabled, periodicConfig.endAt, periodicConfig.period, form.startAt]);

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
          checked={periodicConfig.enabled}
          onChange={(e) => setPeriodicConfig(prev => ({ ...prev, enabled: e.target.checked }))}
        />
        <label htmlFor="periodicCheck" className="mb-0 text-light">
          Повторять сеанс
        </label>
      </div>

      {periodicConfig.enabled && (
        <>
          <select
            value={periodicConfig.period}
            onChange={(e) =>
              setPeriodicConfig(prev => ({ ...prev, period: e.target.value as "EVERY_DAY" | "EVERY_WEEK" }))
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
            value={periodicConfig.endAt}
            onChange={(e) => setPeriodicConfig(prev => ({ ...prev, endAt: e.target.value }))}
          />

          {sessionCount && (
            <div className="alert alert-info p-2 mt-2">
              📅 Будет создано <strong>{sessionCount}</strong>{" "}
              {sessionCount === 1 ? "сеанс" : "сеансов"} до{" "}
              {new Date(periodicConfig.endAt).toLocaleDateString("ru-RU")}
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
              periodicConfig: periodicConfig.enabled
                ? {
                    period: periodicConfig.period,
                    periodGenerationEndsAt: new Date(periodicConfig.endAt).toISOString(),
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
