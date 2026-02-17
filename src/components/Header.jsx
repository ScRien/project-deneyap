import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NAV_ITEMS = [
  { path: "/", label: "Anasayfa" },
  { path: "/aboutUs", label: "Hakkımızda" },
  { path: "/products", label: "Ürünlerimiz" },
  { path: "/customer", label: "Panel" },
  { path: "/support", label: "Destek" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLoggedIn = localStorage.getItem("userEmail");

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group no-underline">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
            <FaFire className="text-white text-base" />
          </div>
          <span className="font-[var(--font-display)] text-[15px] font-bold tracking-tight text-white">
            DAST
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const href =
              item.path === "/customer" && isLoggedIn
                ? "/dashboard"
                : item.path;
            return (
              <Link
                key={item.path}
                to={href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${isActive
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.path === "/customer" && isLoggedIn
                  ? "Dashboard"
                  : item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-300 hover:text-white text-2xl p-1"
          aria-label="Menü"
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="md:hidden border-t border-white/5 px-6 pb-4 pt-2 space-y-1 animate-[fadeIn_0.2s_ease]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const href =
              item.path === "/customer" && isLoggedIn
                ? "/dashboard"
                : item.path;
            return (
              <Link
                key={item.path}
                to={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all no-underline ${isActive
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.path === "/customer" && isLoggedIn
                  ? "Dashboard"
                  : item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export default Header;
