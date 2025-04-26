import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireRole = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
