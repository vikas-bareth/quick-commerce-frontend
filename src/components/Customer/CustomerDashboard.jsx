import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_BASE_URL, GET_CUSTOMER_ORDERS } from "../../utils/constants";
import OrderCard from "../OrderCard";
import { useSocket } from "../../context/SocketContext";

const CustomerDashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { joinOrderRoom, leaveOrderRoom, orderStatusUpdates } = useSocket();

  const fetchRecentOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(APP_BASE_URL + GET_CUSTOMER_ORDERS, {
        withCredentials: true,
      });
      // if (response.status === 401) {
      //   navigate("/login");
      // }
      const orders = response?.data?.orders || [];
      setAllOrders(orders);
      orders.forEach((order) => {
        joinOrderRoom(order.id);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setAllOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  useEffect(() => {
    if (orderStatusUpdates) {
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          orderStatusUpdates[order.id]
            ? {
                ...order,
                status: orderStatusUpdates[order.id].newStatus,
                updatedAt: orderStatusUpdates[order.id].updatedAt,
                ...(orderStatusUpdates[order.id].deliveryPartner && {
                  deliveryPartner: orderStatusUpdates[order.id].deliveryPartner,
                }),
              }
            : order
        )
      );
    }
  }, [orderStatusUpdates]);

  useEffect(() => {
    return () => {
      allOrders.forEach((order) => {
        leaveOrderRoom(order.id);
      });
    };
  }, [allOrders, leaveOrderRoom]);

  useEffect(() => {
    fetchRecentOrders();
    return () => {
      allOrders.forEach((order) => {
        leaveOrderRoom(order.id);
      });
    };
  }, []);

  const getRecentOrders = () => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    return allOrders
      .filter((order) => new Date(order.createdAt) >= twelveHoursAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const recentOrders = getRecentOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Welcome to Your Dashboard
          </h1>
          <p className="text-secondary mt-2">
            {recentOrders.length > 0
              ? "Your recent orders from the past 12 hours"
              : "Recent order activity will appear here"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link to="/customer/new-order" className="btn btn-primary gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Place New Order
          </Link>
          <Link to="/customer/orders" className="btn btn-outline gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            View All Orders
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">Recent Orders</div>
            <div className="stat-value text-primary text-2xl">
              {recentOrders.length}
            </div>
            <div className="stat-desc text-gray-500">Last 12 hours</div>
          </div>
        </div>

        {/* Pending */}
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">Pending</div>
            <div className="stat-value text-warning text-2xl">
              {recentOrders.filter((o) => o.status === "PENDING").length}
            </div>
            <div className="stat-desc flex items-center gap-1 text-gray-500">
              <span className="loading loading-spinner loading-xs text-warning"></span>
              Awaiting acceptance
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">In Progress</div>
            <div className="stat-value text-info text-2xl">
              {
                recentOrders.filter(
                  (o) =>
                    o.status === "ACCEPTED" || o.status === "OUT_FOR_DELIVERY"
                ).length
              }
            </div>
            <div className="stat-desc flex items-center gap-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-info"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Being processed
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">Delivered</div>
            <div className="stat-value text-success text-2xl">
              {recentOrders.filter((o) => o.status === "DELIVERED").length}
            </div>
            <div className="stat-desc flex items-center gap-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-success"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Successfully delivered
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card bg-base-100 shadow-lg mt-6">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Recent Orders</h2>
            <div className="badge badge-info">Last 12 hours</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-primary mt-4">
                No recent orders
              </h3>
              <p className="text-secondary mt-2">
                You haven't placed any orders in the last 12 hours
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  role="CUSTOMER"
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
