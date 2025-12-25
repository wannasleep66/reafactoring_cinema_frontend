import React, { useState } from "react";
import {
  createHall,
  deleteHall,
  getHalls,
  updateHall,
  type Hall,
  type Seat,
  type SeatCreate,
} from "../api/halls";
import { useQuery } from "../hooks/query";
import { CONFIG } from "../constants/config";
import HallsList from "../components/HallsList";
import HallForm from "../components/HallForm";

export default function HallsManagement() {
  const { data: halls, refetch: refetchHalls } = useQuery({
    queryFn: () => getHalls().then((res) => res.data),
  });

  const [editing, setEditing] = useState<Hall | null>(null);

  const handleSave = async (hallData: Partial<{ id?: string; name: string; number: number; rows: any[] }>) => {
    try {
      // Преобразование данных для API
      const seats: SeatCreate[] = [];
      (hallData.rows || []).forEach((row, i) => {
        for (let j = 0; j < (row.seats?.length || 0); j++) {
          seats.push({
            row: i + 1,
            number: j + 1,
            categoryId: row.category.id,
          });
        }
      });

      const hallToSend = {
        name: hallData.name || "",
        number: hallData.number || 0,
        rows: (hallData.rows?.length || 0),
        seats,
      };

      if (hallData.id) {
        await updateHall(hallData.id, hallToSend);
      } else {
        await createHall(hallToSend);
      }

      refetchHalls();
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить зал");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить этот зал?")) return;
    try {
      await deleteHall(id);
      refetchHalls();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить зал");
    }
  };

  const startCreating = () => {
    setEditing({
      id: undefined,
      name: "",
      number: 0,
      plan: {
        seats: [],
        categories: [],
      },
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary mb-4">Управление залами</h2>

      <button className="btn btn-success mb-3" onClick={startCreating}>
        ➕ Добавить зал
      </button>

      {editing && (
        <HallForm
          hallId={editing.id || null}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <HallsList
        halls={halls}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}