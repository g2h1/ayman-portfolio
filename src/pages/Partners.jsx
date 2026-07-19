import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import AdSlideshow from "../components/AdSlideshow";

function PlatformIcon({ type }) {
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12Z" />
      </svg>
    );
  }
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16.6 5.8a4.3 4.3 0 0 1-3.1-1.3v9.7a5.2 5.2 0 1 1-4.5-5.2v2.7a2.6 2.6 0 1 0 1.8 2.5V2h2.7a4.3 4.3 0 0 0 3.1 3.8Z" />
    </svg>
  );
}

export default function Partners() {
  const { lang, t } = useLanguage();
  const [slides, setSlides] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const [slidesRes, partnersRes] = await Promise.all([
        supabase
          .from("ad_slides")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("partners")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);
      if (isMounted) {
        setSlides(slidesRes.data || []);
        setPartners(partnersRes.data || []);
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-paper">
        {t.partners.title}
      </h1>
      <p className="mt-3 text-paper-muted max-w-lg">{t.partners.subtitle}</p>

      {slides.length > 0 && (
        <div className="mt-10">
          <AdSlideshow slides={slides} />
        </div>
      )}

      {loading && (
        <p className="mt-10 text-sm text-paper-muted">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      )}

      {!loading && partners.length === 0 && (
        <p className="mt-10 text-sm text-paper-muted">
          {t.partners.noPartners}
        </p>
      )}

      {!loading && partners.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((p) => (
            <Link
              key={p.id}
              to={`/partners/${p.id}`}
              className="group rounded-2xl overflow-hidden border border-ink-line bg-ink-soft hover:border-ember/60 transition-colors p-5 flex items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full shrink-0 bg-cover bg-center flex items-center justify-center bg-ink"
                style={{
                  background: p.avatar_url
                    ? `url("${p.avatar_url}") center/cover`
                    : undefined,
                }}
              >
                {!p.avatar_url && (
                  <span className="text-xl font-black text-ember">
                    {p.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-paper truncate">{p.name}</p>
                {p.followers_count != null && (
                  <p className="text-xs text-paper-muted">
                    {p.followers_count.toLocaleString(
                      lang === "ar" ? "ar-EG" : "en-US"
                    )}{" "}
                    {t.partners.followers}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-2 text-paper-muted">
                  {p.youtube_url && <PlatformIcon type="youtube" />}
                  {p.instagram_url && <PlatformIcon type="instagram" />}
                  {p.tiktok_url && <PlatformIcon type="tiktok" />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
