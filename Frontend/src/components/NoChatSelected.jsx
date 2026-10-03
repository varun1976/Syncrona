import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 select-none neu-bg">
      <div className="max-w-md text-center space-y-5">
        {/* Soft Raised Icon Container */}
        <div className="flex justify-center mb-4">
          <div className="size-16 rounded-2xl neu-raised flex items-center justify-center text-[var(--accent-color)]">
            <MessageSquare className="size-8 text-[var(--accent-color)]" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome to Syncrona
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
            Select a contact from the sidebar to begin chatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;