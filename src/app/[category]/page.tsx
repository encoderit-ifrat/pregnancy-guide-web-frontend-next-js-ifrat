import React from "react";
import { Metadata } from "next";

import SearchArticle from "../sok/_component/SearchArticle";
import { HeroSection2 } from "@/components/home/HeroSection2";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import { OG_DEFAULT_IMAGE, canonicalUrl, transliterateSlug } from "@/lib/seo";

export const dynamic = "force-dynamic";

function normalizeSlug(slug: string): string {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {}
  return transliterateSlug(decoded);
}

const CATEGORY_METADATA: Record<
  string,
  { title: string; description: string }
> = {
  graviditet: {
    title: "Graviditet | Artiklar för dig som väntar barn",
    description:
      "Läs om graviditet, kroppen, känslorna och vardagen för dig som väntar barn. Trygg och saklig läsning för dig som är gravid och för din partner.",
  },
  "infor-forlossning": {
    title: "Inför förlossning | Förbered er tillsammans",
    description:
      "Allt ni behöver veta inför förlossningen. Smärtlindring, sammandragningar, hinnsvepning, kejsarsnitt och partnerns roll under förlossningen.",
  },
  "mat-och-kostrad": {
    title: "Mat och kostråd för gravida",
    description:
      "Vad får man äta som gravid? Läs om listeria, fisk och skaldjur, ost, kosttillskott och vilka livsmedel du bör undvika under graviditeten.",
  },
  "efter-forlossning": {
    title: "Efter förlossning | Återhämtning och bebistiden",
    description:
      "Allt om tiden efter förlossningen. Återhämtning, amning, sömn med nyfött barn, känslor och vardagen med bebis. Stöd för hela familjen.",
  },
};

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const normalizedCategory = normalizeSlug(category);

  const staticMeta = CATEGORY_METADATA[normalizedCategory];

  try {
    const apiSlug = normalizedCategory;
    const catParams = new URLSearchParams({
      page: "1",
      lang: "sv",
      withCategory: "true",
      category: apiSlug,
      limit: "1",
    });
    const res = await fetch(`${API_V1}/articles?${catParams}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const apiCategories = json?.data?.categories ?? [];
      const matchedCategory = apiCategories.find(
        (c: any) => normalizeSlug(c.slug) === normalizedCategory
      );
      if (matchedCategory) {
        const md = matchedCategory.metaDetails;
        const title =
          md?.metaTitle ||
          matchedCategory.title ||
          matchedCategory.name ||
          staticMeta?.title ||
          normalizedCategory;
        const description =
          md?.metaDescription ||
          matchedCategory.description ||
          staticMeta?.description ||
          `Artiklar om ${normalizedCategory}`;
        const ogTitle = md?.ogTitle || title;
        const ogDescription = md?.ogDescription || description;
        const rawOgImage = md?.ogImage || matchedCategory.image;
        const ogImage = rawOgImage
          ? rawOgImage.startsWith("http")
            ? rawOgImage
            : `${process.env.NEXT_PUBLIC_API_URL}${rawOgImage}`
          : OG_DEFAULT_IMAGE;

        return {
          title,
          description,
          alternates: {
            canonical: canonicalUrl(`/${normalizedCategory}`),
          },
          openGraph: {
            type: "website",
            title: ogTitle,
            description: ogDescription,
            locale: "sv_SE",
            siteName: "Familj.se",
            images: [{ url: ogImage }],
          },
          twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [{ url: ogImage }],
          },
        };
      }
    }
  } catch {}

  const fallbackTitle = staticMeta?.title || `${normalizedCategory} | Familj.se`;
  const fallbackDesc = staticMeta?.description || `Artiklar om ${normalizedCategory}`;

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    alternates: {
      canonical: canonicalUrl(`/${normalizedCategory}`),
    },
    openGraph: {
      type: "website",
      title: fallbackTitle,
      description: fallbackDesc,
      locale: "sv_SE",
      siteName: "Familj.se",
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDesc,
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
  };
}

export async function generateStaticParams() {
  try {
    const catParams = new URLSearchParams({
      page: "1",
      lang: "sv",
      withCategory: "true",
      limit: "1",
    });
    const res = await fetch(`${API_V1}/articles?${catParams}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const apiCategories = json?.data?.categories ?? [];
      const seen = new Set<string>();
      return apiCategories
        .map((c: any) => normalizeSlug(c.slug))
        .filter((slug: string) => {
          if (seen.has(slug)) return false;
          seen.add(slug);
          return true;
        })
        .map((category: string) => ({ category }));
    }
  } catch {}
  return [];
}

async function getCategoryData(
  category: string,
  searchParams: { page?: string; search?: string },
  lang: string = "sv"
) {
  try {
    const apiSlug = category;
    const params = new URLSearchParams({
      page: searchParams.page || "1",
      lang: lang,
      withCategory: "true",
      category: apiSlug,
      ...(searchParams.search && { search: searchParams.search }),
    });
    const res = await fetch(`${API_V1}/articles?${params}`, {
      cache: "no-store",
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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const category = normalizeSlug(rawCategory);
  const resolvedSearchParams = await searchParams;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const articlesData = await getCategoryData(
    category,
    resolvedSearchParams,
    locale
  );

  const articles = articlesData?.data?.data ?? [];
  const categories = articlesData?.data?.categories ?? [];
  const pagination = articlesData?.data?.pagination ?? null;

  const categoryData =
    categories.find((c: any) => normalizeSlug(c.slug) === category) ||
    categories[0] ||
    null;

  return (
    <div className="min-h-svh mb-6 md:pb-10">
      <main>
        {categoryData && (
          <HeroSection2
            name={categoryData.name}
            title={categoryData?.title}
            description={categoryData?.description}
            image={categoryData?.image}
          />
        )}

        <SearchArticle
          initialQuery={resolvedSearchParams.search || ""}
          initialData={articles}
          categoryName={categoryData?.name || category}
          meta={pagination}
        />
      </main>
    </div>
  );
}
