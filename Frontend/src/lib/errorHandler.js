/**
 * Centralized API Error Handling Utility for Syncrona
 * Maps HTTP status codes and API errors to user-friendly, safe messages.
 * Prevents raw stack traces, database details, or sensitive server info from leaking.
 */

export const parseApiError = (error, defaultMessage = "We couldn't process your request. Please try again.") => {
  // If no response (network disconnect, timeout, browser offline)
  if (!error.response) {
    if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      return "Unable to reach the server. Check your connection and try again.";
    }
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "The request took too long to complete. Please try again.";
    }
    return defaultMessage;
  }

  const { status, data } = error.response;
  const backendMessage = data?.message || data?.error;

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
      lower.includes("db error") ||
      lower.includes("internal server error")
    ) {
      return false;
    }
    return true;
  };

  // Map HTTP status codes and response codes to clear, safe user messages
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
      return isSafeMessage(backendMessage) ? backendMessage : "An account or resource with this information already exists.";
    case 413:
      return "This image is too large. Please choose an image smaller than 5MB.";
    case 415:
      return "This image format is not supported. Please choose a supported image file.";
    case 429:
      return "Too many requests. Please wait a moment before trying again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return isSafeMessage(backendMessage) ? backendMessage : "We encountered a server issue. Please try again later.";
    default:
      return isSafeMessage(backendMessage) ? backendMessage : defaultMessage;
  }
};
