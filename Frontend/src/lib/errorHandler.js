/**
 * Centralized API Error Handling Utility for Syncrona
 * Maps HTTP status codes and API errors to user-friendly, safe messages.
 * Prevents raw stack traces, database details, or sensitive server info from leaking.
 */

export const parseApiError = (error, defaultMessage = "An unexpected error occurred. Please try again.") => {
  // If offline or network request failed without response
  if (!error.response) {
    if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "The request timed out. Please check your connection and try again.";
    }
    return defaultMessage;
  }

  const { status, data } = error.response;
  const backendMessage = data?.message;

  // Function to verify if backendMessage is user-safe (no stack traces, database info, etc.)
  const isSafeMessage = (msg) => {
    if (typeof msg !== "string" || !msg.trim()) return false;
    const lower = msg.toLowerCase();
    if (
      lower.includes("mongo") ||
      lower.includes("syntaxerror") ||
      lower.includes("cast to objectid") ||
      lower.includes("jwt malformed") ||
      lower.includes("at ") ||
      lower.includes("node_modules") ||
      lower.includes("sql") ||
      lower.includes("db error")
    ) {
      return false;
    }
    return true;
  };

  // Map known status codes to clear, contextual messages
  switch (status) {
    case 400:
      return isSafeMessage(backendMessage) ? backendMessage : "Invalid request parameters. Please check your input.";
    case 401:
      return isSafeMessage(backendMessage) ? backendMessage : "Your session has expired. Please log in again.";
    case 403:
      return isSafeMessage(backendMessage) ? backendMessage : "You do not have permission to perform this operation.";
    case 404:
      return isSafeMessage(backendMessage) ? backendMessage : "The requested resource could not be found.";
    case 409:
      return isSafeMessage(backendMessage) ? backendMessage : "A conflict occurred with existing data.";
    case 429:
      return "Too many requests. Please slow down and try again in a moment.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "We encountered a temporary server issue. Please try again later.";
    default:
      return isSafeMessage(backendMessage) ? backendMessage : defaultMessage;
  }
};
