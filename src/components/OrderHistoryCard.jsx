import { Link } from "react-router-dom";
import { statusConfig } from "../utils/statusConfig";

const OrderHistoryCard = ({ order }) => {
  const status = statusConfig[order.status] || statusConfig.PENDING;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200 mb-4">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className={`badge ${status.color} badge-sm text-white`}>
              {status.icon}
            </span>
            {order.product}
          </h3>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="font-medium">{order.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-medium">{status.description}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Delivery Address</p>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            Order ID: #{order.id.slice(-6)}
          </span>
          <Link
            to={`/orders/${order.id}`}
            className="btn btn-sm btn-ghost text-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
