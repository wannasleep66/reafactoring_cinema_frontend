import React, { useState } from "react";
import { type Film, type FilmAgeRating } from "../api/movie";

interface MovieFormProps {
  movie: Film | null;
  onSave: (movie: Partial<Film>) => void;
  onCancel: () => void;
}

type MovieFormSchema = {
  id?: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageRating: FilmAgeRating;
};

export default function MovieForm({ movie, onSave, onCancel }: MovieFormProps) {
  const [form, setForm] = useState<MovieFormSchema>({
    id: movie?.id || undefined,
    title: movie?.title || "",
    description: movie?.description || "",
    durationMinutes: movie?.durationMinutes || 0,
    ageRating: movie?.ageRating || "0+",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "durationMinutes" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">
        {movie?.id ? "Редактирование фильма" : "Добавление фильма"}
      </h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Название"
          required
        />
        <textarea
          className="form-control mb-2"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          required
        />
        <input
          className="form-control mb-2"
          name="durationMinutes"
          type="number"
          value={form.durationMinutes}
          onChange={handleChange}
          placeholder="Продолжительность (мин.)"
          required
          min="1"
        />
        <input
          className="form-control mb-3"
          name="ageRating"
          value={form.ageRating}
          onChange={handleChange}
          placeholder="Возрастной рейтинг (например, 12+)"
          required
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-success me-2" type="submit">
            💾 Сохранить
          </button>
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            ✖ Отмена
          </button>
        </div>
      </form>
    </div>
  );
}