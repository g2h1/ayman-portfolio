import { useLanguage } from "../context/LanguageContext";
import { pricingPackages, testimonials, paymentMethods } from "../data/content";

export default function Pricing() {
  const { lang, t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-paper">
        {t.pricing.title}
      </h1>
      <p className="mt-3 text-paper-muted max-w-xl">{t.pricing.subtitle}</p>

      {/* خدمات شاملة */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
        {pricingPackages.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-ink-line bg-ink-soft p-7 flex flex-col"
          >
            <h2 className="text-xl font-extrabold text-paper">
              {lang === "ar" ? service.ar : service.en}
            </h2>

            <p className="mt-3 text-sm text-paper-muted leading-relaxed">
              {lang === "ar" ? service.description.ar : service.description.en}
            </p>

            <p className="mt-5">
              <span className="text-xs text-paper-muted">
                {t.pricing.startingAt}
              </span>{" "}
              <span className="text-2xl font-black text-ember">
                {t.pricing.currency}
                {service.startingAt.toLocaleString(
                  lang === "ar" ? "ar-EG" : "en-US"
                )}
              </span>
            </p>

            <ul className="mt-5 space-y-2 flex-1">
              {(lang === "ar" ? service.features.ar : service.features.en).map(
                (f, fi) => (
                  <li
                    key={fi}
                    className="text-sm text-paper-muted flex items-start gap-2"
                  >
                    <span className="text-gold mt-0.5">✦</span>
                    <span>{f}</span>
                  </li>
                )
              )}
            </ul>

            <a
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-ember px-5 py-2.5 text-sm font-bold text-paper hover:bg-ember-glow transition-colors self-start"
            >
              {t.pricing.cta}
            </a>
          </div>
        ))}
      </div>

      {/* الريفيوهات */}
      <div className="mt-20">
        <h2 className="text-2xl font-extrabold text-paper mb-8">
          {t.pricing.reviewsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-ink-line bg-ink-soft/60 p-6"
            >
              <p className="text-sm text-paper-muted leading-relaxed">
                “{lang === "ar" ? rev.text.ar : rev.text.en}”
              </p>
              <p className="mt-4 text-sm font-bold text-paper">{rev.name}</p>
              <p className="text-xs text-paper-muted">
                {lang === "ar" ? rev.role.ar : rev.role.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* طرق الدفع */}
      <div className="mt-20 rounded-2xl border border-ink-line bg-ink-soft p-8 text-center">
        <h2 className="text-xl font-extrabold text-paper">
          {t.pricing.paymentTitle}
        </h2>
        <p className="mt-2 text-sm text-paper-muted">{t.pricing.paymentText}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {paymentMethods.map((m) => (
            <div
              key={m.key}
              className="rounded-xl border border-ink-line px-5 py-3 text-center min-w-[9rem]"
            >
              <p className="text-sm font-bold text-paper">
                {lang === "ar" ? m.ar : m.en}
              </p>
              {m.detail ? (
                <p className="mt-1 text-xs text-gold" dir="ltr">
                  {m.detail}
                </p>
              ) : (
                <p className="mt-1 text-xs text-paper-muted">
                  {t.pricing.paymentContactMe}
                </p>
              )}
            </div>
          ))}
        </div>

        <a
          href="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-paper hover:bg-ember-glow transition-colors"
        >
          {t.pricing.cta}
        </a>
      </div>
    </section>
  );
}
