import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Headphones, Mail, Send, Loader2, ShieldCheck, ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";
import { contactData } from "../data/legal/contactData";
import { axiosInstance } from "../lib/axios";
import { notify } from "../store/useNotificationStore";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general_feedback",
    subject: "",
    message: "",
    website: "", // Honeypot spam trap
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  useEffect(() => {
    document.title = "Contact & Support | Syncrona";
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      notify.error("Please enter your full name.", "Validation Error");
      return false;
    }
    if (!formData.email.trim()) {
      notify.error("Please enter your email address.", "Validation Error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      notify.error("Please enter a valid email address.", "Validation Error");
      return false;
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      notify.error("Please enter a subject line (at least 3 characters).", "Validation Error");
      return false;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      notify.error("Please enter your message details (at least 10 characters).", "Validation Error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTicketResult(null);

    try {
      const response = await axiosInstance.post("/support/contact", formData);

      if (response.data?.success) {
        notify.success(response.data.message || "Message sent successfully!", "Support Request Logged");
        setTicketResult(response.data.ticketDetails || { submittedAt: new Date().toISOString() });
        setFormData({
          name: "",
          email: "",
          category: "general_feedback",
          subject: "",
          message: "",
          website: "",
        });
      } else {
        notify.error(response.data?.message || "Failed to submit request.", "Error");
      }
    } catch (error) {
      console.error("Support form submission error:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit your message. Please try again later.";
      notify.error(errorMsg, "Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 neu-bg select-none transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider neu-inset-sm px-3 py-1 rounded-full">
            Help & Support Desk
          </span>
        </div>

        {/* Hero Header */}
        <div className="neu-raised-lg rounded-3xl p-6 sm:p-8 border border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="size-14 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
              <Headphones className="size-7 text-[var(--accent-color)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {contactData.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mt-1">
                {contactData.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Form + Info Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Support Form */}
          <div className="lg:col-span-7 neu-raised-lg rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] space-y-5">
            <div className="border-b border-[var(--border-color)] pb-4">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <MessageSquare className="size-4 text-[var(--accent-color)]" />
                <span>Submit a Support Ticket</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Fill out the fields below. All requests are logged securely for administrator review.
              </p>
            </div>

            {ticketResult && (
              <div className="neu-inset p-4 rounded-2xl border border-[var(--success-color,#10b981)]/30 bg-[var(--success-color,#10b981)]/10 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                  <ShieldCheck className="size-4 text-[var(--success-color,#10b981)]" />
                  <span>Ticket Logged Successfully</span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  Reference Email: <strong className="text-[var(--text-primary)]">{ticketResult.referenceEmail}</strong>
                </p>
                <p className="text-[var(--text-muted)] text-[10px]">
                  Timestamp: {new Date(ticketResult.submittedAt).toLocaleString()}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Honeypot Spam Field (Hidden from human users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                  Full Name <span className="text-[var(--error-color,#ef4444)]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full neu-input rounded-2xl px-4 py-2.5 text-xs placeholder:text-[var(--placeholder-color)]"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                  Email Address <span className="text-[var(--error-color,#ef4444)]">*</span>
                </label>
                <input
                  type="email"
                  className="w-full neu-input rounded-2xl px-4 py-2.5 text-xs placeholder:text-[var(--placeholder-color)]"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                  Inquiry Category <span className="text-[var(--error-color,#ef4444)]">*</span>
                </label>
                <select
                  className="w-full neu-input rounded-2xl px-4 py-2.5 text-xs text-[var(--text-primary)] bg-[var(--bg-color)] cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {contactData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[var(--surface-color)] text-[var(--text-primary)]">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                  Subject Line <span className="text-[var(--error-color,#ef4444)]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full neu-input rounded-2xl px-4 py-2.5 text-xs placeholder:text-[var(--placeholder-color)]"
                  placeholder="Brief summary of your inquiry..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                  Detailed Message <span className="text-[var(--error-color,#ef4444)]">*</span>
                </label>
                <textarea
                  rows="5"
                  className="w-full neu-input rounded-2xl p-4 text-xs placeholder:text-[var(--placeholder-color)] resize-none"
                  placeholder="Describe your issue, privacy request, or technical report in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full neu-btn-accent py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Logging Support Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Support Details & Categories */}
          <div className="lg:col-span-5 space-y-5">

            {/* Direct Support Card */}
            <div className="neu-raised-lg rounded-3xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <Mail className="size-4 text-[var(--accent-color)]" />
                <span>Direct Legal & Support Contact</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Support Email Placeholder</span>
                  <code className="neu-inset-sm px-2.5 py-1 rounded-lg text-[var(--accent-color)] font-mono text-[11px] font-bold block mt-1">
                    {contactData.emailPlaceholder}
                  </code>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Platform Operator</span>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                    {contactData.operatorPlaceholder}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Governing Jurisdiction</span>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                    {contactData.jurisdictionPlaceholder}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time & Guidelines Card */}
            <div className="neu-raised-lg rounded-3xl p-6 border border-[var(--border-color)] space-y-3 text-xs">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <AlertCircle className="size-4 text-[var(--accent-color)]" />
                <span>Support Guidelines</span>
              </h3>
              <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed list-disc pl-4">
                <li>For account access or deletion issues, please specify your registered email address.</li>
                <li>For copyright takedown requests, please refer to our <Link to="/content-removal" className="text-[var(--accent-color)] font-bold hover:underline">Content Removal Policy</Link>.</li>
                <li>Reported security disclosures are logged with IP rate-limiting for server audit safety.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
