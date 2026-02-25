"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FLAG: Record<string, string> = {
    en: "🇺🇸",
    sv: "🇸🇪",
};

export default function LanguageDropdown({ className }: { className?: string }) {
    const { t, locale, setLocale } = useTranslation();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en", label: t("header.english") || "English" },
        { code: "sv", label: t("header.swedish") || "Swedish" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* language Trigger */}
            <div
                className={cn(
                    "flex items-center justify-between gap-1 text-lg font-medium transition-colors text-primary-dark font-outfit hover:text-primary cursor-pointer py-2",
                    className
                )}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                onMouseEnter={() => setIsLanguageOpen(true)}
            >
                <span className="text-xl leading-none">{FLAG[locale] ?? "🌐"}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isLanguageOpen && "rotate-180")} />
            </div>

            {/* Dropdown Content */}
            {isLanguageOpen && (
                <div
                    className="absolute right-0 mt-0 w-48 bg-white shadow-xl rounded-lg py-2 z-50 overflow-hidden"
                    onMouseLeave={() => setIsLanguageOpen(false)}
                >
                    <div className="flex flex-col gap-1">
                        {languages.map((lang) => {
                            const isActive = locale === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLocale(lang.code as "en" | "sv");
                                        setIsLanguageOpen(false);
                                    }}
                                    className={cn(
                                        "relative w-full text-left px-4 py-2 transition-colors text-sm flex items-center gap-2",
                                        isActive
                                            ? "bg-[#F6F0FF] text-primary font-semibold"
                                            : "hover:bg-gray-50 text-primary-dark"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-dark rounded-r-full" />
                                    )}
                                    <span className="text-lg leading-none">{FLAG[lang.code]}</span>
                                    {lang.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}