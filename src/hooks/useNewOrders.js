import { useSocket } from "../context/SocketContext";

export const useNewOrders = () => {
  const { newOrders, clearNewOrders } = useSocket();

  return {
    newOrders,
    clearNewOrders,
    hasNewOrders: newOrders.length > 0,
  };
};
