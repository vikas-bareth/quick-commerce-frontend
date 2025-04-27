import { useState, useEffect } from "react";
import axios from "axios";
import {
  APP_BASE_URL,
  GET_DELIVERY_STATS,
  GET_ORDERS_HISTORY,
  GET_PENDING_ORDERS,
  UPDATE_ORDER_STATUS,
} from "../../utils/constants";
import { Link } from "react-router-dom";

const DeliveryDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyRes, pendingRes] = await Promise.all([
        axios.get(APP_BASE_URL + GET_ORDERS_HISTORY, { withCredentials: true }),
        axios.get(APP_BASE_URL + GET_PENDING_ORDERS, { withCredentials: true }),
      ]);

      const calculatedStats = {
        pending: pendingRes.data.orders.filter((o) => o.status === "PENDING")
          .length,
        inProgress: historyRes.data.orders.filter(
          (o) => o.status === "ACCEPTED" || o.status === "OUT_FOR_DELIVERY"
        ).length,
        delivered: historyRes.data.orders.filter(
          (o) => o.status === "DELIVERED"
        ).length,
      };

      setStats(calculatedStats);
      setPendingOrders(pendingRes.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${APP_BASE_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchAllData();
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getStatusAction = (status) => {
    const actions = {
      PENDING: {
        next: "ACCEPTED",
        text: "Accept Order",
        color: "btn-success",
      },
      ACCEPTED: {
        next: "OUT_FOR_DELIVERY",
        text: "Start Delivery",
        color: "btn-primary",
      },
      OUT_FOR_DELIVERY: {
        next: "DELIVERED",
        text: "Mark Delivered",
        color: "btn-primary",
      },
    };
    return actions[status];
  };

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Orders Card */}
        <Link
          to="/delivery/pending-orders"
          className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title text-warning">Pending Orders</h2>
            <p className="text-4xl font-bold">{stats.pending}</p>
            <p className="text-sm text-gray-500">Waiting for acceptance</p>
          </div>
        </Link>

        {/* In Progress Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-info">In Progress</h2>
            <p className="text-4xl font-bold">{stats.inProgress}</p>
            <p className="text-sm text-gray-500">Currently delivering</p>
          </div>
        </div>

        {/* Delivered Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-success">Delivered</h2>
            <p className="text-4xl font-bold">{stats.delivered}</p>
            <p className="text-sm text-gray-500">Completed today</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
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
          {pendingOrders.map((order) => {
            const action = getStatusAction(order.status);

            return (
              <div key={order.id} className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Order #{order.id.slice(-6)}</h3>
                      <p className="text-sm">
                        {order.product} (Qty: {order.quantity})
                      </p>
                      <p className="text-xs mt-1">{order.location}</p>
                    </div>
                    <span
                      className={`badge ${
                        order.status === "PENDING"
                          ? "badge-warning"
                          : order.status === "ACCEPTED"
                          ? "badge-info"
                          : "badge-primary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {action && (
                    <div className="card-actions justify-end mt-3">
                      <button
                        onClick={() => updateOrderStatus(order.id, action.next)}
                        className={`btn btn-sm ${action.color}`}
                      >
                        {action.text}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
