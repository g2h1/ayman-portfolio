import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import NewsTicker from "../components/NewsTicker";

export default function Home() {
  const { t } = useLanguage();
  const ticker = t.hero.ticker;

  return (
    <div>
      <NewsTicker />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        {/* ambient glow — the one bold accent on the page */}
        <div
          className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-ember) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-20 md:pt-40 md:pb-28">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-6 text-6xl md:text-8xl font-black leading-[0.95] text-paper">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-paper-muted">
            {t.hero.subtitle}
          </p>
          <Link
            to="/work"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-bold text-paper hover:bg-ember-glow transition-colors"
          >
            {t.hero.cta}
          </Link>
        </div>

        {/* signature element — infinite skills ticker, showreel-style */}
        <div className="relative border-y border-ink-line/60 bg-ink-soft py-4 overflow-hidden">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
            {[...ticker, ...ticker].map((item, i) => (
              <span
                key={i}
                className="text-2xl md:text-3xl font-extrabold text-paper-muted/70"
              >
                {item}
                <span className="mx-6 text-ember">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
