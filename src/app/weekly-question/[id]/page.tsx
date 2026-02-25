"use client";
import React, { use } from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { CircleQuestionMark } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";

export default function WeeklyQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; t?: string }>; // t is the timestamp for cache busting
}) {
  const { id } = use(params);
  const { t: timestamp } = use(searchParams);
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mb-10">
        {/* Section Label */}
        <IconHeading
          text={t("weeklyQuestion.pageTitle")}
          icon={<CircleQuestionMark />}
          className="text-primary justify-center md:justify-start"
        />
        <SectionHeading>{t("weeklyQuestion.pageHeading")}</SectionHeading>
        <p className="max-w-lg text-center">
          {t("weeklyQuestion.pageDescription")}
        </p>
      </div>

      <div
        className="max-w-5xl mx-auto p-4 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl border-b-6
        border-b-primary"
      >
        <WeeklyQuestionView id={id} timestamp={timestamp} />
      </div>
    </PageContainer>
  );
}
