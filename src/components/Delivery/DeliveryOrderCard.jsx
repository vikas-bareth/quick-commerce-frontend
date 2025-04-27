import StatusActionButton from "./StatusActionButton";

const DeliveryOrderCard = ({ order, onActionClick }) => {
  const getStatusColor = () => {
    switch (order.status) {
      case "PENDING":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-info";
      case "OUT_FOR_DELIVERY":
        return "badge-primary";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">Order #{order.id.slice(-6)}</h3>
            <p className="text-sm">
              {order.product} (Qty: {order.quantity})
            </p>
            <p className="text-xs mt-1">{order.location}</p>
          </div>
          <span className={`badge ${getStatusColor()}`}>{order.status}</span>
        </div>

        <div className="card-actions justify-end mt-3">
          <StatusActionButton
            status={order.status}
            orderId={order.id}
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderCard;
