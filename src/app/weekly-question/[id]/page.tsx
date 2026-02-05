import React from "react";
import WeeklyQuestionView from "./_components/WeeklyQuestionView";
import { Metadata } from "next";

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
    <div className="bg-linear-to-b from-purple-50 to-white pb-56">
      <div className="min-h-screen pb-20 p-4 pt-24">
        <WeeklyQuestionView id={id} timestamp={t} />
      </div>
    </div>
  );
}
