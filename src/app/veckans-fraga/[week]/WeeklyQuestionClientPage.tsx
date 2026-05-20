"use client";
import React from "react";
import WeeklyQuestionView from "@/app/weekly-question/[id]/_components/WeeklyQuestionView";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryGetAllAnswers } from "@/app/weekly-question/[id]/_api/queries/useQueryGetAllAnswers";

export default function WeeklyQuestionClientPage({
  questionId,
  weekNumber,
  page,
  timestamp,
}: {
  questionId: string;
  weekNumber: number;
  page: string;
  timestamp?: string;
}) {
  const { t } = useTranslation();
  const { data } = useQueryGetAllAnswers({
    params: {
      id: questionId,
      timestamp,
      page: page || "1",
    },
  });

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mb-6">
        <IconHeading
          text={t("pregnancy.questionOfTheWeek")}
          image="/images/icons/question.png"
          className="text-primary justify-center"
        />
        <SectionHeading>{t("pregnancy.weekQuestion", { week: weekNumber })}</SectionHeading>
        <p className="max-w-lg text-center text-primary-color opacity-80">
          {t("weeklyQuestion.pageDescription")}
        </p>
      </div>

      <div
        className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-soft-white shadow-2xl rounded-xl border-b-6
        border-b-primary"
      >
        <WeeklyQuestionView id={questionId} timestamp={timestamp} />
      </div>
    </PageContainer>
  );
}
