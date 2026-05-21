import React from "react";
import { Metadata } from "next";
import { SharedMatchedNamesClient } from "./SharedMatchedNamesClient";
import { OG_DEFAULT_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "En delad namnlista",
  description:
    "Någon har delat sin barnnamnslista med dig. Rösta på dina favoriter och hjälp dem hitta det perfekta namnet till barnet.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Rösta på vår barnnamnslista, vad tycker du?",
    description:
      "Vi har samlat våra favoritnamn på Familj.se. Rösta på dina favoriter och hjälp oss hitta det perfekta namnet till barnet.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rösta på vår barnnamnslista, vad tycker du?",
    description:
      "Vi har samlat våra favoritnamn på Familj.se. Rösta på dina favoriter och hjälp oss hitta det perfekta namnet till barnet.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

async function fetchInitialData(
  filter: string,
  user_id?: string,
  partner_id?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  if (filter) params.append("filter", filter);
  if (user_id) params.append("user_id", user_id);
  if (partner_id) params.append("partner_id", partner_id);

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/tinder-names/matching/public?${params.toString()}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const raw = data.data;
    const items = Array.isArray(raw) ? raw : [raw];
    return { ...data, items };
  } catch (error) {
    return null;
  }
}

export default async function SharedMatchedNamesPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ [key: string]: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const id = resolvedParams.token;
  const [user_id, partner_id] = id.split("-");
  console.log(
    "🚀 ~ SharedMatchedNamesPage ~ resolvedSearchParams:",
    resolvedSearchParams
  );
  console.log("🚀 ~ SharedMatchedNamesPage ~ partner_id:", partner_id);
  // const user_id =
  //   typeof resolvedParams === "string"
  //     ? resolvedParams.split("-")[0]
  //     : undefined;
  // const partner_id =
  //   typeof resolvedParams === "string"
  //     ? resolvedParams.split("-")[1]
  //     : undefined;
  const filterParam =
    typeof resolvedSearchParams.filter === "string"
      ? resolvedSearchParams.filter
      : undefined;
  const initialFilter = filterParam === "love" ? "loved" : "liked";

  const initialData = await fetchInitialData(
    initialFilter,
    user_id,
    partner_id
  );

  return (
    <SharedMatchedNamesClient
      user_id={user_id}
      partner_id={partner_id}
      initialFilter={initialFilter}
      initialData={initialData}
    />
  );
}
