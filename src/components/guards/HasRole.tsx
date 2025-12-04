import { Navigate } from "react-router-dom";
import { type Role, useAuth } from "../../store/auth";

const HasRole: React.FC<{
  role: Role;
  children: React.ReactNode;
  redirect: string;
}> = ({ role, redirect, children }) => {
  const { session } = useAuth();

  if (session!.role === role) {
    return children;
  }

  return <Navigate to={redirect} />;
};

export default HasRole;
