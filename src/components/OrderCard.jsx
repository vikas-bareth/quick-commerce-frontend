import { Link } from "react-router-dom";
import { statusConfig } from "../utils/statusConfig";
import axios from "axios";
import { APP_BASE_URL } from "../utils/constants";

const OrderCard = ({ order, role, onStatusUpdate }) => {
  const currentStatus = statusConfig[order.status] || statusConfig.Pending;

  const handleStatusUpdate = () => {
    if (currentStatus.nextStatus && onStatusUpdate) {
      onStatusUpdate(order.id, currentStatus.nextStatus);
    }
  };

  const handleCancel = async () => {
    if (
      onStatusUpdate &&
      confirm("Are you sure you want to cancel this order?")
    ) {
      onStatusUpdate(order.id, "Cancelled");
      const response = await axios.post(
        `${APP_BASE_URL}/orders/cancel/${order.id}`,
        {},
        { withCredentials: true }
      );
    }
  };

  return (
    <div className="card bg-base-100 w-full shadow-sm hover:shadow-md transition-all duration-200 border border-base-200 hover:border-primary/20 hover:cursor-pointer">
      <div className="card-body p-5">
        {/* Header with order ID and status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="card-title text-lg font-semibold flex items-center gap-2">
              <span className="text-primary">#{order.id.slice(-6)}</span>
              <span
                className={`badge ${currentStatus?.color} badge-sm text-white`}
              >
                {currentStatus?.icon} {order.status}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ordered on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Order details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-base-200/50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-1">PRODUCT</p>
            <p className="font-medium">{order.product}</p>
          </div>
          <div className="bg-base-200/50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-1">QUANTITY</p>
            <p className="font-medium">{order.quantity}</p>
          </div>
          <div className="bg-base-200/50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-1">
              DELIVERY TO
            </p>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
          <div className="bg-base-200/50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-1">STATUS</p>
            <p className="font-medium text-sm">{currentStatus?.description}</p>
          </div>
        </div>

        {/* Status timeline */}
        {order.status === "CANCELED" ? (
          <></>
        ) : (
          <div className="mb-5">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              DELIVERY PROGRESS
            </div>
            <div className="steps steps-horizontal">
              <div
                className={`step ${
                  order.status === "PENDING"
                    ? "step-primary"
                    : order.status !== "PENDING"
                    ? "step-primary"
                    : ""
                }`}
              >
                Pending
              </div>
              <div
                className={`step ${
                  order.status === "ACCEPTED"
                    ? "step-primary"
                    : ["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status)
                    ? "step-primary"
                    : ""
                }`}
              >
                Accepted
              </div>
              <div
                className={`step ${
                  order.status === "OUT_FOR_DELIVERY"
                    ? "step-primary"
                    : order.status === "DELIVERED"
                    ? "step-primary"
                    : ""
                }`}
              >
                On the way
              </div>
              <div
                className={`step ${
                  order.status === "DELIVERED" ? "step-primary" : ""
                }`}
              >
                Delivered
              </div>
            </div>
          </div>
        )}

        {/* Role-specific actions */}
        <div className="card-actions justify-end">
          {role === "CUSTOMER" && (
            <div className="flex gap-2">
              <Link
                to={`/customer/orders/${order.id}`}
                className="btn btn-sm btn-outline border-gray-300 hover:border-primary hover:bg-primary/10"
              >
                View Details
              </Link>
              {order.status === "PENDING" && (
                <button
                  className="btn btn-sm btn-error hover:bg-error/90"
                  onClick={handleCancel}
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}

          {role === "DELIVERY" && (
            <div className="flex gap-2">
              {currentStatus?.nextAction && (
                <button
                  onClick={handleStatusUpdate}
                  className={`btn btn-sm ${currentStatus?.buttonClass} hover:${currentStatus?.buttonClass}/90`}
                >
                  {currentStatus?.nextAction}
                </button>
              )}
              <Link
                to={`/delivery/orders/${order.id}`}
                className="btn btn-sm btn-outline border-gray-300 hover:border-primary hover:bg-primary/10"
              >
                Order Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
