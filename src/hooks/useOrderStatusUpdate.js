import { useContext, useState } from "react";
import axios from "axios";
import { APP_BASE_URL, UPDATE_ORDER_STATUS } from "../utils/constants";

export const useOrderStatusUpdate = (fetchDataCallback) => {
  const [modalState, setModalState] = useState({
    show: false,
    orderId: null,
    newStatus: null,
    actionText: "",
  });
  const [error, setError] = useState(null);

  const updateOrderStatus = async () => {
    try {
      await axios.put(
        APP_BASE_URL + UPDATE_ORDER_STATUS(modalState.orderId),
        { status: modalState.newStatus },
        { withCredentials: true }
      );
      setModalState((prev) => ({ ...prev, show: false }));
      if (fetchDataCallback) {
        fetchDataCallback();
      }
    } catch (err) {
      setError("Failed to update order status");
      setModalState((prev) => ({ ...prev, show: false }));
    }
  };

  const showStatusUpdateModal = (orderId, newStatus, actionText) => {
    setModalState({
      show: true,
      orderId,
      newStatus,
      actionText,
    });
  };

  return {
    modalState,
    setModalState,
    error,
    setError,
    updateOrderStatus,
    showStatusUpdateModal,
  };
};
