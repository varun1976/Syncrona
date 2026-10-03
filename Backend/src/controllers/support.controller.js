import Ticket from "../models/ticket.model.js";

/**
 * Handle public contact & support form submissions
 * POST /api/support/contact
 */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, category, subject, message, website } = req.body;

    if (
      (name !== undefined && typeof name !== "string") ||
      (email !== undefined && typeof email !== "string") ||
      (category !== undefined && typeof category !== "string") ||
      (subject !== undefined && typeof subject !== "string") ||
      (message !== undefined && typeof message !== "string") ||
      (website !== undefined && typeof website !== "string")
    ) {
      return res.status(400).json({ success: false, message: "Invalid payload format." });
    }

    // Honeypot spam check: if website field is filled, return synthetic success without processing
    if (website && website.trim().length > 0) {
      console.warn(`[SPAM BLOCKED] Honeypot field filled by IP: ${req.ip}`);
      return res.status(200).json({
        success: true,
        message: "Thank you for your message. Our support team will review your submission.",
      });
    }

    // Input Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your name." });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your email address." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address format." });
    }

    const validCategories = [
      "account_access",
      "technical_issue",
      "privacy_request",
      "security_report",
      "content_removal",
      "general_feedback",
    ];

    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: "Please select a valid contact category." });
    }

    if (!subject || !subject.trim() || subject.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Subject line must be at least 3 characters long." });
    }

    if (!message || !message.trim() || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Message must be at least 10 characters long." });
    }

    if (message.length > 3000) {
      return res.status(400).json({ success: false, message: "Message exceeds maximum allowed length (3,000 characters)." });
    }

    // Save ticket document directly to MongoDB database
    const newTicket = await Ticket.create({
      name: name.trim(),
      email: email.trim(),
      category,
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    });

    // Safe Success Response
    return res.status(200).json({
      success: true,
      code: "SUPPORT_TICKET_CREATED",
      message: "Thank you for contacting Syncrona support. Your message has been saved to our database, and our team will review your inquiry shortly.",
      ticketDetails: {
        ticketId: newTicket._id,
        submittedAt: newTicket.createdAt,
        category: newTicket.category,
        referenceEmail: newTicket.email,
      },
    });
  } catch (error) {
    console.error("Error in submitContactForm controller:", error.message);
    return res.status(500).json({
      success: false,
      code: "SUPPORT_ERROR",
      message: "We encountered an issue submitting your request. Please try again or email support directly.",
    });
  }
};

/**
 * Fetch all support tickets (Admin / Operator view)
 * GET /api/support/tickets
 */
export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error in getSupportTickets:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
};
