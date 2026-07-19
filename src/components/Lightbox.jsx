import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const tintMap = {
  ember: "var(--color-ember)",
  gold: "var(--color-gold)",
  "ember-glow": "var(--color-ember-glow)",
};

export default function Lightbox({ project, onClose }) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
            className="h-72 md:h-96 w-full flex items-center justify-center bg-cover bg-center"
            style={{
              background: project.imageUrl
                ? `url(${project.imageUrl}) center/cover`
                : `linear-gradient(135deg, ${tintMap[project.tint]}33, transparent)`,
            }}
          >
            {!project.imageUrl && (
              <span
                className="text-6xl font-black opacity-30"
                style={{ color: tintMap[project.tint] }}
              >
                {(lang === "ar" ? project.ar : project.en).charAt(0)}
              </span>
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
