import { useState } from "react";
import { getFilms } from "../api/movie";
import { getHalls } from "../api/halls";
import {
  getSesssions,
  createSession,
  updateSession,
  deleteSession,
} from "../api/session";
import { useQuery } from "../hooks/query";
import SessionCreateForm from "../components/SessionCreateForm";
import SessionEditForm from "../components/SessionEditForm";
import SessionsList from "../components/SessionsList";
import { CONFIG } from "../constants/config";

type SessionFormSchema = {
  id?: string;
  filmId: string;
  hallId: string;
  startAt: string;
  periodicConfig?: {
    period: "EVERY_DAY" | "EVERY_WEEK";
    periodGenerationEndsAt: string;
  };
};

export default function SessionsManagement() {
  const { data: movies } = useQuery({
    queryFn: () => getFilms().then((res) => res.data),
  });
  const { data: halls } = useQuery({
    queryFn: () => getHalls().then((res) => res.data),
  });
  const { data: sessions, refetch: refetchSessions } = useQuery({
    queryFn: () =>
      getSesssions({
        page: CONFIG.PAGINATION.DEFAULT_PAGE,
        size: CONFIG.PAGINATION.SESSIONS_PAGE_SIZE,
      }).then((res) => res.data),
  });
  const [editing, setEditing] = useState<SessionFormSchema | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (session: SessionFormSchema) => {
    try {
      if (session.id) {
        await updateSession(session.id, session);
      } else {
        await createSession(session);
      }
      await refetchSessions();
      setEditing(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Не удалось сохранить сеанс");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить этот сеанс?")) return;
    try {
      await deleteSession(id);
      await refetchSessions();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить сеанс");
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
    <div className="container-fluid">
      <h2 className="text-primary mb-4">🎬 Управление сеансами</h2>

      <button className="btn btn-success mb-3" onClick={handleCreateNew}>
        ➕ Добавить сеанс
      </button>

      {isCreating && (
        <SessionCreateForm
          movies={movies || []}
          halls={halls || []}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      {editing && !isCreating && (
        <SessionEditForm
          session={editing}
          movies={movies || []}
          halls={halls || []}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}

      <SessionsList
        sessions={sessions}
        movies={movies}
        halls={halls}
        onEdit={(session) => {
          setIsCreating(false);
          setEditing(session);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
