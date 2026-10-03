import { Link } from "react-router-dom";
import { MessageSquare, Shield, Scale, Cookie, AlertOctagon, FileText, Headphones, Settings } from "lucide-react";

const Footer = () => {
  return (
    <footer className="neu-raised border-t border-[var(--border-color)] pt-10 pb-8 px-4 sm:px-6 transition-all select-none mt-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section: Brand + Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="size-9 rounded-xl neu-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4 text-[var(--accent-color)]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                Syncrona
              </span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Real-time messaging platform providing instant multi-theme messaging, media sharing, and transparent data privacy controls.
            </p>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Legal & Compliance
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/privacy-policy" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <Shield className="size-3.5 text-[var(--accent-color)]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <Scale className="size-3.5 text-[var(--accent-color)]" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <Cookie className="size-3.5 text-[var(--accent-color)]" />
                  <span>Cookie Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/acceptable-use" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <AlertOctagon className="size-3.5 text-[var(--accent-color)]" />
                  <span>Acceptable Use Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/content-removal" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <FileText className="size-3.5 text-[var(--accent-color)]" />
                  <span>Content Removal & DMCA</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Support & App
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <Headphones className="size-3.5 text-[var(--accent-color)]" />
                  <span>Contact Support Desk</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-2">
                  <Settings className="size-3.5 text-[var(--accent-color)]" />
                  <span>Appearance & Settings</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Draft Status */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-[var(--text-muted)]">
          <p>© 2026 Syncrona. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
            <span>Project Policy Draft — Subject to Legal Review</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
