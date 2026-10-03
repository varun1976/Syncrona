import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

const TableOfContents = ({ sections }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 90;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <nav className="w-full lg:w-64 flex-shrink-0 select-none">
      {/* Mobile Toggle Header */}
      <div className="lg:hidden neu-raised p-3.5 rounded-2xl mb-4 border border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between text-xs font-bold text-[var(--text-primary)]"
        >
          <div className="flex items-center gap-2">
            <List className="size-4 text-[var(--accent-color)]" />
            <span>Table of Contents ({sections.length} Sections)</span>
          </div>
          {isOpenMobile ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {isOpenMobile && (
          <div className="mt-3 pt-3 border-t border-[var(--border-color)] space-y-1 max-h-60 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeId === section.id
                    ? "bg-[var(--accent-color)] text-[var(--outgoingMsgText,#ffffff)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-color)]"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sticky Table of Contents */}
      <div className="hidden lg:block sticky top-24 neu-raised rounded-3xl p-5 border border-[var(--border-color)] space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <List className="size-4 text-[var(--accent-color)]" />
          <span>Table of Contents</span>
        </div>

        <div className="space-y-1">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all truncate block ${
                  isActive
                    ? "bg-[var(--accent-color)] text-[var(--outgoingMsgText,#ffffff)] shadow-xs translate-x-1"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)]"
                }`}
                title={section.title}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TableOfContents;
