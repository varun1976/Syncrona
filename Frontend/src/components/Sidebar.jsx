import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
    .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col flex-shrink-0 min-h-0 overflow-hidden select-none neu-bg border-r border-[var(--border-color)] transition-all duration-200">
      {/* Fixed Sidebar Header with Upward Shift & 44px Search Field */}
      <div className="pt-2.5 pb-3 px-3.5 sm:px-4 space-y-2.5 border-b border-[var(--border-color)] flex-shrink-0">
        {/* Row 1: Heading & Online Count Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl neu-raised-sm flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
              <Users className="size-4" />
            </div>
            <span className="font-bold text-[var(--text-primary)] hidden lg:block tracking-tight text-base">
              Contacts
            </span>
          </div>

          <span className="text-xs px-3 py-1 rounded-full neu-inset-sm font-bold text-[var(--success-color)] hidden lg:block leading-none">
            {Math.max(0, onlineUsers.length - 1)} online
          </span>
        </div>

        {/* Row 2: Search Input (~44px height, Vertically Centered Search Icon) */}
        <div className="hidden lg:block relative">
          <div className="absolute left-3.5 top-0 bottom-0 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 neu-input rounded-2xl pl-10 pr-3.5 text-xs placeholder:text-[var(--placeholder-color)] focus:outline-none"
          />
        </div>

        {/* Row 3: Online Only Filter Toggle */}
        <div className="hidden lg:flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`size-4 rounded neu-btn flex items-center justify-center transition-all flex-shrink-0 ${
              showOnlineOnly ? "neu-inset text-[var(--accent-color)] font-bold" : ""
            }`}
          >
            {showOnlineOnly && <span className="text-[10px]">✓</span>}
          </button>
          <span
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className="text-xs font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]"
          >
            Show online only
          </span>
        </div>
      </div>

      {/* Independently Scrollable Contact List */}
      <div className="overflow-y-auto w-full py-2 px-2 space-y-1 flex-1 min-h-0">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-2.5 lg:px-3 lg:py-2.5 flex items-center gap-3 rounded-xl transition-all duration-150
                cursor-pointer text-left relative group min-w-0
                ${
                  isSelected
                    ? "neu-inset font-semibold text-[var(--text-primary)]"
                    : "hover:bg-[var(--border-color)]/30 text-[var(--text-secondary)]"
                }
              `}
            >
              {/* Selected Bar */}
              {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--accent-color)] rounded-r-full" />
              )}

              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0 flex-shrink-0">
                <div className="size-10 rounded-full neu-raised-sm p-0.5">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
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

              {/* User Details */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-bold text-[16px] text-[var(--text-primary)] tracking-tight truncate leading-snug">
                  {user.fullName}
                </div>
                <div
                  className={`text-xs ${
                    isOnline ? "text-[var(--success-color)] font-medium" : "text-[var(--text-muted)]"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-[var(--text-muted)] py-6 px-3 text-xs font-medium neu-inset-sm rounded-xl my-2">
            No contacts found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;