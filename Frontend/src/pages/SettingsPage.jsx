import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Settings as SettingsIcon, Palette, Check, Sparkles, Eye, ArrowLeft } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { OFFICIAL_THEMES } from "../constants";
import { notify } from "../store/useNotificationStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How does this theme feel?", isSent: false },
  { id: 2, content: "It looks amazing! The colors and contrast are spot on.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [previewTheme, setPreviewTheme] = useState(theme);

  const activeThemeObj = OFFICIAL_THEMES.find((t) => t.id === theme) || OFFICIAL_THEMES[0];
  const previewThemeObj = OFFICIAL_THEMES.find((t) => t.id === previewTheme) || activeThemeObj;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 neu-bg select-none transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider neu-inset-sm px-3 py-1 rounded-full">
            Settings & Themes
          </span>
        </div>

        {/* Main Settings Card */}
        <div className="neu-raised-lg rounded-3xl p-6 sm:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
                <SettingsIcon className="size-6 text-[var(--accent-color)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Appearance & Settings
                </h1>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  Customize your Syncrona experience with 10 handcrafted theme palettes
                </p>
              </div>
            </div>

            {/* Active Theme Summary Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl neu-inset-sm text-xs font-bold text-[var(--text-primary)] w-fit">
              <Sparkles className="size-4 text-[var(--accent-color)] animate-pulse" />
              <span>Active: {activeThemeObj.name}</span>
            </div>
          </div>

          {/* Theme Selection (10 Themes Grid) */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1 flex items-center gap-2">
                <Palette className="size-4 text-[var(--accent-color)]" />
                Theme Selection (10 Distinct Palettes)
              </h2>
              <p className="text-xs font-medium text-[var(--text-muted)] pl-1 mt-0.5">
                Click any theme card to preview its colors below, or click &quot;Apply Theme&quot; to set it across Syncrona.
              </p>
            </div>

            {/* 10 Simplified Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-1">
              {OFFICIAL_THEMES.map((t) => {
                const isActive = theme === t.id;
                const isPreviewed = previewTheme === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setPreviewTheme(t.id)}
                    className={`
                      relative flex flex-col justify-between p-4 rounded-2xl transition-all duration-200 cursor-pointer outline-none select-none h-full
                      ${
                        isPreviewed
                          ? "neu-inset ring-2 ring-[var(--accent-color)] scale-[1.02]"
                          : "neu-raised-sm hover:scale-[1.01] hover:shadow-md"
                      }
                    `}
                    style={{
                      backgroundColor: t.surface,
                    }}
                  >
                    <div>
                      {/* Theme Name & Status Badge */}
                      <div className="flex items-start justify-between gap-1.5 mb-2.5">
                        <div
                          className="font-bold text-sm tracking-tight truncate flex-1"
                          style={{ color: t.textPrimary }}
                          title={t.name}
                        >
                          {t.name}
                        </div>
                        {isActive && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs flex-shrink-0"
                            style={{ backgroundColor: t.accent, color: t.outgoingMsgText }}
                          >
                            <Check className="size-3 stroke-[3]" />
                            <span>Active</span>
                          </span>
                        )}
                        {!isActive && isPreviewed && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1 opacity-90 flex-shrink-0"
                            style={{ backgroundColor: t.bg, color: t.textSecondary, border: `1px solid ${t.borderColor}` }}
                          >
                            <Eye className="size-3" />
                            <span>Viewing</span>
                          </span>
                        )}
                      </div>

                      {/* Swatch Color Strip */}
                      <div
                        className="flex items-center justify-between gap-1 p-2 rounded-xl border mb-4"
                        style={{ borderColor: t.borderColor, backgroundColor: t.bg }}
                      >
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.bg, borderColor: t.borderColor }}
                          title="Background"
                        />
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.surface, borderColor: t.borderColor }}
                          title="Surface"
                        />
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.accent, borderColor: t.borderColor }}
                          title="Accent"
                        />
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.textPrimary, borderColor: t.borderColor }}
                          title="Primary Text"
                        />
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.incomingMsg, borderColor: t.borderColor }}
                          title="Incoming Bubble"
                        />
                        <div
                          className="size-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: t.outgoingMsg, borderColor: t.borderColor }}
                          title="Outgoing Bubble"
                        />
                      </div>
                    </div>

                    {/* Apply Theme Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(t.id);
                        setPreviewTheme(t.id);
                        notify.success(`${t.name} theme applied!`, "Theme Updated");
                      }}
                      className="w-full py-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer outline-none hover:opacity-90 active:scale-[0.98]"
                      style={{
                        backgroundColor: isActive ? t.accent : t.bg,
                        color: isActive ? t.outgoingMsgText : t.textPrimary,
                        border: `1px solid ${isActive ? t.accent : t.borderColor}`,
                        boxShadow: t.isDark ? "0 2px 6px rgba(0,0,0,0.35)" : "0 2px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      {isActive ? "Active Theme" : "Apply Theme"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Theme Interface Preview Section */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1 flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--accent-color)]" />
                Live Theme Interface Preview
              </h2>
              <span className="text-xs font-bold text-[var(--text-secondary)] neu-inset-sm px-3 py-1 rounded-full">
                Previewing: {previewThemeObj.name}
              </span>
            </div>

            <div className="neu-inset p-4 sm:p-6 rounded-2xl">
              <div
                className="max-w-lg mx-auto rounded-2xl overflow-hidden border shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: previewThemeObj.bg,
                  borderColor: previewThemeObj.borderColor,
                }}
              >
                {/* Mock Header */}
                <div
                  className="p-3.5 flex items-center justify-between border-b transition-all duration-300"
                  style={{
                    backgroundColor: previewThemeObj.surface,
                    borderColor: previewThemeObj.borderColor,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="size-9 rounded-full p-0.5 flex items-center justify-center font-bold text-xs shadow-xs"
                      style={{
                        backgroundColor: previewThemeObj.accent,
                        color: previewThemeObj.outgoingMsgText,
                      }}
                    >
                      JD
                    </div>
                    <div>
                      <h3
                        className="font-bold text-xs"
                        style={{ color: previewThemeObj.textPrimary }}
                      >
                        John Doe
                      </h3>
                      <p className="text-[10px] font-semibold text-[var(--success-color,#10b981)]">
                        Online
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs"
                    style={{
                      backgroundColor: previewThemeObj.bg,
                      color: previewThemeObj.textSecondary,
                      borderColor: previewThemeObj.borderColor,
                    }}
                  >
                    {previewThemeObj.name}
                  </span>
                </div>

                {/* Mock Chat Thread */}
                <div
                  className="p-4 space-y-3 min-h-[160px] transition-all duration-300"
                  style={{ backgroundColor: previewThemeObj.bg }}
                >
                  {PREVIEW_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 text-xs font-medium shadow-xs ${
                          msg.isSent ? "rounded-br-none" : "rounded-bl-none"
                        }`}
                        style={{
                          backgroundColor: msg.isSent
                            ? previewThemeObj.outgoingMsg
                            : previewThemeObj.incomingMsg,
                          color: msg.isSent
                            ? previewThemeObj.outgoingMsgText
                            : previewThemeObj.incomingMsgText,
                          border: msg.isSent ? "none" : `1px solid ${previewThemeObj.borderColor}`,
                        }}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock Input Bar */}
                <div
                  className="p-3 flex gap-2 items-center border-t transition-all duration-300"
                  style={{
                    backgroundColor: previewThemeObj.surface,
                    borderColor: previewThemeObj.borderColor,
                  }}
                >
                  <input
                    type="text"
                    className="flex-1 rounded-xl px-3.5 py-2 text-xs border outline-none"
                    style={{
                      backgroundColor: previewThemeObj.bg,
                      color: previewThemeObj.textPrimary,
                      borderColor: previewThemeObj.borderColor,
                    }}
                    value="Dynamic theme preview input..."
                    readOnly
                  />
                  <button
                    className="p-2.5 rounded-xl flex items-center justify-center shadow-xs transition-all"
                    style={{
                      backgroundColor: previewThemeObj.accent,
                      color: previewThemeObj.outgoingMsgText,
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;