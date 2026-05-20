import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utlis/authOptions";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import PregnancyError from "@/components/base/PregnancyError";
import WeeklyQuestionClientPage from "./WeeklyQuestionClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawWeek = resolvedParams.week || "";
  const weekNumber = parseInt(rawWeek.replace("vecka-", ""), 10) || 3;

  return {
    title: `Veckans fråga, vecka ${weekNumber} | Familj.se`,
    description: `En reflekterande fråga att svara på tillsammans, för dig som är gravid och din partner. Spara era svar och se hur tankarna förändras.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

async function getPregnancyData(token: string, week: number, lang: string = "sv") {
  try {
    const url = new URL(`${API_V1}/pregnancy`);
    url.searchParams.set("week", String(week));
    url.searchParams.set("lang", lang);
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": lang,
        "x-lang": lang,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return { data: null, error: "Failed to connect to server" };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ week: string }>;
  searchParams: Promise<{ page?: string; t?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.token) {
    return (
      <div className="p-4 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-primary-color">
          Vänligen logga in för att se veckans fråga.
        </p>
      </div>
    );
  }

  const resolvedParams = await params;
  const { page, t } = await searchParams;

  // Extract number from vecka-N or N
  const rawWeek = resolvedParams.week || "";
  const weekNumber = parseInt(rawWeek.replace("vecka-", ""), 10) || 3;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const { data: pregnancyData, error } = await getPregnancyData(
    session.token,
    weekNumber,
    locale
  );

  if (error) {
    return <PregnancyError error={error} />;
  }

  const question = pregnancyData?.questions?.data?.[0];
  if (!question) {
    return (
      <div className="p-4 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-primary-color">
          Ingen fråga hittades för denna vecka.
        </p>
      </div>
    );
  }

  return (
    <WeeklyQuestionClientPage
      questionId={question._id}
      weekNumber={weekNumber}
      page={page || "1"}
      timestamp={t}
    />
  );
}
