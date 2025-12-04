import { useMutation } from './query';
import { createFilm, updateFilm, deleteFilm, type FilmCreate, type FilmUpdate, type Film } from '../api/movie';

export function useCreateMovieMutation() {
  return useMutation<Film, FilmCreate>({
    mutationFn: createFilm,
  });
}

export function useUpdateMovieMutation() {
  return useMutation<Film, { id: string; data: FilmUpdate }>({
    mutationFn: ({ id, data }) => updateFilm(id, data),
  });
}

export function useDeleteMovieMutation() {
  return useMutation<void, { id: string }>({
    mutationFn: ({ id }) => deleteFilm(id),
  });
}