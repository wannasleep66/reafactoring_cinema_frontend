import { useCrudMutations } from './useCrudMutations';
import { createFilm, updateFilm, deleteFilm, type FilmCreate, type FilmUpdate, type Film } from '../api/movie';

export function useMovieMutations() {
  return useCrudMutations<Film, FilmCreate, FilmUpdate>({
    create: createFilm,
    update: updateFilm,
    delete: deleteFilm,
  });
}