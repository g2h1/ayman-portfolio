import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const navItems = [
  { key: "home", path: "/" },
  { key: "work", path: "/work" },
  { key: "partners", path: "/partners" },
  { key: "pricing", path: "/pricing" },
  { key: "contact", path: "/contact" },
];

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-ink-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        <NavLink
          to="/"
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

        <button
          onClick={toggleLang}
          type="button"
          className="rounded-full border border-ink-line px-4 py-1.5 text-sm font-bold text-paper-muted hover:text-paper hover:border-ember transition-colors"
          aria-label="Toggle language"
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>
      </div>

      {/* قائمة الموبايل — فقاعات ظاهرة على طول، من غير زرار قائمة */}
      <nav className="md:hidden border-t border-ink-line/60 bg-ink overflow-x-auto">
        <div className="flex items-center gap-2 px-6 py-3 w-max min-w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-ember text-paper"
                    : "bg-ink-soft text-paper-muted hover:text-paper"
                }`
              }
            >
              {t.nav[item.key]}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
