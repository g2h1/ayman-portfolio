import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

export default function PartnerDetail() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("id", id)
        .single();
      if (isMounted) {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPartner(data);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm text-paper-muted">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-lg font-bold text-paper">{t.partners.notFound}</p>
        <Link
          to="/partners"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-paper hover:bg-ember-glow transition-colors"
        >
          {t.partners.backToPartners}
        </Link>
      </section>
    );
  }

  const links = [
    { key: "youtube", url: partner.youtube_url, label: "YouTube" },
    { key: "instagram", url: partner.instagram_url, label: "Instagram" },
    { key: "tiktok", url: partner.tiktok_url, label: "TikTok" },
  ].filter((l) => l.url);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Link
        to="/partners"
        className="text-sm font-bold text-paper-muted hover:text-paper transition-colors"
      >
        ← {t.partners.backToPartners}
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div
          className="w-24 h-24 rounded-full shrink-0 bg-cover bg-center flex items-center justify-center bg-ink-soft border border-ink-line"
          style={{
            background: partner.avatar_url
              ? `url("${partner.avatar_url}") center/cover`
              : undefined,
          }}
        >
          {!partner.avatar_url && (
            <span className="text-3xl font-black text-ember">
              {partner.name?.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-black text-paper">{partner.name}</h1>
          {partner.followers_count != null && (
            <p className="mt-1 text-sm text-paper-muted">
              {partner.followers_count.toLocaleString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}{" "}
              {t.partners.followers}
            </p>
          )}
        </div>
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink-line px-5 py-2 text-sm font-bold text-paper hover:border-ember transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      {(partner.campaign_title || partner.campaign_description) && (
        <div className="mt-10 rounded-2xl border border-ink-line bg-ink-soft p-6 md:p-8">
          {partner.campaign_title && (
            <h2 className="text-lg font-extrabold text-gold">
              {partner.campaign_title}
            </h2>
          )}
          {partner.campaign_description && (
            <p className="mt-3 text-sm text-paper-muted leading-relaxed">
              {partner.campaign_description}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
