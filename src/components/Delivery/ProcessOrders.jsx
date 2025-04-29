import { useState, useEffect } from "react";
import axios from "axios";
import {
  APP_BASE_URL,
  GET_IN_PROGRESS_ORDERS,
  UPDATE_ORDER_STATUS,
} from "../../utils/constants";
import DeliveryOrderCard from "./DeliveryOrderCard";
import ConfirmModal from "./ConfirmModal";
import GoToHomeButton from "../GoToHomeButton";
import { useOrderStatusUpdate } from "../../hooks/useOrderStatusUpdate";

const ProcessOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProcessingOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(APP_BASE_URL + GET_IN_PROGRESS_ORDERS, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch processing orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (orderId, newStatus, actionText) => {
    showStatusUpdateModal(orderId, newStatus, actionText);
  };

  const {
    modalState,
    setModalState,
    error,
    setError,
    updateOrderStatus,
    showStatusUpdateModal,
  } = useOrderStatusUpdate(fetchProcessingOrders);

  useEffect(() => {
    fetchProcessingOrders();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders In Progress</h1>
          <p className="text-gray-500 mt-1">
            Manage orders that are being prepared or delivered
          </p>
        </div>
        <button
          onClick={fetchProcessingOrders}
          className="btn btn-primary btn-outline min-w-[120px]"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </span>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <label>{error}</label>
          </div>
          <button
            onClick={fetchProcessingOrders}
            className="btn btn-sm btn-ghost"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No orders in progress
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            All orders are either pending or have been completed. Check back
            later for new orders.
          </p>
          <div>
            <GoToHomeButton label="Go to home" />
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-base-100 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <DeliveryOrderCard order={order} />
              </div>

              {/* Action Buttons */}
              <div className="bg-base-100 px-6 py-4 flex justify-end space-x-3">
                {order.status === "ACCEPTED" && (
                  <button
                    onClick={() =>
                      handleActionClick(
                        order.id,
                        "OUT_FOR_DELIVERY",
                        "Start Delivery"
                      )
                    }
                    className="btn btn-outline btn-info px-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Start Delivery
                  </button>
                )}
                {(order.status === "OUT_FOR_DELIVERY" ||
                  order.status === "ACCEPTED") && (
                  <button
                    onClick={() =>
                      handleActionClick(order.id, "DELIVERED", "Mark Delivered")
                    }
                    className="btn btn-success px-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
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

export default ProcessOrders;
