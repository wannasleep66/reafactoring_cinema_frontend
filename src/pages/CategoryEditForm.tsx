import { useEffect, useState } from "react";

type CategoryFormSchema = {
  id?: string;
  name: string;
  priceCents: number;
};

interface CategoryEditFormProps {
  category: CategoryFormSchema;
  onSave: (cat: CategoryFormSchema) => void;
  onCancel: () => void;
}

export default function CategoryEditForm({
  category,
  onSave,
  onCancel,
}: CategoryEditFormProps) {
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
      <h5>Редактирование категории</h5>

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
        value={form.priceCents / 100}
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
