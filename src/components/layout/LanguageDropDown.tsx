import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Languages, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function LanguageDropDown({ className }: { className?: string }) {
    const { t, locale, setLocale } = useTranslation();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    return (
        <div className="relative">
            {/* language Menu Dropdown */}
            <div
                className={cn(className)}
                onMouseEnter={() => setIsLanguageOpen(true)}
                onMouseLeave={() => setIsLanguageOpen(false)}
            >
                <div
                    className="flex items-center justify-between gap-1 text-lg font-medium transition-colors text-primary-dark font-outfit hover:text-primary cursor-pointer py-2"
                >
                    <Languages />
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isLanguageOpen && "rotate-180")} />
                </div>
                {isLanguageOpen && (
                    <div className="absolute left-0 mt-0 w-48 bg-white shadow-xl rounded-lg py-3 ring-1 ring-black/5 z-50">
                        <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("header.language")}</span>
                        </div>
                        <div className="flex flex-col gap-1 px-2">
                            <button
                                onClick={() => {
                                    setLocale("en");
                                    setIsLanguageOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-2",
                                    locale === "en" ? "bg-primary-light text-primary font-semibold" : "hover:bg-gray-50 text-primary-dark"
                                )}
                            > 🇺🇸 {t("header.english")}
                            </button>
                            <button
                                onClick={() => {
                                    setLocale("sv");
                                    setIsLanguageOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center gap-2",
                                    locale === "sv" ? "bg-primary-light text-primary font-semibold" : "hover:bg-gray-50 text-primary-dark"
                                )}
                            >
                                🇸🇪 {t("header.swedish")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}