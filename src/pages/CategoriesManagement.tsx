import { useState } from "react";
import {
  getCategories,
} from "../api/categories";
import { useQuery } from "../hooks/query";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import CategoryCreateForm from "./CategoryCreateForm";
import CategoryEditForm from "./CategoryEditForm";
import CategoriesList from "./CategoriesList";
import { CONFIG } from "../constants/config";

type CategoryFormSchema = {
  id?: string;
  name: string;
  priceCents: number;
};

export default function CategoriesManagement() {
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: () =>
      getCategories({
        page: CONFIG.PAGINATION.DEFAULT_PAGE,
        size: CONFIG.PAGINATION.CATEGORIES_PAGE_SIZE,
      }).then((res) => res.data),
  });

  const { createMutation, updateMutation, deleteMutation } = useCategoryMutations();
  const { mutate: createCategory } = createMutation;
  const { mutate: updateCategory } = updateMutation;
  const { mutate: deleteCategory } = deleteMutation;

  const [editing, setEditing] = useState<CategoryFormSchema | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (cat: CategoryFormSchema) => {
    if (!cat.name?.trim()) return alert("Введите название категории");
    if ((cat.priceCents ?? 0) <= 0) return alert("Цена должна быть больше 0");

    try {
      if (cat.id) {
        await updateCategory({ id: cat.id, data: cat });
      } else {
        await createCategory(cat);
      }

      refetchCategories();
      setEditing(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить категорию");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить эту категорию?")) return;

    try {
      await deleteCategory({ id });
      refetchCategories();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить категорию");
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditing(null);
  };

  const handleCancelForm = () => {
    setEditing(null);
    setIsCreating(false);
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">🏷 Управление категориями мест</h2>

      <button className="btn btn-primary mb-3" onClick={handleCreateNew}>
        ➕ Добавить категорию
      </button>

      {isCreating && (
        <CategoryCreateForm onSave={handleSave} onCancel={handleCancelForm} />
      )}

      {editing && !isCreating && (
        <CategoryEditForm
          category={editing}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      <CategoriesList
        categories={categories}
        onEdit={(category) => {
          setIsCreating(false);
          setEditing(category);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
