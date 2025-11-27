import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";

const ProtectedLayout: React.FC = () => {
  const { session } = useAuth();

  if (session === null) {
    return <div>Загружаем..</div>;
  }

  if (!session.token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
