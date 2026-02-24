import React from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { Metadata } from "next";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { CircleQuestionMark, Heart } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { getI18n } from "@/lib/i18n-server";

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t("weeklyQuestion.title"),
    description: t("weeklyQuestion.description"),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; t?: string }>; // t is the timestamp for cache busting
}) {
  const { id } = await params;
  const { t: timestamp } = await searchParams; // Get the timestamp
  const { t } = await getI18n();

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
