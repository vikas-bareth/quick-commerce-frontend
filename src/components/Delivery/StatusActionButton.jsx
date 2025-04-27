const StatusActionButton = ({ status, orderId, onActionClick }) => {
  const getActionConfig = () => {
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

  const action = getActionConfig();
  if (!action) return null;

  return (
    <button
      onClick={() => onActionClick(orderId, action.next, action.text)}
      className={`btn btn-sm ${action.color}`}
    >
      {action.text}
    </button>
  );
};

export default StatusActionButton;
