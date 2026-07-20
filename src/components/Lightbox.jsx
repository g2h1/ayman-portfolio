import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { isVideoUrl } from "../lib/media";

const tintMap = {
  ember: "var(--color-ember)",
  gold: "var(--color-gold)",
  "ember-glow": "var(--color-ember-glow)",
};

const LIKED_KEY = "ayman-portfolio-liked-projects";

function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Lightbox({ project, onClose }) {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState(project.likesCount || 0);
  const [liked, setLiked] = useState(() => getLikedIds().includes(project.id));
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const images = project?.imageUrls || [];
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowRight") next();
      if (hasMultiple && e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, hasMultiple, images.length]);

  useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      setLoadingComments(true);
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });
      if (isMounted) {
        setComments(data || []);
        setLoadingComments(false);
      }
    }
    loadComments();
    return () => {
      isMounted = false;
    };
  }, [project.id]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    const likedIds = getLikedIds();
    localStorage.setItem(
      LIKED_KEY,
      JSON.stringify([...likedIds, project.id])
    );
    await supabase.rpc("increment_project_likes", { project_id: project.id });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({ project_id: project.id, name: name.trim(), message: message.trim() })
      .select()
      .single();
    if (!error && data) {
      setComments((prev) => [data, ...prev]);
      setName("");
      setMessage("");
    }
    setSubmitting(false);
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl my-8 rounded-2xl overflow-hidden bg-ink-soft border border-ink-line"
        >
          <div
            className="relative h-72 md:h-[28rem] w-full flex items-center justify-center bg-cover bg-center bg-ink"
            style={{
              background:
                hasImages && !isVideoUrl(images[index])
                  ? `url("${images[index]}") center/contain no-repeat`
                  : `linear-gradient(135deg, ${tintMap[project.tint]}33, transparent)`,
            }}
          >
            {hasImages && isVideoUrl(images[index]) && (
              <video
                key={images[index]}
                src={images[index]}
                className="w-full h-full object-contain"
                controls
                playsInline
              />
            )}
            {!hasImages && (
              <span
                className="text-6xl font-black opacity-30"
                style={{ color: tintMap[project.tint] }}
              >
                {(lang === "ar" ? project.ar : project.en).charAt(0)}
              </span>
            )}

            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  type="button"
                  aria-label="Previous image"
                  className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-full bg-ink/70 hover:bg-ember text-paper flex items-center justify-center transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  type="button"
                  aria-label="Next image"
                  className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-full bg-ink/70 hover:bg-ember text-paper flex items-center justify-center transition-colors"
                >
                  ›
                </button>
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-5 bg-ember" : "w-1.5 bg-paper/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold text-paper">
              {lang === "ar" ? project.ar : project.en}
            </h3>
            <p className="mt-1 text-sm text-paper-muted">{project.year}</p>

            {/* لايك، عدد الكومنتات، تواصل معانا */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleLike}
                type="button"
                disabled={liked}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  liked
                    ? "bg-ember text-paper"
                    : "bg-ink text-paper-muted hover:text-paper border border-ink-line"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
                {likes}
              </button>

              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-ink text-paper-muted border border-ink-line">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                </svg>
                {comments.length}
              </span>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-ember text-paper hover:bg-ember-glow transition-colors"
              >
                {t.work.contactCta}
              </Link>
            </div>

            {/* الكومنتات */}
            <div className="mt-7 border-t border-ink-line pt-6">
              <h4 className="text-sm font-extrabold text-paper mb-3">
                {t.work.commentsTitle}
              </h4>

              <form onSubmit={handleSubmitComment} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    maxLength={60}
                    className="w-full sm:w-40 rounded-xl border border-ink-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-ember transition-colors"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.work.commentPlaceholder}
                    maxLength={500}
                    className="w-full flex-1 rounded-xl border border-ink-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-ember transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !message.trim()}
                    className="rounded-xl px-4 py-2 text-sm font-bold bg-ember text-paper hover:bg-ember-glow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t.work.commentSubmit}
                  </button>
                </div>
              </form>

              <div className="mt-4 space-y-3 max-h-52 overflow-y-auto">
                {loadingComments && (
                  <p className="text-xs text-paper-muted">
                    {lang === "ar" ? "جاري تحميل التعليقات..." : "Loading comments..."}
                  </p>
                )}
                {!loadingComments && comments.length === 0 && (
                  <p className="text-xs text-paper-muted">
                    {t.work.noComments}
                  </p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-ink px-3 py-2.5">
                    <p className="text-xs font-bold text-gold">{c.name}</p>
                    <p className="text-sm text-paper-muted mt-0.5">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 end-4 rounded-full bg-ink/70 hover:bg-ember px-4 py-2 text-xs font-bold text-paper transition-colors"
          >
            {t.work.close} ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
