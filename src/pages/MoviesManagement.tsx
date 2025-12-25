import React, { useState } from "react";
import {
  getFilms,
  type Film,
} from "../api/movie";
import { useQuery } from "../hooks/query";
import { useCreateMovieMutation, useUpdateMovieMutation, useDeleteMovieMutation } from "../hooks/useMovieMutations";
import { CONFIG } from "../constants/config";
import MoviesList from "../components/MoviesList";
import MovieForm from "../components/MovieForm";

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

  const [editing, setEditing] = useState<Film | null>(null);

  const handleSave = async (movieData: Partial<Film>) => {
    try {
      if (movieData.id) {
        await updateMovie({ id: movieData.id, data: movieData });
      } else {
        await createMovie(movieData);
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

  const startCreating = () => {
    setEditing({
      id: undefined,
      title: "",
      description: "",
      durationMinutes: 0,
      ageRating: "0+",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary mb-4">🎥 Управление фильмами</h2>

      <button
        className="btn btn-success mb-3"
        onClick={startCreating}
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

      <MoviesList
        movies={movies}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}