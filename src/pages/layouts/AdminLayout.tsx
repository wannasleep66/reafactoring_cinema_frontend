import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminRole } from "../../store/auth";
import HasRole from "../../components/guards/HasRole";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <HasRole role={AdminRole} redirect="/profile">
      <div className="d-flex min-vh-100 bg-dark text-light">
        <div
          className="p-4 border-end border-secondary"
          style={{ width: "250px", backgroundColor: "#1f1f1f" }}
        >
          <h3 className="text-primary mb-4 text-center">🎬 Админ Панель</h3>
          <ul className="list-unstyled">
            <li className="mb-2">
              <button
                className={`btn w-100 ${
                  isActive("/admin/movies") ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => handleNavigation("/admin/movies")}
              >
                Фильмы
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 ${
                  isActive("/admin/halls") ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => handleNavigation("/admin/halls")}
              >
                Залы
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 ${
                  isActive("/admin/categories") ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => handleNavigation("/admin/categories")}
              >
                Категории
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 ${
                  isActive("/admin/sessions") ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => handleNavigation("/admin/sessions")}
              >
                Сеансы
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-grow-1 bg-light text-dark p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </HasRole>
  );
};

export default AdminLayout;