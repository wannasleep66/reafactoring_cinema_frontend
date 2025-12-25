import { api, API_URL } from "./http";
import { createCrudOperations } from "./crud";
import type { Media } from "./media";
import type { Pagination, PaginationQuery } from "./pagination";

export type FilmAgeRating = "0+" | "6+" | "12+" | "16+" | "18+";

export type FilmResponse = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageRating: FilmAgeRating;
  poster?: Media;
  createdAt: string;
  updatedAt: string;
};

export type Film = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageRating: FilmAgeRating;
  imageUrl?: string;
};

export type FilmCreate = {
  title: string;
  description: string;
  ageRating: FilmAgeRating;
  posterId?: number;
};

export type FilmUpdate = {
  title?: string;
  description?: string;
  ageRating?: FilmAgeRating;
  posterId?: number;
};

export type FilmListResponse = {
  data: FilmResponse[];
  pagination: Pagination;
};

// Создаем универсальные CRUD операции для Film
const filmCrud = createCrudOperations<FilmResponse, FilmCreate, FilmUpdate>(
  "/films",
  // Трансформация для getAll, чтобы обработать специфичную структуру Film
  (response: FilmListResponse) => {
    return {
      data: response.data.map((film) => ({
        id: film.id,
        ageRating: film.ageRating,
        description: film.description,
        durationMinutes: film.durationMinutes,
        imageUrl: film.poster ? `${API_URL}/media/${film.poster.id}` : undefined,
        title: film.title,
        createdAt: film.createdAt,
        updatedAt: film.updatedAt,
        poster: film.poster,
      })),
      pagination: response.pagination,
    };
  },
  // Трансформация для get
  (response: FilmResponse) => {
    return {
      id: response.id,
      ageRating: response.ageRating,
      description: response.description,
      durationMinutes: response.durationMinutes,
      imageUrl: response.poster ? `${API_URL}/media/${response.poster.id}` : undefined,
      title: response.title,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      poster: response.poster,
    };
  }
);

// Экспортируем CRUD операции
export const {
  getAll: getFilms,
  get: getFilm,
  create: createFilm,
  update: updateFilm,
  delete: deleteFilm
} = filmCrud;