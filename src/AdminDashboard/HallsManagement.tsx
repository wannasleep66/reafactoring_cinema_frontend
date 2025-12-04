import React, { useState } from "react";
import {
  createHall,
  deleteHall,
  getHall,
  getHalls,
  updateHall,
  type Hall,
  type Seat,
  type SeatCreate,
} from "../api/halls";
import type { SeatCategory } from "../api/categories";
import { useQuery } from "../hooks/query";

export default function HallsManagement() {
  const { data: halls, refetch: refetchHalls } = useQuery({
    queryFn: () => getHalls().then((res) => res.data),
  });

  const [editing, setEditing] = useState<Hall | null>(null);

  const handleSave = async (hall: HallFormSchema) => {
    try {
      const seats: SeatCreate[] = [];
      hall.rows.forEach((row, i) => {
        for (let j = 0; j < row.seats.length; j++) {
          seats.push({
            row: i + 1,
            number: j + 1,
            categoryId: Number(row.category.id),
          });
        }
      });

      const safeHall = {
        name: hall.name,
        number: hall.number,
        rows: hall.rows.length,
        seats,
      };

      if (hall.id) {
        await updateHall(hall.id, safeHall);
      } else {
        await createHall(safeHall);
      }

      refetchHalls();
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить зал");
    }
  };

  const handleDelete = async (id: Hall["id"]) => {
    if (!window.confirm("Удалить этот зал?")) return;
    try {
      await deleteHall(id);
      refetchHalls();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить зал");
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary mb-4">Управление залами</h2>

      <button className="btn btn-success mb-3" onClick={() => setEditing(null)}>
        ➕ Добавить зал
      </button>

      {editing && (
        <HallForm
          hallId={editing.id!}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {halls?.length === 0 ? (
        <p>Залов пока нет.</p>
      ) : (
        <div className="row">
          {halls?.map((h) => (
            <div key={h.id} className="col-md-6 mb-3">
              <div className="card shadow-sm p-3 text-light">
                <strong>{h.name}</strong> — №{h.number}
                <div className="mt-2 d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => setEditing(h)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(h.id!)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
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
  hallId: Hall["id"];
  onSave: (hall: HallFormSchema) => void;
  onCancel: () => void;
}

function HallForm({ hallId, onSave, onCancel }: HallFormProps) {
  const { data: hall } = useQuery({
    queryFn: () => getHall(hallId).then((res) => res),
  });

  const [form, setForm] = useState<HallFormSchema>({
    id: hall?.id ?? "",
    name: hall?.name ?? "",
    number: hall?.number ?? 0,
    rows:
      hall?.plan.seats.reduce((acc: Row[], seat: Seat) => {
        return acc.map((row) => {
          if (row.number === seat.row) {
            row.seats = [...row.seats, seat];
          }
          return row;
        });
      }, [] as Row[]) ?? [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setForm({ ...form, [name]: value });
    }
  };

  const addRow = () => {
    setForm({
      ...form,
      rows: [
        ...form.rows,
        {
          number: form.rows.length + 1,
          category: hall!.plan.categories[0] || { id: "", name: "" },
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

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5 className="mb-3 text-primary">
        {form.id ? "Редактирование зала" : "Новый зал"}
      </h5>

      <input
        className="form-control mb-2 "
        name="name"
        value={form?.name}
        onChange={handleChange}
        placeholder="Название зала"
      />
      <input
        className="form-control mb-2"
        name="number"
        type="number"
        value={form?.number}
        onChange={handleChange}
        placeholder="Номер зала"
      />

      <h6 className="text-light">Ряды и количество мест:</h6>
      {form.rows.map((row) => (
        <div key={row.number} className="d-flex align-items-center mb-2">
          <span className="me-2 text-light ">Ряд {row.number}:</span>
          <input
            type="number"
            className="form-control me-2"
            style={{ width: "100px" }}
            value={row.seats.length}
          />
          <select
            className="form-control me-2"
            style={{ width: "200px" }}
            value={row.category.id}
            onChange={(e) =>
              handleRowChange(row.number, row.seats.length, e.target.value)
            }
          >
            {hall?.plan.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => removeRow(row.number)}
          >
            ✖
          </button>
        </div>
      ))}

      <button className="btn btn-outline-primary mb-3" onClick={addRow}>
        ➕ Добавить ряд
      </button>

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
