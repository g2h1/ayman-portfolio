import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line/60 mt-12">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-bold text-paper">
          {lang === "ar" ? "أيمن منصور" : "Ayman Mansour"}
        </p>
        <p className="text-xs text-paper-muted">{t.footer.tagline}</p>
        <p className="text-xs text-paper-muted">
          © {year} — {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
