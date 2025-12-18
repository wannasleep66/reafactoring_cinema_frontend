import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import type { TokenPayload } from "../api/auth";
import { getAuthToken, setAuthToken, clearAuthToken } from "../utils/auth";

export const AdminRole = "ADMIN";
export const UserRole = "USER";

export type Role = typeof AdminRole | typeof UserRole;

type SessionState = {
  token: string | undefined;
  role: Role | undefined;
};

type SessionContext = {
  session: SessionState | null;
  setSession: (session: string) => void;
  clearSession: () => void;
};

const AuthContext = createContext<SessionContext | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSessionState] = useState<SessionState | null>(null);

  useEffect(() => {
    const raw = getAuthToken();
    if (raw) {
      setSessionState({
        token: raw,
        role: jwtDecode<TokenPayload>(raw).role,
      });
    }
  }, []);

  const setSession = (session: string) => {
    setAuthToken(session);
    const decoded = jwtDecode<TokenPayload>(session);
    setSessionState({
      token: session,
      role: decoded.role,
    });
  };

  const clearSession = () => {
    clearAuthToken();
    setSessionState({
      token: undefined,
      role: undefined,
    });
  };

  return (
    <AuthContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};
