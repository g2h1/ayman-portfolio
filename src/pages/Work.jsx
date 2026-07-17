import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { categories, projects } from "../data/content";
import Lightbox from "../components/Lightbox";

const tintMap = {
  ember: "var(--color-ember)",
  gold: "var(--color-gold)",
  "ember-glow": "var(--color-ember-glow)",
};

export default function Work() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-black text-paper">
        {t.work.title}
      </h1>
      <p className="mt-3 text-paper-muted max-w-lg">{t.work.subtitle}</p>
      <p className="mt-2 text-xs text-gold/80 italic">
        {t.work.placeholderNotice}
      </p>

      {/* فلتر التصنيفات */}
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
            activeCategory === "all"
              ? "bg-ember text-paper"
              : "bg-ink-soft text-paper-muted hover:text-paper"
          }`}
        >
          {t.work.all}
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
              activeCategory === c.key
                ? "bg-ember text-paper"
                : "bg-ink-soft text-paper-muted hover:text-paper"
            }`}
          >
            {lang === "ar" ? c.ar : c.en}
          </button>
        ))}
      </div>

      {/* شبكة المشاريع */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => {
          const catLabel = categories.find((c) => c.key === project.category);
          return (
            <motion.button
              key={project.id}
              layout
              onClick={() => setSelected(project)}
              className="group text-start rounded-2xl overflow-hidden border border-ink-line bg-ink-soft hover:border-ember/60 transition-colors"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${tintMap[project.tint]}2b, transparent)`,
                }}
              >
                <span
                  className="text-5xl font-black opacity-25 group-hover:opacity-50 transition-opacity"
                  style={{ color: tintMap[project.tint] }}
                >
                  {(lang === "ar" ? project.ar : project.en).charAt(0)}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-gold uppercase tracking-wide">
                  {lang === "ar" ? catLabel?.ar : catLabel?.en}
                </p>
                <h3 className="mt-1 font-extrabold text-paper">
                  {lang === "ar" ? project.ar : project.en}
                </h3>
                <p className="mt-1 text-xs text-paper-muted">
                  {project.year}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <Lightbox project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
