import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import * as movie from "./api/movie";
import { AdminRole, UserRole } from "./store/auth";
import RootLayout from "./pages/layouts/RootLayout";
import HasRole from "./components/guards/HasRole";
import ProtectedLayout from "./pages/layouts/ProtectedLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/admin"
              element={
                <HasRole role={AdminRole} redirect="/profile">
                  <AdminDashboard />
                </HasRole>
              }
            />
            <Route
              path="/profile"
              element={
                <HasRole role={UserRole} redirect="/admin">
                  <UserProfilePage />
                </HasRole>
              }
            />
          </Route>
          <Route path="/home" element={<HomePage />} />
          <Route path="/films/:id" element={<MovieDetailsWrapper />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

function MovieDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<movie.Film | null>(null);

  useEffect(() => {
    if (!id) return;
    movie.getFilm(id).then(setFilm);
  }, [id]);

  if (!film) return <div className="text-center mt-5">Загрузка фильма...</div>;
}
