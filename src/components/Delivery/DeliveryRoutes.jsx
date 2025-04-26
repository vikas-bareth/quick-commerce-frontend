import { Routes, Route } from "react-router-dom";
import DeliveryDashboard from "./DeliveryDashboard";
import PendingOrders from "./PendingOrders";

const DeliveryRoutes = () => (
  <Routes>
    <Route index element={<DeliveryDashboard />} />
    <Route path="pending-orders" element={<PendingOrders />} />
  </Routes>
);

export default DeliveryRoutes;
