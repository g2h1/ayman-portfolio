import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { contactInfo } from "../data/content";

export default function Contact() {
  const { lang, t } = useLanguage();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}`;
  const emailUrl = `mailto:${contactInfo.email}`;

  const canSend = name.trim().length > 0 && message.trim().length > 0;

  const buildWhatsappMessage = () => {
    const greeting =
      lang === "ar"
        ? `السلام عليكم، اسمي ${name.trim()}.\n\n${message.trim()}`
        : `Hi, my name is ${name.trim()}.\n\n${message.trim()}`;
    return `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
      greeting
    )}`;
  };

  const buildEmailMessage = () => {
    const subject =
      lang === "ar" ? `رسالة من ${name.trim()}` : `Message from ${name.trim()}`;
    return `mailto:${contactInfo.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message.trim())}`;
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-paper">
          {t.contact.title}
        </h1>
        <p className="mt-4 text-paper-muted">{t.contact.subtitle}</p>
      </div>

      {/* أزرار التواصل المباشر */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-ink hover:brightness-110 transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39a9.9 9.9 0 0 0 4.7 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.35c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.23 8.22Zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
          </svg>
          {t.contact.whatsappLabel}
        </a>

        <a
          href={emailUrl}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full border border-ink-line px-8 py-4 text-base font-bold text-paper hover:border-ember transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 6 10-6" />
          </svg>
          {t.contact.emailLabel}
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-paper-muted" dir="ltr">
        {contactInfo.email} &nbsp;•&nbsp; +{contactInfo.whatsapp}
      </p>

      {/* فاصل */}
      <div className="mt-14 flex items-center gap-4">
        <span className="h-px flex-1 bg-ink-line" />
        <span className="text-xs font-bold text-paper-muted uppercase tracking-wide">
          {t.contact.orLabel}
        </span>
        <span className="h-px flex-1 bg-ink-line" />
      </div>

      {/* نموذج رسالة سريعة */}
      <div className="mt-10 rounded-2xl border border-ink-line bg-ink-soft p-6 md:p-8">
        <h2 className="text-lg font-extrabold text-paper">
          {t.contact.formTitle}
        </h2>
        <p className="mt-1 text-sm text-paper-muted">
          {t.contact.formSubtitle}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-paper-muted mb-1.5">
              {t.contact.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.contact.namePlaceholder}
              className="w-full rounded-xl border border-ink-line bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-paper-muted mb-1.5">
              {t.contact.messageLabel}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.contact.messagePlaceholder}
              className="w-full rounded-xl border border-ink-line bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-ember transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={canSend ? buildWhatsappMessage() : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!canSend}
              onClick={(e) => !canSend && e.preventDefault()}
              className={`flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                canSend
                  ? "bg-[#25D366] text-ink hover:brightness-110"
                  : "bg-ink-line text-paper-muted cursor-not-allowed"
              }`}
            >
              {t.contact.sendWhatsapp}
            </a>
            <a
              href={canSend ? buildEmailMessage() : undefined}
              aria-disabled={!canSend}
              onClick={(e) => !canSend && e.preventDefault()}
              className={`flex-1 inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-bold transition-colors ${
                canSend
                  ? "border-ink-line text-paper hover:border-ember"
                  : "border-ink-line text-paper-muted cursor-not-allowed"
              }`}
            >
              {t.contact.sendEmail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
