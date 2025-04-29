import { useContext, useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { createContext } from "react";
import { APP_BASE_URL } from "../utils/constants";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(APP_BASE_URL, {
      withCredentials: true,
    });
    newSocket.on("connect", () => {
      console.log("Connected! Socket ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
