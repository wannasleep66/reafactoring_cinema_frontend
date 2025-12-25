import { createCrudOperations } from "./crud";
import type { Pagination, PaginationQuery } from "./pagination";

export type SeatCategory = {
  id: string;
  name: string;
  priceCents: number;
};

export type SeatCategoryCreate = {
  name: string;
  priceCents: number;
};

export type SeatCategoryUpdate = {
  name: string;
  priceCents: number;
};

export type SeatCategoryListResponse = {
  data: SeatCategory[];
  pagination: Pagination;
};

// Создаем универсальные CRUD операции для SeatCategory
const categoryCrud = createCrudOperations<SeatCategory, SeatCategoryCreate, SeatCategoryUpdate>(
  "/seat-categories"
);

// Экспортируем CRUD операции
export const {
  getAll: getCategories,
  get: getCategory, // изменяем имя, чтобы избежать конфликта с названием типа
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory
} = categoryCrud;