import React, { createContext, useContext } from "react";
import { useNotificationStore, notify } from "../store/useNotificationStore";
import NotificationContainer from "../components/common/NotificationContainer";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const addNotification = useNotificationStore((state) => state.addNotification);
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const notifications = useNotificationStore((state) => state.notifications);

  const value = {
    notifications,
    notify,
    showNotification: addNotification,
    dismissNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      notifications: [],
      notify,
      showNotification: notify.info,
      dismissNotification: notify.dismiss,
    };
  }
  return context;
};
