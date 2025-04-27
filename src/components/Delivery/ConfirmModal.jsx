const ConfirmModal = ({ isOpen, onClose, onConfirm, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm {actionText}</h3>
        <p className="py-4">
          Are you sure you want to {actionText.toLowerCase()}?
        </p>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${
              actionText.includes("Accept") ? "btn-success" : "btn-primary"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
