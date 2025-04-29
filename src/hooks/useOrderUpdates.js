import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export const useOrderUpdates = (orderId, onUpdate) => {
  const { joinOrderRoom, leaveOrderRoom, orderStatusUpdates } = useSocket();

  useEffect(() => {
    if (!orderId) return;

    joinOrderRoom(orderId);

    return () => {
      leaveOrderRoom(orderId);
    };
  }, [orderId, joinOrderRoom, leaveOrderRoom]);

  useEffect(() => {
    if (orderId && orderStatusUpdates[orderId]) {
      onUpdate(orderStatusUpdates[orderId]);
    }
  }, [orderStatusUpdates, orderId, onUpdate]);
};
