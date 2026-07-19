import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { getYoutubeEmbedUrl } from "../lib/media";

export default function PartnerDetail() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [partner, setPartner] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const [partnerRes, campaignsRes] = await Promise.all([
        supabase.from("partners").select("*").eq("id", id).single(),
        supabase
          .from("campaigns")
          .select("*")
          .eq("partner_id", id)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);
      if (isMounted) {
        if (partnerRes.error || !partnerRes.data) {
          setNotFound(true);
        } else {
          setPartner(partnerRes.data);
          setCampaigns(campaignsRes.data || []);
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

      {/* الحملات الإعلانية */}
      {campaigns.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-paper mb-5">
            {t.partners.campaignsTitle}
          </h2>
          <div className="space-y-6">
            {campaigns.map((c) => {
              const embedUrl = getYoutubeEmbedUrl(c.youtube_url);
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-ink-line bg-ink-soft overflow-hidden"
                >
                  {embedUrl && (
                    <div className="aspect-video w-full">
                      <iframe
                        src={embedUrl}
                        title={c.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-extrabold text-gold">{c.title}</h3>
                    {c.description && (
                      <p className="mt-2 text-sm text-paper-muted leading-relaxed">
                        {c.description}
                      </p>
                    )}
                    {(c.views_count != null || c.likes_count != null) && (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {c.views_count != null && (
                          <span className="text-xs font-bold text-paper-muted">
                            👁 {c.views_count.toLocaleString(
                              lang === "ar" ? "ar-EG" : "en-US"
                            )}{" "}
                            {t.partners.views}
                          </span>
                        )}
                        {c.likes_count != null && (
                          <span className="text-xs font-bold text-paper-muted">
                            ❤ {c.likes_count.toLocaleString(
                              lang === "ar" ? "ar-EG" : "en-US"
                            )}{" "}
                            {t.partners.likes}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {campaigns.length === 0 && (
        <p className="mt-10 text-sm text-paper-muted">
          {t.partners.noCampaigns}
        </p>
      )}
    </section>
  );
}
