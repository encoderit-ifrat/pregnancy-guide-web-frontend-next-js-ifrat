"use client";
import React, { use } from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { CircleQuestionMark } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryGetAllAnswers } from "./_api/queries/useQueryGetAllAnswers";

export default function WeeklyQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; t?: string }>; // t is the timestamp for cache busting
}) {
  const { id } = use(params);
  const { t: timestamp, page } = use(searchParams);
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useQueryGetAllAnswers({
    params: {
      id,
      timestamp,

      page: page || "1",
    },
  });
  const currentWeek = data?.data?.pregnancyWeekData?.running_week || 0;

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mb-6">
        {/* Section Label */}
        <IconHeading
          // text={t("pregnancy.question")}
          text={t("pregnancy.questionOfTheWeek")}
          image="/images/icons/question.png"
          className="text-primary justify-center"
        />
        <SectionHeading>{t("pregnancy.weekQuestion", { week: currentWeek })}</SectionHeading>
        <p className="max-w-lg text-center">
          {t("weeklyQuestion.pageDescription")}
        </p>
      </div>

      <div
        className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-soft-white shadow-2xl rounded-xl border-b-6
        border-b-primary"
      >
        <WeeklyQuestionView id={id} timestamp={timestamp} />
      </div>
    </PageContainer>
  );
}
