import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, bootstrapped } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Getting your bearings…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}