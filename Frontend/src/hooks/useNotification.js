import { useNotificationContext, notify } from "../context/NotificationContext";

export const useNotification = () => {
  const context = useNotificationContext();

  return {
    notify,
    showNotification: context.showNotification,
    dismissNotification: context.dismissNotification,
    notifications: context.notifications,
  };
};

export default useNotification;
