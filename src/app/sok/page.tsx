// app/search/page.tsx
// import React from "react";
import SearchArticle from "./_component/SearchArticle";
import Image from "next/image";
import { Metadata } from "next";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { HeroSection } from "@/components/home/HeroSection";
import { HeroSection2 } from "@/components/home/HeroSection2";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import { tr } from "date-fns/locale";
import { redirect } from "next/navigation";
import { OG_DEFAULT_IMAGE, canonicalUrl, transliterateSlug } from "@/lib/seo";
// import { useRouter } from "next/navigation";

// Force SSR for dynamic search queries
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
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
  const query = params.q || params.search || "";
  const page = params.page || "1";

  // Build dynamic title
  let title = "Sök på Familj.se";
  if (query) {
    title = `Sökresultat för "${query}"`;
  }
  if (page !== "1") {
    title += ` - Sida ${page}`;
  }

  // Build dynamic description
  let description = "Sök bland artiklar, kategorier och innehåll på Familj.se.";
  if (query) {
    description = `Visa sökresultat för "${query}". Hitta artiklar och information om graviditeten på Familj.se.`;
  }

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl("/sok"),
    },
    openGraph: {
      title: title,
      description: description,
      type: "website",
      locale: "sv_SE",
      siteName: "Familj.se",
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

async function getArticles(searchParams: SearchParams, lang: string = "sv") {
  try {
    const query = searchParams.q || searchParams.search || "";
    const page = searchParams.page || "1";
    const category = searchParams.category || "";
    const tag = searchParams.tag || "";
    const week = searchParams.week || "";

    const params = new URLSearchParams({
      search: query,
      page: page,
      lang: lang,
      withCategory: category ? "true" : "false",
      ...(category && { category }),
      ...(tag && { tag }),
      ...(week && { week }),
    });

    const res = await fetch(`${API_V1}/articles?${params}`, {
      cache: "no-store", // Always fetch fresh data
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang,
        "x-lang": lang,
      },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return { data: { data: [], categories: [], pagination: null } };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams before using it
  const params = await searchParams;
  // const router = useRouter();
  // Get locale from cookies
  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const articlesData = await getArticles(params, locale);
  const articles = articlesData?.data?.data ?? [];
  const categories = articlesData?.data?.categories ?? [];
  const pagination = articlesData?.data?.pagination ?? null;

  if (articles.length === 1 && articles[0]?.slug) {
    const article = articles[0];
    const catSlug = transliterateSlug(article.category?.slug || "graviditet");
    redirect(`/${catSlug}/${article.slug}`);
  }

  const category = categories[0] || null;

  return (
    <div className="min-h-svh mb-6 md:pb-10">
      <main>
        {category && (
          <HeroSection2
            name={category.name}
            title={category?.title}
            description={category?.description}
            image={category?.image}
          />
        )}

        <SearchArticle
          initialQuery={params.search || ""}
          initialData={articles}
          categoryName={category?.name || ""}
          meta={pagination}
        />
      </main>
    </div>
  );
}
