import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-3 lg:px-4 lg:py-3 border-b border-[var(--border-color)] neu-bg z-10 select-none flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="size-10 rounded-full neu-raised-sm p-0.5 flex items-center justify-center">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="size-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar.png";
                }}
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-2.5 bg-[var(--success-color)] rounded-full ring-2 ring-[var(--surface-color)]" />
            )}
          </div>

          {/* Contact Details */}
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-[var(--text-primary)] tracking-tight truncate">
              {selectedUser.fullName}
            </h3>
            <p className={`text-xs ${isOnline ? "text-[var(--success-color)] font-medium" : "text-[var(--text-muted)]"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="neu-btn p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
          title="Close conversation"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;