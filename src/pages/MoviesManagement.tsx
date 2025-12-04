import React, { useState } from "react";
import {
  getFilms,
  type FilmAgeRating,
} from "../api/movie";
import { useQuery } from "../hooks/query";
import { useCreateMovieMutation, useUpdateMovieMutation, useDeleteMovieMutation } from "../hooks/useMovieMutations";
import { CONFIG } from "../constants/config";

type MovieFormSchema = {
  id?: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageRating: FilmAgeRating;
};

export default function MoviesManagement() {
  const { data: movies, refetch } = useQuery({
    queryFn: () =>
      getFilms({
        page: CONFIG.PAGINATION.DEFAULT_PAGE,
        size: CONFIG.PAGINATION.MOVIES_PAGE_SIZE,
      }).then((res) => res.data),
  });

  const { mutate: createMovie } = useCreateMovieMutation();
  const { mutate: updateMovie } = useUpdateMovieMutation();
  const { mutate: deleteMovie } = useDeleteMovieMutation();

  const [editing, setEditing] = useState<MovieFormSchema | null>(null);

  const handleSave = async (movie: MovieFormSchema) => {
    try {
      if (movie.id) {
        await updateMovie({ id: movie.id, data: movie });
      } else {
        const data = await createMovie(movie);
        movie.id = data.id;
      }
      refetch();
      setEditing(null);
    } catch (err) {
      console.error("Ошибка сохранения фильма:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить этот фильм?")) return;
    try {
      await deleteMovie({ id });
      refetch();
    } catch (err) {
      console.error("Ошибка удаления фильма:", err);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary mb-4">🎥 Управление фильмами</h2>

      <button
        className="btn btn-success mb-3"
        onClick={() =>
          setEditing({
            id: "",
            title: "",
            description: "",
            durationMinutes: 0,
            ageRating: "0+",
          })
        }
      >
        ➕ Добавить фильм
      </button>

      {editing && (
        <MovieForm
          movie={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {movies?.length === 0 ? (
        <p>Нет фильмов. Добавьте новый.</p>
      ) : (
        <div className="row">
          {movies?.map((m) => (
            <div key={m.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{m.title}</h5>
                  <p className="card-text small ">
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
                      onClick={() => setEditing(m)}
                    >
                      ✏ Редактировать
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(m.id)}
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

interface MovieFormProps {
  movie: MovieFormSchema;
  onSave: (movie: MovieFormSchema) => void;
  onCancel: () => void;
}

function MovieForm({ movie, onSave, onCancel }: MovieFormProps) {
  const [form, setForm] = useState(movie);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "durationMinutes" ? Number(value) : value,
    });
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">
        {movie.id ? "Редактирование фильма" : "Добавление фильма"}
      </h5>
      <input
        className="form-control mb-2"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Название"
      />
      <textarea
        className="form-control mb-2"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <input
        className="form-control mb-2"
        name="durationMinutes"
        type="number"
        value={form.durationMinutes}
        onChange={handleChange}
        placeholder="Продолжительность (мин.)"
      />
      <input
        className="form-control mb-3"
        name="ageRating"
        value={form.ageRating}
        onChange={handleChange}
        placeholder="Возрастной рейтинг (например, 12+)"
      />
      <div className="d-flex justify-content-end">
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
