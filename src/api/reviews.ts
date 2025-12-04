import { api } from "./http";
import type { Film } from "./movie";
import type { Pagination } from "./pagination";

export type Review = {
  id: string;
  filmId: string;
  clientId: string;
  rating: number; // max: 5; min: 0
  text: string;
  createdAt: string;
};

export type ReviewCreate = {
  rating: number; // max: 5; min: 0
  text: string;
};

export type ReviewUpdate = {
  rating?: number; // max: 5; min: 0
  text?: string;
};

export type ReviewListResponse = {
  data: Review[];
  pagination: Pagination;
};

export async function getFilmReviews(filmId: Film["id"]) {
  const { data } = await api.get<ReviewListResponse>(
    `/films/${filmId}/reviews`
  );
  return data;
}

export async function getReview(id: Review["id"]) {
  const { data } = await api.get<Review>(`/reviews/${id}`);
  return data;
}

export async function createReview(filmId: Film["id"], input: ReviewCreate) {
  const { data } = await api.post<Review>(`/films/${filmId}/reviews`, input);
  return data;
}

export async function updateReview(id: Review["id"], input: ReviewUpdate) {
  const { data } = await api.put<Review>(`/reviews/${id}`, input);
  return data;
}

export async function deleteReview(id: Review["id"]) {
  await api.delete<Review>(`/reviews/${id}`);
}
