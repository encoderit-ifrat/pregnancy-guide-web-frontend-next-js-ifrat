import React from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { Metadata } from "next";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { CircleQuestionMark, Heart } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

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
    <div className="relative min-h-svh">
      <section className="absolute bg-[#F6F0FF] top-0 left-0 w-full h-[60vh] z-10">
        <div className="h-[50vh]"></div>
        <WaveDivider
          className="text-white transform translate-y-[1px]"
          bgClassName="bg-[#F6F0FF]"
        />
      </section>
      <div className="relative z-20 px-4 pt-6 md:pt-24 pb-10 md:pb-20">
        <div className="flex flex-col items-center justify-center mb-10">
          {/* Section Label */}
          <IconHeading
            text="Question"
            icon={<CircleQuestionMark />}
            className="text-primary justify-center md:justify-start"
          />
          <SectionHeading>Question of the week</SectionHeading>
          <p className="max-w-lg text-center">Answer the weekly pregnancy question, explore community responses, and express how you’re feeling.</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 bg-soft-white shadow-2xl rounded-lg p-6">
          <WeeklyQuestionView id={id} timestamp={t} />
        </div>
      </div>
    </div>
  );
}
