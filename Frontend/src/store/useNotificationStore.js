import { create } from "zustand";

const DEFAULT_DURATIONS = {
  success: 3000,
  info: 3000,
  warning: 4000,
  error: 5000,
};

const DEFAULT_TITLES = {
  success: "Success",
  info: "Information",
  warning: "Warning",
  error: "Error",
};

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: ({ type = "info", title, message, duration }) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const finalDuration = duration || DEFAULT_DURATIONS[type] || 3000;
    const finalTitle = title || DEFAULT_TITLES[type] || "Notice";

    const newNotification = {
      id,
      type,
      title: finalTitle,
      message,
      duration: finalDuration,
      isExiting: false,
      createdAt: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    return id;
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isExiting: true } : n
      ),
    }));

    // Remove from array after slide-out animation finishes (300ms)
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 320);
  },

  clearAll: () => set({ notifications: [] }),
}));

// Global static helper for convenience (usable inside stores, interceptors, or components)
export const notify = {
  success: (message, title, options = {}) =>
    useNotificationStore.getState().addNotification({
      type: "success",
      message,
      title: title || "Success",
      ...options,
    }),
  error: (message, title, options = {}) =>
    useNotificationStore.getState().addNotification({
      type: "error",
      message,
      title: title || "Error",
      ...options,
    }),
  warning: (message, title, options = {}) =>
    useNotificationStore.getState().addNotification({
      type: "warning",
      message,
      title: title || "Warning",
      ...options,
    }),
  info: (message, title, options = {}) =>
    useNotificationStore.getState().addNotification({
      type: "info",
      message,
      title: title || "Info",
      ...options,
    }),
  dismiss: (id) => useNotificationStore.getState().dismissNotification(id),
};
