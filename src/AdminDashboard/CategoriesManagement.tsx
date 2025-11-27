import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories";
import { useQuery } from "../hooks/query";

export default function CategoriesManagement() {
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: () => getCategories({ page: 0, size: 20 }).then((res) => res.data),
  });

  const [editing, setEditing] = useState<CategoryFormSchema | null>(null);

  const handleSave = async (cat: CategoryFormSchema) => {
    if (!cat.name?.trim()) return alert("Введите название категории");
    if ((cat.priceCents ?? 0) <= 0) return alert("Цена должна быть больше 0");

    try {
      if (cat.id) {
        await updateCategory(cat.id, cat);
      } else {
        await createCategory(cat);
      }

      refetchCategories();
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить категорию");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить эту категорию?")) return;

    try {
      await deleteCategory(id);
      refetchCategories();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить категорию");
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">🏷 Управление категориями мест</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setEditing({ name: "", priceCents: 0 })}
      >
        ➕ Добавить категорию
      </button>

      {editing && (
        <CategoryForm
          category={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <ul className="list-group">
        {categories?.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{c.name}</strong> — {c.priceCents}₽
            </span>
            <span>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => setEditing(c)}
              >
                ✏️ Редактировать
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(c.id!)}
              >
                🗑 Удалить
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CategoryFormSchema {
  id?: string;
  name: string;
  priceCents: number;
}

interface CategoryFormProps {
  category: CategoryFormSchema;
  onSave: (cat: CategoryFormSchema) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState(category);

  useEffect(() => {
    setForm(category);
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "priceCents" ? Number(value) * 100 : value,
    });
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{category.id ? "Редактирование категории" : "Новая категория"}</h5>

      <input
        className="form-control mb-2"
        name="name"
        placeholder="Название категории"
        value={form.name}
        onChange={handleChange}
      />

      <input
        className="form-control mb-3"
        name="priceCents"
        type="number"
        placeholder="Цена (₽)"
        value={form.priceCents}
        onChange={handleChange}
      />

      <div className="d-flex justify-content-end">
        <button className="btn btn-success me-2" onClick={() => onSave(form)}>
          💾 Сохранить
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          ✖ Отмена
        </button>
      </div>
    </div>
  );
}
