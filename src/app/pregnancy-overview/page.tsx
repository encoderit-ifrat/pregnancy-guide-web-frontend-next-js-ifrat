"use client";

import React, { useEffect, useState } from "react";
import PregnancyOverview from "./_components/PregnancyOverview";
import { useSession } from "next-auth/react";
import NoPregnancyInfo from "@/components/base/NoPregnancyInfo";
import PregnancyError from "@/components/base/PregnancyError";
import { API_V1 } from "@/consts";
import { useTranslation } from "@/providers/I18nProvider";

// Fetch user-specific data using session
async function getPregnancyData(token: string, locale: string = "sv") {
  try {
    const res = await fetch(
      `${API_V1}/pregnancy?lang=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept-Language": locale,
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
export default function Page() {
  const { data: session } = useSession();
  const { locale, t } = useTranslation();
  const [pregnancyData, setPregnancyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.token) {
      getPregnancyData(session.token as string, locale)
        .then((res) => {
          if (res.error) {
            setError(res.error);
          } else {
            setPregnancyData(res);
          }
        })
        .finally(() => setLoading(false));
    } else if (session === null) {
      setLoading(false);
    }
  }, [session, locale]);

  if (loading) {
    return <div className="p-4 text-center">{t("common.loading")}</div>;
  }

  // Check if user is authenticated
  if (!session || !session.token) {
    return (
      <div className="p-4">
        <p>{t("pregnancy.loginRequired")}</p>
      </div>
    );
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
