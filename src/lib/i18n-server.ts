import { cookies } from "next/headers";
import en from "@/i18n/en.json";
import sv from "@/i18n/sv.json";

export type Locale = "en" | "sv";

const translations: Record<Locale, any> = { en, sv };

/** Resolve a dot-separated key against a nested object */
function resolve(obj: any, key: string): string {
    const parts = key.split(".");
    let current: any = obj;
    for (const part of parts) {
        if (current == null || typeof current !== "object") return key;
        current = current[part];
    }
    return typeof current === "string" ? current : key;
}

/** Interpolate {param} placeholders */
function interpolate(
    template: string,
    params?: Record<string, string | number>,
): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] != null ? String(params[k]) : `{${k}}`,
    );
}

export async function getI18n() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get("familj-locale")?.value || "sv") as Locale;
    console.log("👉 ~ getI18n ~ locale from cookie:", locale);

    const t = (key: string, params?: Record<string, string | number>) => {
        const lang = translations[locale] ? locale : "sv";
        const raw = resolve(translations[lang], key);
        return interpolate(raw, params);
    };

    return { t, locale };
}
