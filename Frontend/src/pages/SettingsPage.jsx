import { Send, Settings as SettingsIcon, Palette, Check, Sparkles } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { OFFICIAL_THEMES } from "../constants";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How does this theme feel?", isSent: false },
  { id: 2, content: "It looks amazing! The colors and contrast are spot on.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 neu-bg select-none transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
              <span>Active: {OFFICIAL_THEMES.find((t) => t.id === theme)?.name || "Cloud Neumorphism"}</span>
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
                Select any theme below to transform the entire application interface instantly.
              </p>
            </div>

            {/* 10 Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-1">
              {OFFICIAL_THEMES.map((t) => {
                const isActive = theme === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`
                      relative flex flex-col justify-between text-left p-3.5 rounded-2xl transition-all duration-200 cursor-pointer outline-none
                      ${
                        isActive
                          ? "neu-inset ring-2 ring-[var(--accent-color)] scale-[1.02]"
                          : "neu-raised-sm hover:scale-[1.01] hover:shadow-md"
                      }
                    `}
                    style={{
                      backgroundColor: t.surface,
                    }}
                  >
                    {/* Active Selected Checkmark Badge */}
                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 size-6 rounded-full bg-[var(--accent-color)] text-[var(--accent-text)] flex items-center justify-center shadow-md z-10">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="space-y-2.5 w-full">
                      {/* Theme Header & Style */}
                      <div className="pr-6">
                        <div
                          className="font-bold text-sm tracking-tight truncate"
                          style={{ color: t.textPrimary }}
                        >
                          {t.name}
                        </div>
                        <div
                          className="text-[10px] font-semibold truncate opacity-80"
                          style={{ color: t.textSecondary }}
                        >
                          {t.style}
                        </div>
                      </div>

                      {/* Swatch Color Strip */}
                      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border" style={{ borderColor: t.borderColor, backgroundColor: t.bg }}>
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

                      {/* Realistic Miniature UI Preview */}
                      <div
                        className="p-2 rounded-xl space-y-1.5 border"
                        style={{
                          backgroundColor: t.bg,
                          borderColor: t.borderColor,
                        }}
                      >
                        {/* Miniature Incoming Bubble */}
                        <div className="flex justify-start">
                          <div
                            className="max-w-[85%] rounded-lg px-2 py-1 text-[10px] font-medium shadow-xs"
                            style={{
                              backgroundColor: t.incomingMsg,
                              color: t.incomingMsgText,
                              border: `1px solid ${t.borderColor}`,
                            }}
                          >
                            Hello!
                          </div>
                        </div>

                        {/* Miniature Outgoing Bubble */}
                        <div className="flex justify-end">
                          <div
                            className="max-w-[85%] rounded-lg px-2 py-1 text-[10px] font-medium shadow-xs"
                            style={{
                              backgroundColor: t.outgoingMsg,
                              color: t.outgoingMsgText,
                            }}
                          >
                            Looks clean!
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply / Active Action Label */}
                    <div className="pt-3 w-full">
                      <div
                        className={`w-full py-1.5 rounded-xl text-[11px] font-bold text-center transition-all ${
                          isActive
                            ? "bg-[var(--accent-color)] text-[var(--accent-text)] shadow-xs"
                            : "neu-btn text-[var(--text-secondary)]"
                        }`}
                      >
                        {isActive ? "Active" : "Apply Theme"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Interactive Chat Mockup */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1 flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--accent-color)]" />
              Live Theme Interface Preview
            </h2>

            <div className="neu-inset p-4 sm:p-6 rounded-2xl">
              <div className="max-w-lg mx-auto neu-raised rounded-2xl overflow-hidden border border-[var(--border-color)]">
                {/* Mock Header */}
                <div className="p-3.5 neu-bg flex items-center justify-between border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full neu-raised-sm p-0.5 flex items-center justify-center font-bold text-xs text-[var(--accent-color)]">
                      JD
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[var(--text-primary)]">John Doe</h3>
                      <p className="text-[10px] font-semibold text-[var(--success-color)]">Online</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full neu-inset-sm text-[var(--text-secondary)]">
                    {OFFICIAL_THEMES.find((t) => t.id === theme)?.name}
                  </span>
                </div>

                {/* Mock Chat Thread */}
                <div className="p-4 space-y-3 min-h-[160px] neu-bg">
                  {PREVIEW_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 text-xs font-medium ${
                          msg.isSent
                            ? "msg-bubble-outgoing rounded-br-none"
                            : "msg-bubble-incoming rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock Input Bar */}
                <div className="p-3 neu-bg flex gap-2 items-center border-t border-[var(--border-color)]">
                  <input
                    type="text"
                    className="neu-input flex-1 rounded-xl px-3.5 py-2 text-xs"
                    value="Dynamic theme preview input..."
                    readOnly
                  />
                  <button className="neu-btn-accent p-2.5 rounded-xl text-[var(--accent-text)]">
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