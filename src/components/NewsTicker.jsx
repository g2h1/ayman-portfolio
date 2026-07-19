import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

export default function NewsTicker() {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (news.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % news.length);
    }, 3000);
    return () => clearInterval(id);
  }, [news.length]);

  if (news.length === 0) return null;

  const current = news[index];

  return (
    <div className="relative border-y border-ink-line/60 bg-ink-soft overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            {current.image_url && (
              <div
                className="w-14 h-14 rounded-xl shrink-0 bg-cover bg-center border border-ink-line"
                style={{ background: `url("${current.image_url}") center/cover` }}
              />
            )}
            <p className="text-sm font-semibold text-paper-muted">
              <span className="text-gold font-bold me-2">
                {t.home.newsLabel}
              </span>
              {current.title}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {news.length > 1 && (
        <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1.5">
          {news.map((n, i) => (
            <span
              key={n.id}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-4 bg-ember" : "w-1 bg-paper/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
