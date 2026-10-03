import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Headphones, LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="neu-raised fixed w-full top-0 z-40 h-14 sm:h-16 transition-all select-none border-b border-[var(--border-color)]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="size-9 rounded-xl neu-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4 text-[var(--accent-color)]" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                Syncrona
              </h1>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              to={"/settings"}
              className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            <Link
              to={"/contact"}
              className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Support</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-color)]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--error-color)] hover:opacity-80 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;