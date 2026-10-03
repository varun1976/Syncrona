import { AlertTriangle } from "lucide-react";

const LegalNoticeBanner = () => {
  return (
    <div className="neu-inset p-4 rounded-2xl border border-[var(--warning-color)]/30 bg-[var(--warning-color)]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mb-6 select-none">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl neu-raised text-[var(--warning-color)] flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="size-4 text-[var(--warning-color)]" />
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)]">
            Draft Policy Notice for Project Owner Review
          </p>
          <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            This policy document is tailored specifically to Syncrona&apos;s technical architecture. Before public deployment, all bracketed placeholders (such as legal entity names, contact emails, and jurisdiction details) must be updated and formally reviewed by a qualified legal professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeBanner;
