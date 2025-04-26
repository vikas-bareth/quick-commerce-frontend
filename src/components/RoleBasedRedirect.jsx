import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const user = useSelector((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "CUSTOMER":
      return <Navigate to="/customer" replace />;
    case "DELIVERY":
      return <Navigate to="/delivery" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;
