import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const SESSION_KEY = "ayman-portfolio-intro-seen";

/**
 * بوابة الدخول — شاشة انيميشن بتظهر مرة واحدة بس في الجلسة،
 * بتعرض عداد تحميل واسمك، وبعدين "بتتفتح" زي الستارة وتكشف الموقع.
 */
export default function Intro({ onFinish }) {
  const { lang } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading -> opening -> done

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      onFinish();
      return;
    }

    const duration = 1800; // ms
    const start = performance.now();

    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("opening");
        setTimeout(() => {
          window.sessionStorage.setItem(SESSION_KEY, "1");
          setPhase("done");
          setTimeout(onFinish, 700);
        }, 600);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const name = lang === "ar" ? "أيمن منصور" : "AYMAN MANSOUR";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {/* اللوحة العلوية */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink flex items-end justify-center overflow-hidden"
            animate={phase === "opening" ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-black text-paper mb-4 tracking-tight"
            >
              {name}
            </motion.h1>
          </motion.div>

          {/* اللوحة السفلية */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink flex items-start justify-center overflow-hidden"
            animate={phase === "opening" ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="h-px w-40 bg-ink-line relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 start-0 bg-ember"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gold tabular-nums">
                {progress}%
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
