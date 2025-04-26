import React, { createContext, useState, useContext } from "react";

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  const [badge, setBadge] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showBadge = (message, type = "success") => {
    setBadge({ show: true, message, type });
    setTimeout(
      () => setBadge({ show: false, message: "", type: "success" }),
      3000
    );
  };

  return (
    <BadgeContext.Provider value={{ badge, showBadge }}>
      {children}
      {badge.show && (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2">
          <div className={`badge badge-${badge.type} text-lg px-6 py-3`}>
            {badge.message}
          </div>
        </div>
      )}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => useContext(BadgeContext);
