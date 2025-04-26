import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import RequireRole from "./components/RequireRole";

function App() {
  return (
    <Provider store={appStore}>
      <BadgeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Parent Route */}
            <Route path="/" element={<ProtectedLayout />}>
              <Route index element={<RoleBasedRedirect />} />

              <Route
                path="customer/*"
                element={
                  <RequireRole allowedRoles={["CUSTOMER"]}>
                    <CustomerRoutes />
                  </RequireRole>
                }
              />
              <Route
                path="delivery/*"
                element={
                  <RequireRole allowedRoles={["DELIVERY"]}>
                    <DeliveryRoutes />
                  </RequireRole>
                }
              />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </BadgeProvider>
    </Provider>
  );
}

export default App;
