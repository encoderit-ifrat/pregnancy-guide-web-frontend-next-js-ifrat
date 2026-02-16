import React from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { Metadata } from "next";
import { CircleQuestionMark } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return {
    title: "Weekly Question",
    description:
      "Join the discussion and share your thoughts on this week's question.",
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
  const { t } = await searchParams; // Get the timestamp

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mb-10">
        {/* Section Label */}
        <IconHeading
          text="Question"
          icon={<CircleQuestionMark />}
          className="text-primary justify-center md:justify-start"
        />
        <SectionHeading>Question of the week</SectionHeading>
        <p className="max-w-lg text-center">
          Answer the weekly pregnancy question, explore community responses, and
          express how you’re feeling.
        </p>
      </div>

      <div
        className="max-w-5xl mx-auto p-4 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl border-b-6
        border-b-primary"
      >
        <WeeklyQuestionView id={id} timestamp={t} />
      </div>
    </PageContainer>
  );
}
