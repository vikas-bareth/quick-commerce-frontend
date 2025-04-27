import { useState, useEffect } from "react";
import axios from "axios";
import {
  APP_BASE_URL,
  GET_DELIVERY_STATS,
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Parallel requests
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(APP_BASE_URL + GET_DELIVERY_STATS, { withCredentials: true }),
        axios.get(APP_BASE_URL + GET_PENDING_ORDERS, { withCredentials: true }),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${APP_BASE_URL}${UPDATE_ORDER_STATUS}/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const getNextAction = (currentStatus) => {
    const actions = {
      PENDING: { next: "ACCEPTED", text: "Accept Order", color: "btn-success" },
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
    return actions[currentStatus] || null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button onClick={fetchData} className="btn btn-sm btn-ghost">
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
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders need action right now
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const action = getNextAction(order.status);

            return (
              <div key={order._id} className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        Order #{order._id.slice(-6)}
                      </h3>
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
                        onClick={() =>
                          handleStatusUpdate(order._id, action.next)
                        }
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
