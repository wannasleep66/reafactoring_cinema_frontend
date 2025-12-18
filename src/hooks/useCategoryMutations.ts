import { useCrudMutations } from './useCrudMutations';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryCreate,
  type CategoryUpdate,
  type Category
} from '../api/categories';

export function useCategoryMutations() {
  return useCrudMutations<Category, CategoryCreate, CategoryUpdate>({
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
  });
}