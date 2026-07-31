/**
 * Socket.IO Rate Limiting Middleware
 * Intercepts incoming socket events, enforces rate limits, logs violations,
 * emits error events to the client, and disconnects abusive clients.
 */

const windowMs = parseInt(process.env.SOCKET_RATE_LIMIT_WINDOW_MS || "10000", 10); // 10 seconds
const maxEventsPerWindow = parseInt(process.env.SOCKET_RATE_LIMIT_MAX || "30", 10); // max 30 events
const maxViolationsBeforeDisconnect = parseInt(process.env.SOCKET_MAX_VIOLATIONS || "10", 10); // disconnect after 10 repeated violations

export const applySocketRateLimiting = (socket) => {
  // Store rate limit state per socket instance
  socket.rateLimitState = {
    timestamps: [],
    violationsCount: 0,
  };

  // Intercept all incoming events on this socket
  socket.use((packet, next) => {
    const eventName = packet[0];
    const now = Date.now();
    const state = socket.rateLimitState;

    // Filter out timestamps older than the sliding window
    state.timestamps = state.timestamps.filter((ts) => now - ts < windowMs);

    if (state.timestamps.length >= maxEventsPerWindow) {
      state.violationsCount += 1;
      const userId = socket.handshake.query?.userId || "Unauthenticated";
      const ip = socket.handshake.address || "Unknown IP";

      console.warn(
        `[SOCKET RATE LIMIT VIOLATION] ${new Date().toISOString()} | Event: ${eventName} | IP: ${ip} | UserID: ${userId} | SocketID: ${socket.id} | Violations: ${state.violationsCount}`
      );

      // Emit error event to client
      socket.emit("rate_limit_exceeded", {
        success: false,
        event: eventName,
        message: `Too many '${eventName}' requests. Please slow down.`,
      });

      // Disconnect socket if repeated abuse threshold is reached
      if (state.violationsCount >= maxViolationsBeforeDisconnect) {
        console.error(
          `[SOCKET FLOODING DISCONNECT] ${new Date().toISOString()} | Disconnecting abusive socket ${socket.id} (User: ${userId}) due to repeated rate limit violations.`
        );
        socket.emit("error", {
          success: false,
          message: "Disconnected due to excessive event flooding.",
        });
        socket.disconnect(true);
      }

      // Reject processing this event packet
      return next(new Error("Rate limit exceeded for event: " + eventName));
    }

    // Event is allowed
    state.timestamps.push(now);
    next();
  });
};
