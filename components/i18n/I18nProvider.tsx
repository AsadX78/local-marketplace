"use client";

import * as React from "react";
import { LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/lib/types";

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, string>;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lm_language";

// Local fallback dictionary (used before Supabase loads or offline)
const FALLBACK: Record<LanguageCode, Record<string, string>> = {
  en: {},
  pcm: {},
  yo: {},
  ha: {},
  ig: {},
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = React.useState<LanguageCode>("en");
  const [translations, setTranslations] = React.useState<Record<string, string>>({});

  // Load saved language
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  // Load translations from Supabase
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data } = await supabase
          .from("translations")
          .select("key, value")
          .eq("language_code", language);
        if (!cancelled && data) {
          const map: Record<string, string> = {};
          data.forEach((t) => {
            map[t.key] = t.value;
          });
          setTranslations(map);
        }
      } catch {
        // Use fallback if Supabase unavailable
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  const setLanguage = React.useCallback((lang: LanguageCode) => {
    setLangState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  const t = React.useCallback(
    (key: string, fallback?: string) => {
      return translations[key] || fallback || key;
    },
    [translations]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    // Return safe defaults if used outside provider
    return {
      language: "en" as LanguageCode,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      translations: {},
    };
  }
  return ctx;
}
