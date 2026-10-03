import React, { useEffect, useRef, useState } from "react";
import { Check, X as XIcon, AlertTriangle, Info, X } from "lucide-react";
import { useNotificationStore } from "../../store/useNotificationStore";

const TYPE_CONFIG = {
  success: {
    icon: Check,
    iconBgClass: "bg-[#00c853] text-white",
    barColor: "#00e676",
  },
  error: {
    icon: XIcon,
    iconBgClass: "bg-[#ef4444] text-white",
    barColor: "#ef4444",
  },
  warning: {
    icon: AlertTriangle,
    iconBgClass: "bg-[#f59e0b] text-white",
    barColor: "#f59e0b",
  },
  info: {
    icon: Info,
    iconBgClass: "bg-[#3b82f6] text-white",
    barColor: "#3b82f6",
  },
};

const NotificationItem = ({ notification }) => {
  const { id, type = "info", title, message, duration = 3000, isExiting } = notification;
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);

  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(duration);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const IconComponent = config.icon;

  // Handle auto-dismissal timer with hover/focus pause & resume
  useEffect(() => {
    if (isPaused || isExiting) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      dismissNotification(id);
    }, remainingTimeRef.current);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - (startTimeRef.current || Date.now());
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    };
  }, [id, isPaused, isExiting, dismissNotification]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleManualDismiss = (e) => {
    e.stopPropagation();
    dismissNotification(id);
  };

  const primaryText = message || title;
  const secondaryText = message && title && message !== title ? message : null;
  const headerText = secondaryText ? title : primaryText;

  return (
    <div
      role="status"
      aria-live={type === "error" ? "assertive" : "polite"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      className={`
        pointer-events-auto w-full max-w-xs sm:max-w-sm
        rounded-xl px-4 py-3.5
        bg-[#121316] text-white
        border border-white/10
        shadow-2xl shadow-black/70
        flex items-center gap-3 relative overflow-hidden select-none outline-none
        ${isExiting ? "animate-notification-exit" : "animate-notification-enter"}
      `}
      style={{
        animationPlayState: isPaused ? "paused" : "running",
      }}
    >
      {/* Status Circular Icon Badge */}
      <div
        className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${config.iconBgClass}`}
      >
        <IconComponent className="size-3.5 stroke-[3]" />
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0 pr-5">
        <h4 className="text-sm font-semibold tracking-tight text-white leading-snug break-words">
          {headerText}
        </h4>
        {secondaryText && (
          <p className="text-xs font-medium text-zinc-400 leading-relaxed mt-0.5 break-words">
            {secondaryText}
          </p>
        )}
      </div>

      {/* Top Right Close Button */}
      <button
        type="button"
        onClick={handleManualDismiss}
        aria-label="Close notification"
        className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg"
      >
        <X className="size-4" />
      </button>

      {/* Countdown Progress Bar Along Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20 rounded-b-xl overflow-hidden pointer-events-none z-20">
        <div
          className="h-full w-full"
          style={{
            backgroundColor: config.barColor,
            transformOrigin: "left center",
            animationName: "notification-countdown",
            animationDuration: `${duration}ms`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
};

export default NotificationItem;
