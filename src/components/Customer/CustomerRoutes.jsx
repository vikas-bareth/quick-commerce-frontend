import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";
import OrderHistory from "./OrderHistory";
import NewOrder from "./NewOrder";

const CustomerRoutes = () => (
  <Routes>
    <Route index element={<CustomerDashboard />} />
    <Route path="orders" element={<OrderHistory />} />
    <Route path="new-order" element={<NewOrder />} />
  </Routes>
);

export default CustomerRoutes;
