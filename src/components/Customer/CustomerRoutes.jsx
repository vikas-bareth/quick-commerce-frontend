import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";
import OrderHistory from "./OrderHistory";
import NewOrder from "./NewOrder";
import OrderDetails from "./OrderDetails";

const CustomerRoutes = () => (
  <Routes>
    <Route index element={<CustomerDashboard />} />
    <Route path="orders" element={<OrderHistory />} />
    <Route path="new-order" element={<NewOrder />} />
    <Route path="orders/:id" element={<OrderDetails />} />
  </Routes>
);

export default CustomerRoutes;
