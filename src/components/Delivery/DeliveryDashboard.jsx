import { useState, useEffect } from "react";
import axios from "axios";
import {
  APP_BASE_URL,
  GET_ORDERS_HISTORY,
  GET_PENDING_ORDERS,
  UPDATE_ORDER_STATUS,
} from "../../utils/constants";
import DeliveryOrderCard from "./DeliveryOrderCard";
import StatsCard from "./StatsCard";
import ConfirmModal from "./ConfirmModal";

const DeliveryDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    delivered: 0,
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    show: false,
    orderId: null,
    newStatus: null,
    actionText: "",
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyRes, pendingRes] = await Promise.all([
        axios.get(APP_BASE_URL + GET_ORDERS_HISTORY, { withCredentials: true }),
        axios.get(APP_BASE_URL + GET_PENDING_ORDERS, { withCredentials: true }),
      ]);

      setStats({
        pending: pendingRes.data.orders.filter((o) => o.status === "PENDING")
          .length,
        inProgress: historyRes.data.orders.filter(
          (o) => o.status === "ACCEPTED" || o.status === "OUT_FOR_DELIVERY"
        ).length,
        delivered: historyRes.data.orders.filter(
          (o) => o.status === "DELIVERED"
        ).length,
      });

      setPendingOrders(pendingRes.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (orderId, newStatus, actionText) => {
    setModalState({
      show: true,
      orderId,
      newStatus,
      actionText,
    });
  };

  const updateOrderStatus = async () => {
    try {
      await axios.put(
        APP_BASE_URL + UPDATE_ORDER_STATUS(modalState.orderId),
        { status: modalState.newStatus },
        { withCredentials: true }
      );
      setModalState({ ...modalState, show: false });
      fetchAllData();
    } catch (err) {
      setError("Failed to update order status");
      setModalState({ ...modalState, show: false });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button onClick={fetchAllData} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Pending Orders"
          value={stats.pending}
          description="Waiting for acceptance"
          color="warning"
          link="/delivery/pending-orders"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          description="Currently delivering"
          color="info"
          link="/delivery/in-progress"
        />
        <StatsCard
          title="Delivered"
          value={stats.delivered}
          description="Completed today"
          color="success"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Orders Ready for Action</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders need action right now
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <DeliveryOrderCard
              key={order.id}
              order={order}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={modalState.show}
        onClose={() => setModalState({ ...modalState, show: false })}
        onConfirm={updateOrderStatus}
        actionText={modalState.actionText}
      />
    </div>
  );
};

export default DeliveryDashboard;
