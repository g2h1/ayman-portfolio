import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const clientNav = [
  { key: "home", path: "/" },
  { key: "work", path: "/work" },
  { key: "pricing", path: "/pricing" },
  { key: "contact", path: "/contact" },
];

const companyNav = [
  { key: "home", path: "/" },
  { key: "partners", path: "/partners" },
  { key: "contact", path: "/contact" },
];

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const { user, profile, effectiveType, setVisitorType, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = effectiveType === "company" ? companyNav : clientNav;

  const handleSwitchType = () => {
    if (user) return; // لو مسجل دخول، نوعه بيبقى تابع لحسابه مش قابل للتبديل السريع
    setVisitorType(effectiveType === "company" ? "client" : "company");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-ink-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-lg font-extrabold tracking-tight text-paper hover:text-ember-glow transition-colors"
        >
          {lang === "ar" ? "أيمن منصور · Agency" : "Ayman Mansour Agency"}
        </NavLink>

        {/* قائمة سطح المكتب */}
        <nav className="hidden md:flex items-center gap-6">
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

          <button
            onClick={handleSwitchType}
            type="button"
            className="text-xs font-bold text-paper-muted hover:text-paper border border-ink-line rounded-full px-3 py-1 transition-colors"
            title={t.visitorGate.changeLater}
          >
            {effectiveType === "company" ? t.visitorGate.client : t.visitorGate.company}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              type="button"
              className="rounded-full border border-ink-line px-4 py-1.5 text-sm font-bold text-paper-muted hover:text-paper hover:border-ember transition-colors"
            >
              {t.auth.logout}
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-ember px-4 py-1.5 text-sm font-bold text-paper hover:bg-ember-glow transition-colors"
            >
              {t.auth.login}
            </NavLink>
          )}

          <button
            onClick={toggleLang}
            type="button"
            className="rounded-full border border-ink-line px-4 py-1.5 text-sm font-bold text-paper-muted hover:text-paper hover:border-ember transition-colors"
            aria-label="Toggle language"
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل — فقاعات ظاهرة على طول */}
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
          <button
            onClick={handleSwitchType}
            type="button"
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold border border-ink-line text-paper-muted"
          >
            {effectiveType === "company" ? t.visitorGate.client : t.visitorGate.company}
          </button>
        </div>
      </nav>
    </header>
  );
}
