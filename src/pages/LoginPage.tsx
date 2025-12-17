import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../store/auth";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken } = await loginUser(credentials);
      setSession(accessToken);
      navigate("/profile");
    } catch {
      setError("Неверные данные");
    }
  };

  const handleCredentialChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <form
        onSubmit={handleLogin}
        className="d-flex flex-column gap-3 w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-3">Вход</h2>
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={credentials.email}
          onChange={(e) => handleCredentialChange('email', e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form-control"
          value={credentials.password}
          onChange={(e) => handleCredentialChange('password', e.target.value)}
        />
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  );
}
