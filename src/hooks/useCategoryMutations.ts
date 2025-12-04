import { useMutation } from './query';
import { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  type CategoryCreate, 
  type CategoryUpdate, 
  type Category 
} from '../api/categories';

export function useCreateCategoryMutation() {
  return useMutation<Category, CategoryCreate>({
    mutationFn: createCategory,
  });
}

export function useUpdateCategoryMutation() {
  return useMutation<Category, { id: string; data: CategoryUpdate }>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
  });
}

export function useDeleteCategoryMutation() {
  return useMutation<void, { id: string }>({
    mutationFn: ({ id }) => deleteCategory(id),
  });
}