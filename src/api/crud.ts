import { api } from './http';
import type { Pagination, PaginationQuery } from './pagination';

// Универсальный CRUD интерфейс
export interface CrudOperations<T, TCreate, TUpdate> {
  // Получить все элементы
  getAll: (params?: PaginationQuery) => Promise<{ data: T[]; pagination: Pagination }>;
  
  // Получить конкретный элемент
  get: (id: string) => Promise<T>;
  
  // Создать новый элемент
  create: (input: TCreate) => Promise<T>;
  
  // Обновить существующий элемент
  update: (id: string, input: TUpdate) => Promise<T>;
  
  // Удалить элемент
  delete: (id: string) => Promise<void>;
}

// Объект с универсальными CRUD функциями
export function createCrudOperations<T, TCreate, TUpdate>(
  endpoint: string,
  // Опционально: функция для преобразования ответа (например, для фильмов)
  transformGetAll?: (response: any) => { data: T[]; pagination: Pagination },
  transformGet?: (response: any) => T
): CrudOperations<T, TCreate, TUpdate> {
  return {
    getAll: async (params?: PaginationQuery) => {
      const { data: response } = await api.get(`${endpoint}`, { params });
      
      if (transformGetAll) {
        return transformGetAll(response);
      }
      
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    
    get: async (id: string) => {
      const { data: response } = await api.get(`${endpoint}/${id}`);
      
      if (transformGet) {
        return transformGet(response);
      }
      
      return response;
    },
    
    create: async (input: TCreate) => {
      const { data: response } = await api.post<T>(`${endpoint}`, input);
      return response;
    },
    
    update: async (id: string, input: TUpdate) => {
      const { data: response } = await api.put<T>(`${endpoint}/${id}`, input);
      return response;
    },
    
    delete: async (id: string) => {
      await api.delete(`${endpoint}/${id}`);
    },
  };
}