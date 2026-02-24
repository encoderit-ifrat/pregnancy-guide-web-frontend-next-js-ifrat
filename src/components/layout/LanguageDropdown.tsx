"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export const LanguageDropdown: React.FC = () => {
    const { t, locale, setLocale } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", label: t("header.english") || "English" },
        { code: "sv", label: t("header.swedish") || "Swedish" },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-light rounded-md"
            >
                <Globe className="w-4 h-4 text-primary" />
                <span>{currentLanguage?.label}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLocale(lang.code as "en" | "sv");
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "block w-full px-4 py-2 text-left text-sm transition-colors",
                                    locale === lang.code
                                        ? "bg-primary-light text-primary font-semibold"
                                        : "text-primary-dark hover:bg-gray-100"
                                )}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
