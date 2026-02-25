"use client";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    </div>
  );
}
