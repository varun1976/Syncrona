import React from "react";
import { useNotificationStore } from "../../store/useNotificationStore";
import NotificationItem from "./NotificationItem";

const NotificationContainer = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  if (!notifications.length) return null;

  return (
    <div
      className="fixed top-16 sm:top-20 right-4 sm:right-6 z-[9999] flex flex-col items-end gap-2.5 max-w-[calc(100vw-2rem)] sm:max-w-md w-full pointer-events-none"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
