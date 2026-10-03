import { create } from "zustand";
import { notify } from "../store/useNotificationStore";
import { parseApiError } from "../lib/errorHandler";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const errorMsg = parseApiError(error, "Failed to load chat contacts.");
      notify.error(errorMsg, "Contacts Error");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Mark loaded history messages as sent
      const formattedMessages = (res.data || []).map((m) => ({
        ...m,
        status: "sent",
      }));
      set({ messages: formattedMessages });
    } catch (error) {
      const errorMsg = parseApiError(error, "Failed to load conversation history.");
      notify.error(errorMsg, "Messages Error");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, sendOptimisticMessage } = get();
    if (!selectedUser) return;

    // Delegate to optimistic handler
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const optimisticMsg = {
      _id: tempId,
      tempId,
      senderId: useAuthStore.getState().authUser?._id,
      receiverId: selectedUser._id,
      text: messageData.text || "",
      image: messageData.previewUrl || messageData.image || "",
      rawImage: messageData.image || "",
      status: messageData.image ? "uploading" : "saving",
      progress: messageData.image ? 0 : 50,
      createdAt: new Date().toISOString(),
    };

    await sendOptimisticMessage(optimisticMsg);
  },

  sendOptimisticMessage: async (optimisticMsg) => {
    const { messages } = get();

    // 1. Immediately render optimistic message in chat
    const exists = messages.some((m) => m._id === optimisticMsg._id || m.tempId === optimisticMsg.tempId);
    if (!exists) {
      set({ messages: [...messages, optimisticMsg] });
    } else {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === optimisticMsg._id || m.tempId === optimisticMsg.tempId
            ? { ...m, ...optimisticMsg, status: "uploading", progress: 0 }
            : m
        ),
      }));
    }

    // 2. Perform background upload & message save
    try {
      const payload = {
        text: optimisticMsg.text,
        image: optimisticMsg.rawImage,
        tempId: optimisticMsg.tempId,
      };

      const res = await axiosInstance.post(
        `/messages/send/${optimisticMsg.receiverId}`,
        payload,
        {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || progressEvent.loaded;
            const pct = total ? Math.min(99, Math.round((progressEvent.loaded * 100) / total)) : 50;
            set((state) => ({
              messages: state.messages.map((m) =>
                m._id === optimisticMsg.tempId || m.tempId === optimisticMsg.tempId
                  ? { ...m, progress: pct, status: pct >= 95 ? "saving" : "uploading" }
                  : m
              ),
            }));
          },
        }
      );

      // 3. Reconcile optimistic message with server-confirmed message
      const serverMessage = res.data;
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === optimisticMsg.tempId || m.tempId === optimisticMsg.tempId
            ? {
                ...serverMessage,
                status: "sent",
                progress: 100,
                // Keep local blob preview image if Cloudinary URL takes time to cache
                image: serverMessage.image || m.image,
              }
            : m
        ),
      }));
    } catch (error) {
      console.error("Optimistic send error:", error);
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === optimisticMsg.tempId || m.tempId === optimisticMsg.tempId
            ? { ...m, status: "failed", progress: 0 }
            : m
        ),
      }));

      const errorMsg = parseApiError(error, "Failed to deliver image attachment.");
      notify.error(errorMsg, "Delivery Failed");
    }
  },

  retryMessage: async (msgToRetry) => {
    const optimisticMsg = {
      ...msgToRetry,
      status: "uploading",
      progress: 0,
    };
    await get().sendOptimisticMessage(optimisticMsg);
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelected, messages } = get();
      if (!currentSelected) return;

      const isFromSelected = newMessage.senderId === currentSelected._id;
      const isToSelected = newMessage.receiverId === currentSelected._id;
      if (!isFromSelected && !isToSelected) return;

      const existingIndex = messages.findIndex(
        (m) =>
          m._id === newMessage._id ||
          (newMessage.tempId && (m._id === newMessage.tempId || m.tempId === newMessage.tempId))
      );

      if (existingIndex !== -1) {
        // Reconcile existing optimistic message
        const updated = [...messages];
        updated[existingIndex] = {
          ...newMessage,
          status: "sent",
          progress: 100,
        };
        set({ messages: updated });
      } else {
        // Incoming message from other user
        set({ messages: [...messages, { ...newMessage, status: "sent" }] });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));