import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_BASE_URL, GET_CUSTOMER_ORDERS } from "../../utils/constants";
import OrderCard from "../OrderCard";

const CustomerDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(APP_BASE_URL + GET_CUSTOMER_ORDERS, {
        withCredentials: true,
      });
      setRecentOrders(response?.data?.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setRecentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Welcome to Your Dashboard
          </h1>
          <p className="text-secondary mt-2">
            Here's your recent order activity
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
        {/* Total Orders */}
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">Total Orders</div>
            <div className="stat-value text-primary text-2xl">
              {recentOrders.length}
            </div>
            <div className="stat-desc text-gray-500">All time</div>
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

        {/* Accepted */}
        <div className="stats shadow bg-base border border-gray-100">
          <div className="stat p-4">
            <div className="stat-title text-gray-600">Accepted</div>
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
              In progress
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
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Orders</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-primary">
                No recent orders
              </h3>
              <p className="text-secondary mt-2">
                Get started by placing a new order
              </p>
              <Link to="/customer/new-order" className="btn btn-primary mt-6">
                Place Your First Order
              </Link>
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
