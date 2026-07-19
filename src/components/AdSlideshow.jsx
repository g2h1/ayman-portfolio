import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdSlideshow({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const goTo = (i) => setIndex(i);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden border border-ink-line">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ background: `url("${slides[index].image_url}") center/cover` }}
        >
          {slides[index].title && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
              <p className="text-paper font-bold">{slides[index].title}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            type="button"
            aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-full bg-ink/70 hover:bg-ember text-paper flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            type="button"
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-full bg-ink/70 hover:bg-ember text-paper flex items-center justify-center transition-colors"
          >
            ›
          </button>
          <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-ember" : "w-1.5 bg-paper/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
