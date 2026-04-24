"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "en" | "sv";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

import en from "@/i18n/en.json";
import sv from "@/i18n/sv.json";

const translations: Record<Locale, any> = { en, sv };

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>("sv");

  useEffect(() => {
    const readCookieLocale = () => {
      const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith("familj-locale="))
        ?.split("=")[1];
      return cookieLocale === "en" || cookieLocale === "sv"
        ? (cookieLocale as Locale)
        : null;
    };

    const localStorageLocale = localStorage.getItem("familj-locale");
    const validLocalStorageLocale =
      localStorageLocale === "en" || localStorageLocale === "sv"
        ? (localStorageLocale as Locale)
        : null;

    const cookieLocale = readCookieLocale();
    const initialLocale = validLocalStorageLocale ?? cookieLocale ?? "sv";

    setLocaleState(initialLocale);
    localStorage.setItem("familj-locale", initialLocale);
    document.cookie = `familj-locale=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = initialLocale;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("familj-locale", newLocale);
    // Set cookie for SSR accessibility
    document.cookie = `familj-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;
    // Soft refresh to re-render any server components with the new locale
    router.refresh();
  };

  const t = (path: string, variables?: Record<string, any>) => {
    const keys = path.split(".");
    let current: any = translations[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return path; // Return the path if translation not found
      }
    }

    if (typeof current !== "string") return path;

    let translated = current;
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        // Use a regular expression with the global flag to replace all occurrences
        const regex = new RegExp(`\\{${key}\\}`, "g");
        translated = translated.replace(regex, String(value));
      });
    }

    return translated;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
