import React from "react";
import { Metadata } from "next";
import PregnancyOverview from "./_components/PregnancyOverview";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utlis/authOptions";
import NoPregnancyInfo from "@/components/base/NoPregnancyInfo";
import PregnancyError from "@/components/base/PregnancyError";

// Metadata for the page title
export const metadata: Metadata = {
  title: "Pregnancy Overview | Familij",
  description: "Track and monitor your pregnancy journey",
};

// Force dynamic rendering (SSR)
export const dynamic = "force-dynamic";

// Fetch user-specific data using session
async function getPregnancyData(token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pregnancy`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Changed from next.revalidate to cache: 'no-store' for SSR
      }
    );

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
export default async function Page() {
  // Get session from NextAuth or your auth provider
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.token) {
    return (
      <div className="p-4">
        <p>Please log in to view your pregnancy overview.</p>
      </div>
    );
  }

  // Get token from session (adjust based on your session structure)
  const token = session.token;

  // Fetch data with the token
  const { data: pregnancyData, error } = await getPregnancyData(token);
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
      <PregnancyOverview pregnancyData={pregnancyData} />
    </div>
  );
}
