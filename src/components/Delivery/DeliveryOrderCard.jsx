import StatusUpdateButton from "./StatusUpdateButton";

const DeliveryOrderCard = ({ order, onStatusUpdate }) => {
  return (
    <div className="card bg-white shadow-sm rounded-lg mb-4 border border-gray-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">
            Order #{order._id.slice(-6)}
          </h3>
          <span
            className={`badge ${
              order.status === "PENDING"
                ? "badge-warning"
                : order.status === "ACCEPTED"
                ? "badge-info"
                : order.status === "OUT_FOR_DELIVERY"
                ? "badge-primary"
                : "badge-success"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-medium">{order.product}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-medium">{order.quantity}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-medium">{order.location}</p>
          </div>
        </div>

        <div className="card-actions justify-end">
          <StatusUpdateButton
            currentStatus={order.status}
            onUpdate={(newStatus) => onStatusUpdate(order._id, newStatus)}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderCard;
