import { Navigate, useLocation } from "react-router-dom";
import useSessionStore from "../hooks/useSessionStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useSessionStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
