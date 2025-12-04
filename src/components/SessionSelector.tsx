import React, { useState } from "react";
import type { Session } from "../api/session";

interface SessionSelectorProps {
  sessions: Session[] | undefined;
  loadingSessions: boolean;
  onSessionChange?: (session: Session) => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  loadingSessions,
  onSessionChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filteredSessions =
    sessions?.filter((s) => s.startAt.slice(0, 10) === selectedDate) || [];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSession(null);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    onSessionChange?.(session);
  };

  return (
    <div>
      <div className="mb-3">
        <label className="text-light me-2">Выберите дату:</label>
        <input
          type="date"
          className="form-control d-inline-block"
          style={{ width: "200px" }}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>

      <h5 className="mt-4 text-light">Доступные сеансы:</h5>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {loadingSessions && <p>Загрузка сеансов...</p>}
        {!loadingSessions && filteredSessions.length === 0 && (
          <p>Сеансов нет</p>
        )}
        {!loadingSessions &&
          filteredSessions.map((session) => {
            const time = new Date(session.startAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <button
                key={session.id}
                className={`btn btn-primary btn-lg ${
                  selectedSession?.id === session.id ? "active" : ""
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                {time} — Зал
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default SessionSelector;
