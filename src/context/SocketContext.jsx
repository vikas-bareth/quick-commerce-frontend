import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { APP_BASE_URL } from "../utils/constants";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState({});

  useEffect(() => {
    const newSocket = io(APP_BASE_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("orderStatusUpdated", (update) => {
      setOrderStatusUpdates((prev) => ({
        ...prev,
        [update.orderId]: update,
      }));
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinOrderRoom = (orderId) => {
    if (socket) {
      socket.emit("joinOrderRoom", orderId);
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socket) {
      socket.emit("leaveOrderRoom", orderId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinOrderRoom,
        leaveOrderRoom,
        orderStatusUpdates,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
