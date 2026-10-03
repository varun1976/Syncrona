import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(7).fill(null);

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col neu-bg border-r border-[var(--border-color)]">
      <div className="pt-2.5 pb-3 px-3.5 sm:px-4 space-y-2.5 border-b border-[var(--border-color)] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl neu-inset animate-pulse" />
            <div className="hidden lg:block h-4 w-24 neu-inset rounded-md animate-pulse" />
          </div>
          <div className="hidden lg:block h-5 w-16 neu-inset rounded-full animate-pulse" />
        </div>
        <div className="hidden lg:block h-11 w-full neu-inset rounded-2xl animate-pulse" />
      </div>

      <div className="overflow-y-auto w-full py-2 px-2 space-y-2 flex-1 min-h-0">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-2.5 flex items-center gap-3 rounded-xl animate-pulse">
            <div className="size-10 rounded-full neu-inset flex-shrink-0 mx-auto lg:mx-0" />
            <div className="hidden lg:block text-left min-w-0 flex-1 space-y-1.5">
              <div className="h-4 w-24 neu-inset rounded-md" />
              <div className="h-2.5 w-14 neu-inset rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;