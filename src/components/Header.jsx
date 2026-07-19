import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const navItems = [
  { key: "home", path: "/" },
  { key: "work", path: "/work" },
  { key: "pricing", path: "/pricing" },
  { key: "contact", path: "/contact" },
];

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-ink-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="text-lg font-extrabold tracking-tight text-paper hover:text-ember-glow transition-colors"
        >
          {lang === "ar" ? "أيمن منصور" : "Ayman Mansour"}
        </NavLink>

        {/* قائمة سطح المكتب */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-ember-glow"
                    : "text-paper-muted hover:text-paper"
                }`
              }
            >
              {t.nav[item.key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            type="button"
            className="rounded-full border border-ink-line px-4 py-1.5 text-sm font-bold text-paper-muted hover:text-paper hover:border-ember transition-colors"
            aria-label="Toggle language"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* زرار القائمة — يظهر في الموبايل بس */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-ink-line text-paper"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {menuOpen && (
        <nav className="md:hidden border-t border-ink-line/60 bg-ink">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `py-3 text-sm font-semibold border-b border-ink-line/40 last:border-b-0 transition-colors ${
                    isActive ? "text-ember-glow" : "text-paper-muted"
                  }`
                }
              >
                {t.nav[item.key]}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
