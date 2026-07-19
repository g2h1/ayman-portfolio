import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

export default function NewsTicker() {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (isMounted) setNews(data || []);
    }
    loadNews();
    return () => {
      isMounted = false;
    };
  }, []);

  if (news.length === 0) return null;

  const items = [...news, ...news];

  return (
    <div className="relative border-y border-ink-line/60 bg-ink-soft py-3 overflow-hidden">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="text-sm font-semibold text-paper-muted">
            <span className="text-gold font-bold me-2">{t.home.newsLabel}</span>
            {item.title}
            <span className="mx-6 text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
