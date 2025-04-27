import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_BASE_URL, GET_ORDERS_HISTORY } from "../../utils/constants";
import OrderHistoryCard from "../OrderHistoryCard";

const OrderHistory = () => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(APP_BASE_URL + GET_ORDERS_HISTORY, {
        withCredentials: true,
      });
      setHistoryOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error in fetching order history:", error);
      setError("Failed to load order history. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = historyOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(historyOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    currentPage > 1 && setCurrentPage((prev) => prev - 1);
  };

  const sortedOrders = [...historyOrders].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Order History</h1>
        <button
          onClick={fetchOrderHistory}
          className="btn btn-sm btn-outline"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Loading your order history...</p>
        </div>
      ) : historyOrders.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-gray-500">
            You haven't placed any orders yet.
          </p>
          <Link to="/products" className="btn btn-primary mt-6">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {sortedOrders
              .slice(indexOfFirstOrder, indexOfLastOrder)
              .map((order) => (
                <OrderHistoryCard
                  key={`${order.id}-${order.updatedAt}`}
                  order={order}
                />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="btn-group">
                <button
                  className="btn btn-sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`btn btn-sm ${
                        currentPage === number ? "btn-active" : ""
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  className="btn btn-sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
