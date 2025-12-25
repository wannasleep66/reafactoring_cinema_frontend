import React, { useState, useEffect } from "react";
import { getHall, type Hall, type Seat, type SeatCreate } from "../api/halls";
import type { SeatCategory } from "../api/categories";
import { useQuery } from "../hooks/query";

interface Row {
  number: number;
  seats: Seat[];
  category: SeatCategory;
}

interface HallFormSchema {
  id?: string;
  name: string;
  number: number;
  rows: Row[];
}

interface HallFormProps {
  hallId: string | null; // null для создания нового зала
  onSave: (hall: Partial<HallFormSchema>) => void;
  onCancel: () => void;
}

export default function HallForm({ hallId, onSave, onCancel }: HallFormProps) {
  const [form, setForm] = useState<HallFormSchema>({
    id: undefined,
    name: "",
    number: 0,
    rows: [],
  });

  // Загрузка данных при редактировании
  const { data: hall, loading } = useQuery({
    queryFn: () => hallId ? getHall(hallId).then((res) => res) : Promise.resolve(null),
    enabled: !!hallId,
  });

  useEffect(() => {
    if (hallId && hall) {
      setForm({
        id: hall.id,
        name: hall.name || "",
        number: hall.number || 0,
        rows: hall.plan?.seats?.reduce((acc: Row[], seat: Seat) => {
          let row = acc.find(r => r.number === seat.row);
          if (!row) {
            row = {
              number: seat.row,
              seats: [],
              category: hall.plan.categories.find(c => c.id === seat.categoryId) || { id: "", name: "" },
            };
            acc.push(row);
          }
          row.seats.push(seat);
          return acc;
        }, [] as Row[]) || [],
      });
    } else if (!hallId) {
      // Для создания нового зала
      setForm({
        id: undefined,
        name: "",
        number: 0,
        rows: [],
      });
    }
  }, [hall, hallId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addRow = () => {
    setForm({
      ...form,
      rows: [
        ...form.rows,
        {
          number: form.rows.length + 1,
          category: { id: "", name: "Обычное" }, // использовать категорию по умолчанию или загрузить список
          seats: [],
        },
      ],
    });
  };

  const removeRow = (id: number) => {
    setForm({ ...form, rows: form.rows.filter((r) => r.number !== id) });
  };

  const handleRowChange = (
    id: number,
    seatsCount: number,
    categoryId: string
  ) => {
    setForm({
      ...form,
      rows: form.rows.map((r) =>
        r.number === id ? { ...r, seatsCount, categoryId } : r
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (hallId && loading) {
    return <div>Загрузка данных зала...</div>;
  }

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">
        {form.id ? "Редактирование зала" : "Новый зал"}
      </h5>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название зала"
          required
        />
        <input
          className="form-control mb-2"
          name="number"
          type="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Номер зала"
          required
          min="1"
        />

        <h6 className="text-light">Ряды и количество мест:</h6>
        {form.rows.map((row) => (
          <div key={row.number} className="d-flex align-items-center mb-2">
            <span className="me-2 text-light">Ряд {row.number}:</span>
            <input
              type="number"
              className="form-control me-2"
              style={{ width: "100px" }}
              value={row.seats.length}
              readOnly
            />
            <select
              className="form-control me-2"
              style={{ width: "200px" }}
              value={row.category.id}
              onChange={(e) =>
                handleRowChange(row.number, row.seats.length, e.target.value)
              }
            >
              <option value="">Выберите категорию</option>
              {/* Здесь нужно будет подключить список категорий */}
            </select>
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={() => removeRow(row.number)}
            >
              ✖
            </button>
          </div>
        ))}

        <button className="btn btn-outline-primary mb-3" type="button" onClick={addRow}>
          ➕ Добавить ряд
        </button>

        <div className="d-flex justify-content-end">
          <button className="btn btn-success me-2" type="submit">
            💾 Сохранить
          </button>
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            ✖ Отмена
          </button>
        </div>
      </form>
    </div>
  );
}