// components/base/SearchResultHeader.tsx
import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type SearchResultHeaderProps = {
  query: string;
  category?: string; // e.g. "Articles" or "Baby Names"
};

export default function SearchResultHeader({
  query,
  category = "Articles",
}: SearchResultHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-sm mt-6 mb-4 max-w-[700px] mx-auto">
      <div className="bg-purple-500/10 p-2 rounded-full">
        <Search className="h-5 w-5 text-soft" />
      </div>
      <p className="text-gray-800 text-base sm:text-lg">
        {t("pregnancy.searchResultFound")}{" "}
        <span className="font-semibold text-soft">&quot;{query}&quot;</span> {t("pregnancy.searchResultIn")}{" "}
        <span className="font-medium">{category}</span>.
      </p>
    </div>
  );
}
