import { useChatStore } from "../store/useChatStore";
import { useEffect, useLayoutEffect, useRef } from "react";
import { MessageSquare, Loader2, AlertCircle, RotateCcw, Check } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    retryMessage,
    hasMore,
    loadMoreMessages,
    isLoadingMore,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const scrollContainerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const shouldMaintainScrollRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    isFirstLoadRef.current = true;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Trigger loadMoreMessages when user scrolls near the top
    if (container.scrollTop <= 60 && hasMore && !isLoadingMore) {
      prevScrollHeightRef.current = container.scrollHeight;
      shouldMaintainScrollRef.current = true;
      loadMoreMessages();
    }
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !messages) return;

    if (shouldMaintainScrollRef.current) {
      // Prepended older messages: adjust scrollTop to preserve viewport position
      const newScrollHeight = container.scrollHeight;
      const heightDiff = newScrollHeight - prevScrollHeightRef.current;
      container.scrollTop = container.scrollTop + heightDiff;
      shouldMaintainScrollRef.current = false;
    } else if (isFirstLoadRef.current) {
      // Initial load of conversation: scroll to bottom
      container.scrollTop = container.scrollHeight;
      if (messages.length > 0) {
        isFirstLoadRef.current = false;
      }
    } else {
      // Incoming or outgoing message arrival
      const lastMessage = messages[messages.length - 1];
      const isMyMessage = lastMessage?.senderId === authUser?._id;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = distanceFromBottom <= 180;

      if (isMyMessage || isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, authUser._id]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden neu-bg">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden neu-bg">
      {/* Fixed Chat Header at top of conversation panel */}
      <ChatHeader />

      {/* Independently Scrollable Message Stream with Infinite Scroll */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3.5 flex flex-col"
      >
        {/* Loading Indicator for Older Messages */}
        {isLoadingMore && (
          <div className="flex justify-center items-center py-2 text-[var(--accent-color)]">
            <div className="flex items-center gap-2 neu-inset px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)]">
              <Loader2 className="size-3.5 animate-spin text-[var(--accent-color)]" />
              <span>Loading older messages...</span>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          /* Friendly Empty Conversation State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none my-auto">
            <div className="size-14 rounded-2xl neu-raised flex items-center justify-center text-[var(--accent-color)] mb-3">
              <MessageSquare className="size-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight mb-1">
              Say hello and start a conversation!
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] max-w-xs leading-relaxed">
              Your conversation starts here. Send a message to connect with {selectedUser?.fullName || "this contact"}.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === authUser._id;
            const isUploading = message.status === "uploading";
            const isSaving = message.status === "saving";
            const isFailed = message.status === "failed";

            return (
              <div
                key={message._id || message.tempId}
                className={`flex items-end gap-2.5 min-w-0 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Incoming Avatar */}
                {!isMe && (
                  <div className="size-8 rounded-full neu-raised-sm p-0.5 flex-shrink-0 mb-0.5">
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                      className="size-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.png";
                      }}
                    />
                  </div>
                )}

                {/* Message Outer Flex Container */}
                <div
                  className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[520px] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* Timestamp & Sent Status */}
                  <div className="text-[10px] text-[var(--text-muted)] mb-1 px-1 font-medium select-none flex items-center gap-1">
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isMe && (
                      <span className="flex items-center ml-0.5">
                        {isUploading || isSaving ? (
                          <Loader2 className="size-3 animate-spin text-[var(--accent-color)]" />
                        ) : isFailed ? (
                          <span className="text-[var(--error-color)] font-bold text-[10px]">Failed</span>
                        ) : (
                          <Check className="size-3 text-[var(--accent-color)]" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Content-Fitted Bubble */}
                  <div
                    className={`w-fit rounded-2xl p-3 text-sm leading-relaxed tracking-wide transition-all ${
                      isMe
                        ? "msg-bubble-outgoing rounded-br-none"
                        : "msg-bubble-incoming rounded-bl-none"
                    } ${isFailed ? "border-2 border-[var(--error-color)]" : ""}`}
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "normal",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Image Attachment with Optimistic Overlay & Progress */}
                    {message.image && (
                      <div className="relative mb-2 neu-inset p-1 rounded-xl overflow-hidden max-w-[280px] sm:max-w-[320px] mx-auto group">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className={`max-h-[200px] sm:max-h-[240px] max-w-full w-auto block object-contain rounded-lg mx-auto transition-opacity ${
                            isUploading || isSaving ? "opacity-75 brightness-90" : ""
                          } ${isFailed ? "opacity-50 grayscale-[30%]" : ""}`}
                        />

                        {/* Upload Progress Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 rounded-xl text-white transition-all">
                            <Loader2 className="size-6 animate-spin text-white mb-2" />
                            <div className="w-3/4 bg-white/30 h-1.5 rounded-full overflow-hidden mb-1">
                              <div
                                className="bg-[var(--accent-color,#3b82f6)] h-full transition-all duration-300 ease-out"
                                style={{ width: `${message.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-white/90">
                              Uploading {message.progress ? `${message.progress}%` : ""}
                            </span>
                          </div>
                        )}

                        {/* Saving State Overlay */}
                        {isSaving && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 rounded-xl text-white transition-all">
                            <Loader2 className="size-6 animate-spin text-white mb-1.5" />
                            <span className="text-[11px] font-semibold text-white/90">
                              Saving message...
                            </span>
                          </div>
                        )}

                        {/* Failed State Overlay & Retry Action */}
                        {isFailed && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 rounded-xl text-white transition-all">
                            <div className="size-8 rounded-full bg-[var(--error-color)] text-white flex items-center justify-center mb-1.5 shadow-md">
                              <AlertCircle className="size-5" />
                            </div>
                            <span className="text-[11px] font-bold text-white mb-2 text-center">
                              Upload Failed
                            </span>
                            <button
                              onClick={() => retryMessage(message)}
                              className="px-3 py-1 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/30 shadow-sm"
                              type="button"
                              title="Retry send"
                            >
                              <RotateCcw className="size-3.5" />
                              <span>Retry</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text Content */}
                    {message.text && (
                      <span
                        className="inline-block min-w-0 max-w-full"
                        style={{
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          wordBreak: "normal",
                        }}
                      >
                        {message.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Outgoing Avatar */}
                {isMe && (
                  <div className="size-8 rounded-full neu-raised-sm p-0.5 flex-shrink-0 mb-0.5">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                      className="size-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.png";
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Composer at bottom */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;