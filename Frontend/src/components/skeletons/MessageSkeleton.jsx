const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 neu-bg">
      {skeletonMessages.map((_, idx) => {
        const isStart = idx % 2 === 0;
        return (
          <div key={idx} className={`flex items-end gap-2.5 ${isStart ? "justify-start" : "justify-end"}`}>
            {isStart && <div className="size-8 rounded-full neu-inset animate-pulse flex-shrink-0" />}

            <div className={`space-y-1.5 ${isStart ? "items-start" : "items-end"}`}>
              <div className="h-3 w-12 neu-inset rounded-md animate-pulse" />
              <div className={`h-12 w-[160px] sm:w-[200px] rounded-2xl neu-inset animate-pulse ${isStart ? 'rounded-bl-none' : 'rounded-br-none'}`} />
            </div>

            {!isStart && <div className="size-8 rounded-full neu-inset animate-pulse flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;