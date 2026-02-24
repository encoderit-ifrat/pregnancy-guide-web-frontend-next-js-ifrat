"use client";
"use i18n";

import { useI18n } from "@/providers/I18nProvider";

export const useTranslation = () => {
    const { t, locale, setLocale } = useI18n();
    return { t, locale, setLocale };
};
