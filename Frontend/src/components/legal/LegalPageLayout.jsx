import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, Scale, Cookie, AlertOctagon, Headphones, ArrowLeft } from "lucide-react";
import LegalNoticeBanner from "./LegalNoticeBanner";
import TableOfContents from "./TableOfContents";

// Simple helper to format basic Markdown headers, quotes, tables, lists and code blocks into styled HTML
const renderMarkdownContent = (content) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let keyCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<div key={`space-${keyCounter++}`} className="h-2" />);
      continue;
    }

    // Callout alert quotes
    if (line.startsWith("> [!IMPORTANT]") || line.startsWith("> [!WARNING]") || line.startsWith("> [!NOTE]") || line.startsWith("> [!CAUTION]") || line.startsWith("> [!TIP]")) {
      const calloutText = line.replace(/^>\s*\[!(IMPORTANT|WARNING|NOTE|CAUTION|TIP)\]\s*/, "");
      elements.push(
        <div key={`callout-${keyCounter++}`} className="my-3 neu-inset p-4 rounded-2xl border-l-4 border-[var(--accent-color)] text-xs font-semibold leading-relaxed text-[var(--text-primary)]">
          {calloutText}
        </div>
      );
      continue;
    }

    // Standard blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`quote-${keyCounter++}`} className="my-3 neu-inset p-3.5 rounded-2xl text-xs font-medium italic text-[var(--text-secondary)] border-l-2 border-[var(--accent-color)]">
          {line.replace(/^>\s*/, "")}
        </blockquote>
      );
      continue;
    }

    // Subheadings ###
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${keyCounter++}`} className="text-sm font-bold tracking-tight text-[var(--text-primary)] mt-5 mb-2">
          {line.replace(/^###\s*/, "")}
        </h3>
      );
      continue;
    }

    // Bullet points * or -
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      const listText = line.trim().replace(/^[*|-]\s*/, "");
      elements.push(
        <li key={`li-${keyCounter++}`} className="text-xs text-[var(--text-secondary)] leading-relaxed ml-4 list-disc mb-1">
          {formatInlineMarkdown(listText)}
        </li>
      );
      continue;
    }

    // Table rows | ... |
    if (line.trim().startsWith("|")) {
      elements.push(
        <div key={`table-row-${keyCounter++}`} className="font-mono text-[11px] text-[var(--text-secondary)] p-2 neu-inset-sm rounded-xl overflow-x-auto my-1">
          {line}
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${keyCounter++}`} className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed mb-2">
        {formatInlineMarkdown(line)}
      </p>
    );
  }

  return elements;
};

// Formats inline markdown bold (**bold**), code (`code`), and links
const formatInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="font-mono text-[11px] px-1.5 py-0.5 neu-inset-sm rounded-md text-[var(--accent-color)]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const LegalPageLayout = ({ icon: Icon, data }) => {
  useEffect(() => {
    document.title = `${data.title} | Syncrona`;
    window.scrollTo(0, 0);
  }, [data.title]);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 neu-bg select-none transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/settings"
            className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Settings</span>
          </Link>
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider neu-inset-sm px-3 py-1 rounded-full">
            Version {data.version} ({data.effectiveDate})
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="neu-raised-lg rounded-3xl p-6 sm:p-8 border border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="size-14 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
              <Icon className="size-7 text-[var(--accent-color)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {data.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mt-1">
                {data.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Legal Review Banner */}
        {data.requiresLegalReview && <LegalNoticeBanner />}

        {/* Main Content Layout (Table of Contents + Document Content) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sticky Table of Contents Sidebar */}
          <TableOfContents sections={data.sections} />

          {/* Document Section Bodies */}
          <div className="flex-1 w-full space-y-6">
            {data.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="neu-raised-lg rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] scroll-mt-24 space-y-3"
              >
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
                  {section.title}
                </h2>
                <div>{renderMarkdownContent(section.content)}</div>
              </section>
            ))}
          </div>

        </div>

        {/* Bottom Legal Navigation Bar */}
        <div className="neu-raised rounded-3xl p-6 border border-[var(--border-color)] space-y-4 pt-6 mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] text-center">
            Syncrona Legal & Compliance Documentation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <Link
              to="/privacy-policy"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Shield className="size-4 text-[var(--accent-color)]" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              to="/terms"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Scale className="size-4 text-[var(--accent-color)]" />
              <span>Terms of Service</span>
            </Link>
            <Link
              to="/cookie-policy"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Cookie className="size-4 text-[var(--accent-color)]" />
              <span>Cookie Policy</span>
            </Link>
            <Link
              to="/acceptable-use"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <AlertOctagon className="size-4 text-[var(--accent-color)]" />
              <span>Acceptable Use</span>
            </Link>
            <Link
              to="/content-removal"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <FileText className="size-4 text-[var(--accent-color)]" />
              <span>Content Removal</span>
            </Link>
            <Link
              to="/contact"
              className="neu-btn p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-[11px] font-bold text-center text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              <Headphones className="size-4 text-[var(--accent-color)]" />
              <span>Support & Contact</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegalPageLayout;
