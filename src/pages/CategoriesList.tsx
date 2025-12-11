import { formatCents } from "../utils/money";

type CategoryFormSchema = {
  id?: string;
  name: string;
  priceCents: number;
};

interface CategoriesListProps {
  categories: CategoryFormSchema[] | undefined;
  onEdit: (category: CategoryFormSchema) => void;
  onDelete: (id: string) => void;
}

export default function CategoriesList({
  categories,
  onEdit,
  onDelete,
}: CategoriesListProps) {
  return (
    <ul className="list-group">
      {categories?.map((c) => (
        <li
          key={c.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            <strong>{c.name}</strong> — {formatCents(c.priceCents)}
          </span>
          <span>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => onEdit(c)}
            >
              ✏️ Редактировать
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(c.id!)}
            >
              🗑 Удалить
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
