import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, isTokenValid } from "./auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getToken();

  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
