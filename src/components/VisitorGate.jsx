import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function VisitorGate() {
  const { t } = useLanguage();
  const { user, profile, visitorType, setVisitorType, loading } = useAuth();

  // ماتظهرش لو لسه بنحمّل، أو لو المستخدم مسجل دخول بالفعل (نوعه معروف من حسابه)،
  // أو لو أصلاً اختار قبل كده
  if (loading || user || profile || visitorType) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[95] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-2xl border border-ink-line bg-ink-soft p-7 text-center"
        >
          <h2 className="text-xl font-extrabold text-paper">
            {t.visitorGate.question}
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => setVisitorType("client")}
              type="button"
              className="rounded-xl border border-ink-line px-5 py-3.5 text-sm font-bold text-paper hover:border-ember hover:bg-ember/10 transition-colors"
            >
              {t.visitorGate.client}
            </button>
            <button
              onClick={() => setVisitorType("company")}
              type="button"
              className="rounded-xl border border-ink-line px-5 py-3.5 text-sm font-bold text-paper hover:border-ember hover:bg-ember/10 transition-colors"
            >
              {t.visitorGate.company}
            </button>
          </div>

          <p className="mt-5 text-xs text-paper-muted">
            {t.visitorGate.changeLater}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
