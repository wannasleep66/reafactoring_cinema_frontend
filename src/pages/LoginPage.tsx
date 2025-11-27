import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken } = await loginUser({ email, password });
      setSession(accessToken);
      navigate("/profile");
    } catch {
      setError("Неверные данные");
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  );
}
