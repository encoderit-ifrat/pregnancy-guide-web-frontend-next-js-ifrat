// app/search/page.tsx
import React from "react";
import SearchArticle from "./_component/SearchArticle";
import { Metadata } from "next";
import HeroSection2 from "@/components/home/HeroSection2";
import { API_V1 } from "@/consts";

// Force SSR for dynamic search queries
export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  page?: string;
  category?: string;
  tag?: string;
  week?: string;
};

import { getI18n } from "@/lib/i18n-server";

// Generate dynamic metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const { t } = await getI18n();
  const query = params.search || "";
  const category = params.category || "";
  const week = params.week || "";
  const page = params.page || "1";

  // Build dynamic title
  let title = t("header.search");
  if (query) {
    title = `${t("header.search")} ${t("pregnancy.searchResultFound")} "${query}"`;
  }
  if (category) {
    title += ` ${t("pregnancy.searchResultIn")} ${category}`;
  }
  if (week) {
    title += ` ${t("pregnancy.weekSelector")} ${week}`;
  }
  if (page !== "1") {
    title += ` - ${t("common.page")} ${page}`;
  }

  // Build dynamic description
  let description = t("hero2.subtitle");
  if (query) {
    description = `${t("pregnancy.searchResultFound")} "${query}".`;
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    // Prevent search pages from being indexed (optional)
    robots: {
      index: false,
      follow: true,
    },
  };
}

async function getArticles(searchParams: SearchParams, locale: string = "sv") {
  try {
    const query = searchParams.search || "";
    const page = searchParams.page || "1";
    const category = searchParams.category || "";
    const tag = searchParams.tag || "";
    const week = searchParams.week || "";

    const params = new URLSearchParams({
      search: query,
      page: page,
      lang: locale, // Include locale in query params
      ...(category && { category }),
      ...(tag && { tag }),
      ...(week && { week }),
    });
 
    const res = await fetch(
     
      `${API_V1}/articles?${params}`,
      {
        cache: "no-store", // Always fetch fresh data
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale, // Also include in header just in case
        },
      }
    );
    console.log("🚀 ~ getArticles ~ res :", res )

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    console.log("🚀 ~ getArticles ~ data:", data)
    return data;
  } catch (error) {
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams before using it
  const params = await searchParams;

  // Get locale from cookie
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const articlesData = await getArticles(params, locale);
  console.log("params",params);
  return (
    <div className="min-h-svh mb-6 md:pb-10">
      <main>
        <HeroSection2 />

        <SearchArticle
          initialQuery={params.search || ""}
          initialData={articlesData?.data?.data || []}
          meta={articlesData?.data?.pagination || null}
        />
      </main>
    </div>
  );
}
