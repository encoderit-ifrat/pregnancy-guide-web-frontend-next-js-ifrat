// app/search/page.tsx
import React from "react";
import SearchArticle from "./_component/SearchArticle";
import Image from "next/image";
import { Metadata } from "next";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroSection2 } from "@/components/home/HeroSection2";
import {API_V1} from "@/consts";

// Force SSR for dynamic search queries
export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  page?: string;
  category?: string;
  tag?: string;
  week?: string;
};

// Generate dynamic metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.search || "";
  const category = params.category || "";
  const tag = params.tag || "";
  const week = params.week || "";
  const page = params.page || "1";

  // Build dynamic title
  let title = "Search Articles";
  if (query) {
    title = `Search results for "${query}"`;
  }
  if (category) {
    title += ` in ${category}`;
  }
  if (week) {
    title += ` week ${week}`;
  }
  if (page !== "1") {
    title += ` - Page ${page}`;
  }

  // Build dynamic description
  let description =
    "Search through our collection of articles and find what you're looking for.";
  if (query) {
    description = `Find articles related to "${query}". Browse through our curated content.`;
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

async function getArticles(searchParams: SearchParams) {
  try {
    const query = searchParams.search || "";
    const page = searchParams.page || "1";
    const category = searchParams.category || "";
    const tag = searchParams.tag || "";
    const week = searchParams.week || "";

    const params = new URLSearchParams({
      search: query,
      page: page,
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
        },
      }
    );

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
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
  const articlesData = await getArticles(params);

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
