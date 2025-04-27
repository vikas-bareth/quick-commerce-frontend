import { Routes, Route } from "react-router-dom";
import DeliveryDashboard from "./DeliveryDashboard";
import PendingOrders from "./PendingOrders";
import ProcessOrders from "./ProcessOrders";

const DeliveryRoutes = () => (
  <Routes>
    <Route index element={<DeliveryDashboard />} />
    <Route path="pending-orders" element={<PendingOrders />} />
    <Route path="in-progress" element={<ProcessOrders />} />
  </Routes>
);

export default DeliveryRoutes;
