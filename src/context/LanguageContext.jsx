import { createContext, useContext, useEffect, useState } from "react";
import { content } from "../data/content";

const LanguageContext = createContext(null);

const STORAGE_KEY = "ayman-portfolio-lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "ar";
    return window.localStorage.getItem(STORAGE_KEY) || "ar";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  const value = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: content[lang],
    toggleLang,
    setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return ctx;
}
