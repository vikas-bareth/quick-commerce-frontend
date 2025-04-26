import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider, useSelector } from "react-redux";
import { appStore } from "./utils/appStore";
import PageNotFound from "./components/PageNotFound";
import { BadgeProvider } from "./context/BadgeContext";
import Signup from "./components/Signup";
import ProtectedLayout from "./components/ProtectedLayout";
import CustomerRoutes from "./components/Customer/CustomerRoutes";
import DeliveryRoutes from "./components/Delivery/DeliveryRoutes";

function App() {
  return (
    <Provider store={appStore}>
      <BadgeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Parent Route */}
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<RoleBasedRedirect />} />
              <Route path="customer/*" element={<CustomerRoutes />} />
              <Route path="delivery/*" element={<DeliveryRoutes />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </BadgeProvider>
    </Provider>
  );
}

export default App;

const RoleBasedRedirect = () => {
  const user = useSelector((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  return user.role === "CUSTOMER" ? (
    <Navigate to="/customer" replace />
  ) : user.role === "DELIEVERY" ? (
    <Navigate to="/delivery" replace />
  ) : (
    <Navigate to="/" />
  );
};
