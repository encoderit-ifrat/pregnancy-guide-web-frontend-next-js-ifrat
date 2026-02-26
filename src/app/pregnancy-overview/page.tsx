import React from "react";
import { Metadata } from "next";
import PregnancyOverview from "./_components/PregnancyOverview";
import { PregnancyOverviewPageProps } from "./_types/pregnancy_overview_types";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/utlis/authOptions";
import NoPregnancyInfo from "@/components/base/NoPregnancyInfo";
import PregnancyError from "@/components/base/PregnancyError";
import { API_V1 } from "@/consts";

// Metadata for the page title
export const metadata: Metadata = {
  title: "Pregnancy Overview | Familij",
  description: "Track and monitor your pregnancy journey",
};

// Force dynamic rendering (SSR)
export const dynamic = "force-dynamic";

// Fetch user-specific data using session
async function getPregnancyData(token: string, week?: number, lang: string = "en") {
  try {
    const url = new URL(`${API_V1}/pregnancy`);
    if (week !== undefined) {
      url.searchParams.set("week", String(week));
    }
    url.searchParams.set("lang", lang);

    console.log("url", { url: url.toString() });

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
      const errorText = await res.text();
      throw new Error(`API returned ${res.status}: ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return { data: null, error: "Failed to connect to server" };
  }
}

// Async server component
export default async function Page({ searchParams }: PregnancyOverviewPageProps) {
  // Get session from NextAuth or your auth provider
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.token) {
    return (
      <div className="p-4">
        <p>Please login to view your pregnancy overview.</p>
      </div>
    );
  }

  // Get token from the session (adjust based on your session structure)
  const token = session.token;

  // Parse selected-week from URL query params
  const resolvedSearchParams = await searchParams;
  const selectedWeekParam = resolvedSearchParams?.["selected-week"];
  const rawWeek = Array.isArray(selectedWeekParam)
    ? selectedWeekParam[0]
    : selectedWeekParam;
  const selectedWeek = rawWeek ? parseInt(rawWeek, 10) : undefined;

  // Get locale from cookies
  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "en";

  // Fetch data with the token (pass week and lang to API if selected)
  const { data: pregnancyData, error } = await getPregnancyData(
    token,
    selectedWeek,
    locale
  );
  console.log({ pregnancyData });

  // Handle error state
  if (error) {
    return <PregnancyError error={error} />;
  }

  // Handle no data state
  if (
    pregnancyData?.userProfile?.details?.current_pregnancy_data == null ||
    !pregnancyData
  ) {
    return (
      <div>
        <NoPregnancyInfo />
      </div>
    );
  }

  return (
    <div>
      <PregnancyOverview pregnancyData={pregnancyData} selectedWeek={selectedWeek} />
    </div>
  );
}
