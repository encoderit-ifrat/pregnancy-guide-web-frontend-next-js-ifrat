"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { useRouter } from "next/navigation";

import en from "@/i18n/en.json";
import sv from "@/i18n/sv.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Locale = "en" | "sv";

type TranslationMap = Record<string, unknown>;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

// ---------------------------------------------------------------------------
// Translations map
// ---------------------------------------------------------------------------

const translations: Record<Locale, TranslationMap> = { en, sv };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "familj-locale";

/** Resolve a dot-separated key against a nested object */
function resolve(obj: TranslationMap, key: string): string {
    const parts = key.split(".");
    let current: unknown = obj;
    for (const part of parts) {
        if (current == null || typeof current !== "object") return key;
        current = (current as Record<string, unknown>)[part];
    }
    return typeof current === "string" ? current : key;
}

/** Interpolate `{param}` placeholders */
function interpolate(
    template: string,
    params?: Record<string, string | number>,
): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] != null ? String(params[k]) : `{${k}}`,
    );
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("sv");
    const router = useRouter();

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
            if (stored && (stored === "en" || stored === "sv")) {
                setLocaleState(stored);
            }
        } catch {
            // SSR or privacy mode — ignore
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        try {
            localStorage.setItem(STORAGE_KEY, newLocale);
            // Sync with cookie for SSR
            document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

            // Trigger refresh to update server-rendered content
            router.refresh();
        } catch {
            // ignore
        }
    }, [router]);

    const t = useCallback(
        (key: string, params?: Record<string, string | number>) => {
            const raw = resolve(translations[locale], key);
            return interpolate(raw, params);
        },
        [locale],
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error("useTranslation must be used within an I18nProvider");
    }
    return ctx;
}
