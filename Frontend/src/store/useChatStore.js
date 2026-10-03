import { create } from "zustand";
import { notify } from "../store/useNotificationStore";
import { parseApiError } from "../lib/errorHandler";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

/**
 * In-Memory Conversation Cache (LRU Eviction)
 * Stores recent conversations in memory for instant switching & background sync.
 */
class ConversationCache {
  constructor(maxConversations = 10, maxMsgsPerConv = 200) {
    this.cache = new Map(); // key: userId -> { messages, hasMore, nextCursor, lastAccessed, lastSyncTime }
    this.maxConversations = maxConversations;
    this.maxMsgsPerConv = maxMsgsPerConv;
  }

  get(userId) {
    if (!this.cache.has(userId)) return null;
    const entry = this.cache.get(userId);
    entry.lastAccessed = Date.now();
    return entry;
  }

  set(userId, data) {
    const existing = this.cache.get(userId) || { messages: [], hasMore: false, nextCursor: null };
    const rawMessages = data.messages !== undefined ? data.messages : existing.messages;

    const uniqueMsgs = [];
    const seenIds = new Set();

    for (const msg of rawMessages) {
      const idKey = msg._id || msg.tempId;
      if (idKey && !seenIds.has(idKey)) {
        seenIds.add(idKey);
        uniqueMsgs.push(msg);
      }
    }

    const trimmedMsgs =
      uniqueMsgs.length > this.maxMsgsPerConv
        ? uniqueMsgs.slice(-this.maxMsgsPerConv)
        : uniqueMsgs;

    this.cache.set(userId, {
      messages: trimmedMsgs,
      hasMore: data.hasMore !== undefined ? data.hasMore : existing.hasMore,
      nextCursor: data.nextCursor !== undefined ? data.nextCursor : existing.nextCursor,
      lastAccessed: Date.now(),
      lastSyncTime: Date.now(),
    });

    this.enforceLRU(userId);
  }

  touchSyncTime(userId) {
    const entry = this.cache.get(userId);
    if (entry) entry.lastSyncTime = Date.now();
  }

  appendSyncMessages(userId, newMessages) {
    if (!newMessages || newMessages.length === 0) return;
    const entry = this.cache.get(userId);
    if (!entry) return;

    const existingIds = new Set(entry.messages.map((m) => m._id || m.tempId));
    const formatted = newMessages
      .filter((m) => !existingIds.has(m._id))
      .map((m) => ({ ...m, status: m.status || "sent" }));

    if (formatted.length > 0) {
      entry.messages = [...entry.messages, ...formatted];
      if (entry.messages.length > this.maxMsgsPerConv) {
        entry.messages = entry.messages.slice(-this.maxMsgsPerConv);
      }
      entry.lastAccessed = Date.now();
    }
    entry.lastSyncTime = Date.now();
  }

  prependOlderMessages(userId, olderMessages, newHasMore, newNextCursor) {
    const entry = this.cache.get(userId);
    if (!entry) return;

    const existingIds = new Set(entry.messages.map((m) => m._id || m.tempId));
    const formatted = olderMessages
      .filter((m) => !existingIds.has(m._id))
      .map((m) => ({ ...m, status: m.status || "sent" }));

    entry.messages = [...formatted, ...entry.messages];
    if (entry.messages.length > this.maxMsgsPerConv) {
      entry.messages = entry.messages.slice(-this.maxMsgsPerConv);
    }
    entry.hasMore = newHasMore;
    entry.nextCursor = newNextCursor;
    entry.lastAccessed = Date.now();
  }

  updateMessage(userId, updatedMsg) {
    let entry = this.cache.get(userId);
    if (!entry) {
      entry = { messages: [], hasMore: false, nextCursor: null, lastAccessed: Date.now(), lastSyncTime: Date.now() };
      this.cache.set(userId, entry);
    }

    const idx = entry.messages.findIndex(
      (m) =>
        m._id === updatedMsg._id ||
        (updatedMsg.tempId && (m._id === updatedMsg.tempId || m.tempId === updatedMsg.tempId))
    );

    if (idx !== -1) {
      entry.messages[idx] = { ...entry.messages[idx], ...updatedMsg };
    } else {
      entry.messages.push(updatedMsg);
    }

    if (entry.messages.length > this.maxMsgsPerConv) {
      entry.messages = entry.messages.slice(-this.maxMsgsPerConv);
    }
    entry.lastAccessed = Date.now();
    this.enforceLRU(userId);
  }

  enforceLRU(activeUserId) {
    if (this.cache.size <= this.maxConversations) return;

    let lruKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (key !== activeUserId && entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  clear() {
    this.cache.clear();
  }
}

const messageCache = new ConversationCache(10, 200);
const activeSyncs = new Set();

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isLoadingMore: false,
  hasMore: false,
  nextCursor: null,

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
    if (!userId) return;

    // 1. Instant Cache Hit: Display cached messages immediately with 0ms delay!
    const cached = messageCache.get(userId);
    if (cached) {
      set({
        messages: cached.messages,
        hasMore: cached.hasMore,
        nextCursor: cached.nextCursor,
        isMessagesLoading: false,
        isLoadingMore: false,
      });

      // Background synchronization for missed messages while away
      get().syncMissedMessages(userId);
      return;
    }

    // 2. Cache Miss: Fetch initial 50 messages from backend
    set({
      isMessagesLoading: true,
      messages: [],
      hasMore: false,
      nextCursor: null,
      isLoadingMore: false,
    });

    try {
      const res = await axiosInstance.get(`/messages/${userId}?limit=50`);
      const data = res.data;

      const fetchedMessages = Array.isArray(data) ? data : data.messages || [];
      const hasMore = Array.isArray(data) ? false : !!data.hasMore;
      const nextCursor = Array.isArray(data) ? null : data.nextCursor || null;

      const formattedMessages = fetchedMessages.map((m) => ({
        ...m,
        status: m.status || "sent",
      }));

      // Update in-memory cache
      messageCache.set(userId, {
        messages: formattedMessages,
        hasMore,
        nextCursor,
      });

      // Update store state if conversation selection matches
      const currentSelected = get().selectedUser;
      if (currentSelected && currentSelected._id === userId) {
        set({
          messages: formattedMessages,
          hasMore,
          nextCursor,
        });
      }
    } catch (error) {
      const errorMsg = parseApiError(error, "Failed to load conversation history.");
      notify.error(errorMsg, "Messages Error");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  syncMissedMessages: async (userId) => {
    const cached = messageCache.get(userId);
    if (!cached || cached.messages.length === 0) return;

    // Cooldown check: if synced within the last 30 seconds, skip HTTP sync
    const COOLDOWN_MS = 30000;
    if (cached.lastSyncTime && Date.now() - cached.lastSyncTime < COOLDOWN_MS) {
      return;
    }

    // In-flight lock: prevent duplicate concurrent HTTP sync requests
    if (activeSyncs.has(userId)) return;
    activeSyncs.add(userId);

    // Get latest server-persisted message ID
    const validServerMsgs = cached.messages.filter((m) => m._id && !m._id.startsWith("temp_"));
    const latestMsg = validServerMsgs[validServerMsgs.length - 1];

    if (!latestMsg?._id) {
      activeSyncs.delete(userId);
      return;
    }

    try {
      const res = await axiosInstance.get(`/messages/${userId}?since=${latestMsg._id}`);
      const newMsgs = res.data.messages || [];

      messageCache.touchSyncTime(userId);

      if (newMsgs.length > 0) {
        messageCache.appendSyncMessages(userId, newMsgs);

        // Update active UI state if currently viewing conversation
        const activeUser = get().selectedUser;
        if (activeUser && activeUser._id === userId) {
          const updatedEntry = messageCache.get(userId);
          if (updatedEntry) {
            set({ messages: updatedEntry.messages });
          }
        }
      }
    } catch (error) {
      console.error("Background sync error:", error);
    } finally {
      activeSyncs.delete(userId);
    }
  },

  loadMoreMessages: async () => {
    const { selectedUser, hasMore, nextCursor, isLoadingMore } = get();
    if (!selectedUser || !hasMore || !nextCursor || isLoadingMore) return;

    set({ isLoadingMore: true });
    const currentUserId = selectedUser._id;

    try {
      const res = await axiosInstance.get(
        `/messages/${currentUserId}?cursor=${nextCursor}&limit=50`
      );
      const data = res.data;

      const fetchedMessages = Array.isArray(data) ? data : data.messages || [];
      const newHasMore = Array.isArray(data) ? false : !!data.hasMore;
      const newNextCursor = Array.isArray(data) ? null : data.nextCursor || null;

      // Update in-memory cache with prepended older messages
      messageCache.prependOlderMessages(
        currentUserId,
        fetchedMessages,
        newHasMore,
        newNextCursor
      );

      // Update active state if conversation hasn't changed
      const activeUser = get().selectedUser;
      if (activeUser && activeUser._id === currentUserId) {
        const cached = messageCache.get(currentUserId);
        if (cached) {
          set({
            messages: cached.messages,
            hasMore: cached.hasMore,
            nextCursor: cached.nextCursor,
          });
        }
      }
    } catch (error) {
      console.error("Error loading older messages:", error);
      const errorMsg = parseApiError(error, "Failed to load older messages.");
      notify.error(errorMsg, "Pagination Error");
    } finally {
      set({ isLoadingMore: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, sendOptimisticMessage } = get();
    if (!selectedUser) return;

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
    const receiverId = optimisticMsg.receiverId;

    // 1. Immediately update store & in-memory cache
    messageCache.updateMessage(receiverId, optimisticMsg);

    const activeUser = get().selectedUser;
    if (activeUser && activeUser._id === receiverId) {
      const cached = messageCache.get(receiverId);
      if (cached) set({ messages: cached.messages });
    }

    // 2. Perform background upload & message save
    try {
      const payload = {
        text: optimisticMsg.text,
        image: optimisticMsg.rawImage,
        tempId: optimisticMsg.tempId,
      };

      const res = await axiosInstance.post(`/messages/send/${receiverId}`, payload, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || progressEvent.loaded;
          const pct = total ? Math.min(99, Math.round((progressEvent.loaded * 100) / total)) : 50;

          const updatedMsg = {
            _id: optimisticMsg.tempId,
            tempId: optimisticMsg.tempId,
            progress: pct,
            status: pct >= 95 ? "saving" : "uploading",
          };

          messageCache.updateMessage(receiverId, updatedMsg);

          if (get().selectedUser?._id === receiverId) {
            const cached = messageCache.get(receiverId);
            if (cached) set({ messages: cached.messages });
          }
        },
      });

      // 3. Reconcile optimistic message with server-confirmed message
      const serverMessage = {
        ...res.data,
        status: "sent",
        progress: 100,
      };

      messageCache.updateMessage(receiverId, serverMessage);

      if (get().selectedUser?._id === receiverId) {
        const cached = messageCache.get(receiverId);
        if (cached) set({ messages: cached.messages });
      }
    } catch (error) {
      console.error("Optimistic send error:", error);

      const failedMsg = {
        _id: optimisticMsg.tempId,
        tempId: optimisticMsg.tempId,
        status: "failed",
        progress: 0,
      };

      messageCache.updateMessage(receiverId, failedMsg);

      if (get().selectedUser?._id === receiverId) {
        const cached = messageCache.get(receiverId);
        if (cached) set({ messages: cached.messages });
      }

      const errorMsg = parseApiError(error, "Failed to deliver message attachment.");
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
      const authUser = useAuthStore.getState().authUser;
      if (!authUser) return;

      const targetUserId =
        newMessage.senderId === authUser._id ? newMessage.receiverId : newMessage.senderId;

      const updatedMsg = { ...newMessage, status: "sent" };
      messageCache.updateMessage(targetUserId, updatedMsg);

      const { selectedUser: currentSelected } = get();
      if (currentSelected && currentSelected._id === targetUserId) {
        const cached = messageCache.get(targetUserId);
        if (cached) {
          set({ messages: cached.messages });
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      const cached = messageCache.get(selectedUser._id);
      if (cached) {
        set({
          messages: cached.messages,
          hasMore: cached.hasMore,
          nextCursor: cached.nextCursor,
          isMessagesLoading: false,
        });
      } else {
        set({
          messages: [],
          hasMore: false,
          nextCursor: null,
          isMessagesLoading: true,
        });
      }
    } else {
      set({
        messages: [],
        hasMore: false,
        nextCursor: null,
        isMessagesLoading: false,
      });
    }
  },

  clearCache: () => {
    messageCache.clear();
    set({
      messages: [],
      hasMore: false,
      nextCursor: null,
      isLoadingMore: false,
      isMessagesLoading: false,
    });
  },
}));