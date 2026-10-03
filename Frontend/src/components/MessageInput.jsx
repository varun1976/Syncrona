import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import { notify } from "../store/useNotificationStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Auto-expand textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. File size validation (Max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      notify.error("This image is too large. Please choose an image smaller than 5MB.", "File Too Large");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. MIME type validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type.toLowerCase()) && !file.type.startsWith("image/")) {
      notify.error("This image format is not supported. Please choose a JPEG, PNG, GIF, or WebP file.", "Unsupported Format");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. File reading with error handler
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      notify.error("This image could not be opened. Please try another image.", "Invalid File");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 sm:p-4 w-full border-t border-[var(--border-color)] neu-bg z-10 flex-shrink-0">
      {/* Image Preview Box */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative neu-raised-sm p-1 rounded-2xl">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl neu-inset"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-5 rounded-full bg-[var(--error-color)] text-white
              flex items-center justify-center shadow hover:opacity-90 transition-opacity"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form with Multiline Textarea */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-2.5">
        <div className="flex-1 flex items-end gap-2 neu-inset rounded-2xl px-3 py-1.5 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            className="w-full bg-transparent border-none outline-none text-[var(--text-primary)] text-sm sm:text-base placeholder:text-[var(--placeholder-color)] py-1.5 px-1 resize-none max-h-32 overflow-y-auto leading-relaxed"
            placeholder="Type a message ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`p-2 rounded-xl transition-all flex-shrink-0 mb-0.5 ${imagePreview ? "text-[var(--accent-color)] font-bold neu-inset-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image size={18} />
          </button>
        </div>

        <button
          type="submit"
          className="neu-btn-accent p-3 rounded-2xl flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
          disabled={!text.trim() && !imagePreview}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;