import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope, FaFire } from "react-icons/fa";
import { CONFIG } from "../config";

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--color-dark-secondary)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <FaFire className="text-white text-sm" />
              </div>
              <span className="font-[var(--font-display)] font-bold text-white text-sm">
                DAST
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              {CONFIG.APP_DESCRIPTION}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Sayfalar
            </h4>
            <div className="flex flex-col gap-2">
              {[
                ["/", "Anasayfa"],
                ["/aboutUs", "Hakkımızda"],
                ["/products", "Ürünlerimiz"],
                ["/customer", "Panel"],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-slate-500 hover:text-orange-400 text-sm transition-colors no-underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              İletişim
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${CONFIG.CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-slate-500 hover:text-orange-400 text-sm transition-colors no-underline"
              >
                <FaEnvelope className="text-xs" /> E-posta
              </a>
              <a
                href={CONFIG.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-orange-400 text-sm transition-colors no-underline"
              >
                <FaGithub className="text-xs" /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center text-slate-600 text-xs">
          © {new Date().getFullYear()} DAST — Deneyap & TÜBİTAK Projesi
        </div>
      </div>
    </footer>
  );
}

export default Footer;
