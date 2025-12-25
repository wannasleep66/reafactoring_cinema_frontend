import { useSessionsManagement } from "../hooks/useSessionsManagement";
import SessionCreateForm from "../components/SessionCreateForm";
import SessionEditForm from "../components/SessionEditForm";
import SessionsList from "../components/SessionsList";

export default function SessionsManagement() {
  const {
    movies,
    halls,
    sessions,
    editing,
    isCreating,
    handleSave,
    handleDelete,
    handleCreateNew,
    handleCancelForm,
    setEditing,
  } = useSessionsManagement();

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
          handleCancelForm();
          setEditing(session);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}