"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
    const [locale, setLocaleState] = useState<Locale>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem("familj-locale") as Locale;
        if (savedLocale && (savedLocale === "en" || savedLocale === "sv")) {
            setLocaleState(savedLocale);
        }
        setMounted(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("familj-locale", newLocale);
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
                translated = translated.replace(`{${key}}`, String(value));
            });
        }

        return translated;
    };

    if (!mounted) {
        return <>{children}</>;
    }

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
