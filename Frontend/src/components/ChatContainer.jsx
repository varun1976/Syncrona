import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

      {/* Independently Scrollable Message Stream */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3.5 flex flex-col">
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

            return (
              <div
                key={message._id}
                className={`flex items-end gap-2.5 min-w-0 ${isMe ? "justify-end" : "justify-start"}`}
                ref={messageEndRef}
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

                {/* Message Outer Flex Container with WhatsApp Max-Width Ceiling */}
                <div
                  className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[520px] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* Timestamp */}
                  <div className="text-[10px] text-[var(--text-muted)] mb-1 px-1 font-medium select-none">
                    {formatMessageTime(message.createdAt)}
                  </div>

                  {/* Content-Fitted Bubble */}
                  <div
                    className={`w-fit rounded-2xl p-3 text-sm leading-relaxed tracking-wide transition-all ${
                      isMe
                        ? "msg-bubble-outgoing rounded-br-none"
                        : "msg-bubble-incoming rounded-bl-none"
                    }`}
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "normal",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Image Attachment - Constrained Compact Dimensions */}
                    {message.image && (
                      <div className="mb-2 neu-inset p-1 rounded-xl overflow-hidden max-w-[280px] sm:max-w-[320px] mx-auto">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-h-[200px] sm:max-h-[240px] max-w-full w-auto block object-contain rounded-lg mx-auto"
                        />
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