import { useState, useEffect } from "react";
import axios from "axios";
import {
  APP_BASE_URL,
  GET_ORDERS_HISTORY,
  GET_PENDING_ORDERS,
} from "../../utils/constants";
import DeliveryOrderCard from "./DeliveryOrderCard";
import StatsCard from "./StatsCard";
import ConfirmModal from "./ConfirmModal";
import { useOrderStatusUpdate } from "../../hooks/useOrderStatusUpdate";
import { useSocket } from "../../context/SocketContext";

const DeliveryDashboard = () => {
  const { socket, joinOrderRoom, leaveOrderRoom } = useSocket();
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    delivered: 0,
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyRes, pendingRes] = await Promise.all([
        axios.get(APP_BASE_URL + GET_ORDERS_HISTORY, { withCredentials: true }),
        axios.get(APP_BASE_URL + GET_PENDING_ORDERS, { withCredentials: true }),
      ]);

      const normalizeOrder = (order) => ({
        id: order._id || order.id,
        orderId: order._id || order.id,
        product: order.product,
        quantity: order.quantity || 1,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        customer: order.customer,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt || order.createdAt,
      });

      const pendingOrders = pendingRes.data.orders.map(normalizeOrder);
      const historyOrders = historyRes.data.orders.map(normalizeOrder);

      pendingOrders.forEach((order) => joinOrderRoom(order.id));
      historyOrders.forEach((order) => joinOrderRoom(order.id));

      const inProgress = historyOrders.filter(
        (o) => o.status === "ACCEPTED" || o.status === "OUT_FOR_DELIVERY"
      );

      setPendingOrders(pendingOrders);
      setInProgressOrders(inProgress);
      setStats({
        pending: pendingOrders.length,
        inProgress: inProgress.length,
        delivered: historyOrders.filter((o) => o.status === "DELIVERED").length,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const {
    modalState,
    setModalState,
    updateOrderStatus,
    showStatusUpdateModal,
  } = useOrderStatusUpdate(fetchAllData);

  const handleActionClick = (orderId, newStatus, actionText) => {
    showStatusUpdateModal(orderId, newStatus, actionText);
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      const normalizedOrder = {
        id: newOrder.orderId,
        orderId: newOrder.orderId,
        product: newOrder.product,
        quantity: newOrder.quantity || 1,
        status: newOrder.status,
        deliveryAddress: newOrder.deliveryAddress,
        customer: newOrder.customer || "unknown",
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt || newOrder.createdAt,
      };

      setPendingOrders((prev) => {
        const exists = prev.some((o) => o.id === normalizedOrder.id);
        if (!exists) {
          joinOrderRoom(normalizedOrder.id);
          return [normalizedOrder, ...prev];
        }
        return prev;
      });

      setStats((prev) => ({
        ...prev,
        pending: prev.pending + 1,
      }));
    };

    socket.on("newOrderAvailable", handleNewOrder);
    return () => socket.off("newOrderAvailable", handleNewOrder);
  }, [socket, joinOrderRoom]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (update) => {
      setPendingOrders((prev) => {
        const updated = prev.filter((order) => order.id !== update.orderId);

        if (
          update.newStatus === "ACCEPTED" ||
          update.newStatus === "OUT_FOR_DELIVERY"
        ) {
          setInProgressOrders((prevInProgress) => [
            ...prevInProgress,
            {
              id: update.orderId,
              status: update.newStatus,
              ...update,
            },
          ]);
        }

        return updated;
      });

      setStats((prev) => {
        const newStats = { ...prev };

        if (
          update.newStatus === "ACCEPTED" ||
          update.newStatus === "OUT_FOR_DELIVERY"
        ) {
          newStats.pending = Math.max(0, prev.pending - 1);
          newStats.inProgress = prev.inProgress + 1;
        } else if (update.newStatus === "DELIVERED") {
          newStats.inProgress = Math.max(0, prev.inProgress - 1);
          newStats.delivered = prev.delivered + 1;
        }

        return newStats;
      });
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);
    return () => socket.off("orderStatusUpdated", handleStatusUpdate);
  }, [socket]);

  useEffect(() => {
    return () => {
      pendingOrders.forEach((order) => leaveOrderRoom(order.id));
      inProgressOrders.forEach((order) => leaveOrderRoom(order.id));
    };
  }, [pendingOrders, inProgressOrders, leaveOrderRoom]);

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
