import { api, API_URL } from "./http";
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

export async function getFilms(
  params?: PaginationQuery
): Promise<{ data: Film[]; pagination: Pagination }> {
  const { data } = await api.get<FilmListResponse>("/films", {
    params: params,
  });
  return {
    data: data.data.map((film) => ({
      id: film.id,
      ageRating: film.ageRating,
      description: film.description,
      durationMinutes: film.durationMinutes,
      imageUrl: film.poster ? `${API_URL}/media/${film.poster.id}` : undefined,
      title: film.title,
    })),
    pagination: data.pagination,
  };
}

export async function getFilm(id: Film["id"]): Promise<Film> {
  const { data } = await api.get<FilmResponse>(`/films/${id}`);
  return {
    id: data.id,
    ageRating: data.ageRating,
    description: data.description,
    durationMinutes: data.durationMinutes,
    imageUrl: data.poster ? `${API_URL}/media/${data.poster.id}` : undefined,
    title: data.title,
  };
}

export async function createFilm(input: FilmCreate) {
  const { data } = await api.post<FilmResponse>("/films", input);
  return data;
}

export async function updateFilm(id: Film["id"], input: FilmUpdate) {
  const { data } = await api.put<FilmResponse>(`/films/${id}`, input);
  return data;
}

export async function deleteFilm(id: Film["id"]) {
  const { data } = await api.delete(`/films/${id}`);
  return data;
}
