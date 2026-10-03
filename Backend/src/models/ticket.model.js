import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "account_access",
        "technical_issue",
        "privacy_request",
        "security_report",
        "content_removal",
        "general_feedback",
      ],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "Unknown",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ email: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
