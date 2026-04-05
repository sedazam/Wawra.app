import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations, Translations } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("wawra_lang") as Lang) || "en";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("wawra_lang", newLang);
  };

  useEffect(() => {
    const dir = lang === "ps" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang === "ps" ? "ps" : "en");
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
