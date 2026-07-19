import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const tintMap = {
  ember: "var(--color-ember)",
  gold: "var(--color-gold)",
  "ember-glow": "var(--color-ember-glow)",
};

export default function Lightbox({ project, onClose }) {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);

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

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
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
          className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-ink-soft border border-ink-line"
        >
          <div
            className="relative h-72 md:h-96 w-full flex items-center justify-center bg-cover bg-center"
            style={{
              background: hasImages
                ? `url("${images[index]}") center/cover`
                : `linear-gradient(135deg, ${tintMap[project.tint]}33, transparent)`,
            }}
          >
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
