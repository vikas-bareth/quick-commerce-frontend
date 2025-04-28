import { useState, useEffect } from "react";
import axios from "axios";

import {
  APP_BASE_URL,
  GET_PENDING_ORDERS,
  UPDATE_ORDER_STATUS,
} from "../../utils/constants";

import ConfirmModal from "./ConfirmModal";
import DeliveryOrderCard from "./DeliveryOrderCard";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    show: false,
    orderId: null,
    newStatus: null,
    actionText: "",
  });

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(APP_BASE_URL + GET_PENDING_ORDERS, {
        withCredentials: true,
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pending orders");
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
        `${APP_BASE_URL}${UPDATE_ORDER_STATUS}/${modalState.orderId}`,
        { status: modalState.newStatus },
        { withCredentials: true }
      );
      setModalState({ ...modalState, show: false });
      fetchPendingOrders();
    } catch (err) {
      setError("Failed to update order status");
      setModalState({ ...modalState, show: false });
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Orders</h1>
        <button
          onClick={fetchPendingOrders}
          className="btn btn-sm btn-outline"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button onClick={fetchPendingOrders} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No pending orders available
          </div>
          <p className="text-sm">All orders have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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

export default PendingOrders;
