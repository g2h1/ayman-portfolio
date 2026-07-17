import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 py-32 text-center">
      <h1 className="text-4xl font-black text-paper">{t.nav.contact}</h1>
      <p className="mt-4 text-paper-muted">{t.placeholder.comingSoon}</p>
    </section>
  );
}
