import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffRoute() {
  const { user } = useAuth();

  if (!user?.is_staff) {
    return <Navigate to="/groups" replace />;
  }

  return <Outlet />;
}
