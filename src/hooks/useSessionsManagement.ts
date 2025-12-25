import { useState } from "react";
import { getFilms } from "../api/movie";
import { getHalls } from "../api/halls";
import { getSesssions, type Session } from "../api/session";
import { useQuery } from "../hooks/query";
import { useCreateSessionMutation, useUpdateSessionMutation, useDeleteSessionMutation } from "../hooks/useSessionMutations";
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

export function useSessionsManagement() {
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

  const { mutate: createSession } = useCreateSessionMutation();
  const { mutate: updateSession } = useUpdateSessionMutation();
  const { mutate: deleteSession } = useDeleteSessionMutation();

  const [editing, setEditing] = useState<SessionFormSchema | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (session: SessionFormSchema) => {
    try {
      if (session.id) {
        await updateSession({ id: session.id, data: session });
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
      await deleteSession({ id });
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

  return {
    movies,
    halls,
    sessions,
    editing,
    isCreating,
    setEditing,
    setIsCreating,
    handleSave,
    handleDelete,
    handleCreateNew,
    handleCancelForm,
    refetchSessions,
  };
}