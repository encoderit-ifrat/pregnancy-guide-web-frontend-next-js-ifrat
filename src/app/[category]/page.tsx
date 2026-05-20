import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchArticle from "../sok/_component/SearchArticle";
import { HeroSection2 } from "@/components/home/HeroSection2";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import { OG_DEFAULT_IMAGE, canonicalUrl, transliterateSlug } from "@/lib/seo";

export const dynamic = "force-dynamic";

const CORRECT_CATEGORIES = [
  "graviditet",
  "infor-forlossning",
  "mat-och-kostrad",
  "efter-forlossning",
];

const BROKEN_TO_CORRECT: Record<string, string> = {
  "frlossning": "infor-forlossning",
  "mat-och-kostrd": "mat-och-kostrad",
  "efter-frlossning": "efter-forlossning",
  "inför-förlossning": "infor-forlossning",
  "mat-och-kostråd": "mat-och-kostrad",
  "efter-förlossning": "efter-forlossning",
  "forlossning": "infor-forlossning",
  "förlossning": "infor-forlossning",
};

const CORRECT_TO_BROKEN: Record<string, string> = {
  "infor-forlossning": "frlossning",
  "mat-och-kostrad": "mat-och-kostrd",
  "efter-forlossning": "efter-frlossning",
};

function normalizeSlug(slug: string): string {
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch {}
  const lower = decoded.toLowerCase();

  if (CORRECT_CATEGORIES.includes(lower)) return lower;
  if (BROKEN_TO_CORRECT[lower]) return BROKEN_TO_CORRECT[lower];

  const t = transliterateSlug(lower);
  if (CORRECT_CATEGORIES.includes(t)) return t;
  if (BROKEN_TO_CORRECT[t]) return BROKEN_TO_CORRECT[t];
  return t;
}

function getApiSlug(correctSlug: string): string {
  return CORRECT_TO_BROKEN[correctSlug] || correctSlug;
}

const CATEGORY_METADATA: Record<string, { title: string; description: string }> = {
  "graviditet": {
    title: "Graviditet | Artiklar för dig som väntar barn",
    description: "Läs om graviditet, kroppen, känslorna och vardagen för dig som väntar barn. Trygg och saklig läsning för dig som är gravid och för din partner.",
  },
  "infor-forlossning": {
    title: "Inför förlossning | Förbered er tillsammans",
    description: "Allt ni behöver veta inför förlossningen. Smärtlindring, sammandragningar, hinnsvepning, kejsarsnitt och partnerns roll under förlossningen.",
  },
  "mat-och-kostrad": {
    title: "Mat och kostråd för gravida",
    description: "Vad får man äta som gravid? Läs om listeria, fisk och skaldjur, ost, kosttillskott och vilka livsmedel du bör undvika under graviditeten.",
  },
  "efter-forlossning": {
    title: "Efter förlossning | Återhämtning och bebistiden",
    description: "Allt om tiden efter förlossningen. Återhämtning, amning, sömn med nyfött barn, känslor och vardagen med bebis. Stöd för hela familjen.",
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

  const metadataInfo = CATEGORY_METADATA[normalizedCategory];
  if (!metadataInfo) {
    return { title: "Kategori hittades inte" };
  }

  return {
    title: metadataInfo.title,
    description: metadataInfo.description,
    alternates: {
      canonical: canonicalUrl(`/${normalizedCategory}`),
    },
    openGraph: {
      type: "website",
      title: metadataInfo.title,
      description: metadataInfo.description,
      locale: "sv_SE",
      siteName: "Familj.se",
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataInfo.title,
      description: metadataInfo.description,
      images: [{ url: OG_DEFAULT_IMAGE }],
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_V1}/categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const apiCategories = json?.data ?? [];
      const seen = new Set<string>();
      return apiCategories
        .map((c: any) => normalizeSlug(c.slug))
        .filter((slug: string) => {
          if (seen.has(slug)) return false;
          seen.add(slug);
          return CORRECT_CATEGORIES.includes(slug);
        })
        .map((category: string) => ({ category }));
    }
  } catch {}
  return CORRECT_CATEGORIES.map((category) => ({ category }));
}

async function getCategoryData(
  category: string,
  searchParams: { page?: string; search?: string },
  lang: string = "sv"
) {
  try {
    const apiSlug = getApiSlug(category);
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

  if (!CORRECT_CATEGORIES.includes(category)) {
    notFound();
  }

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

  const categoryData = categories.find(
    (c: any) => normalizeSlug(c.slug) === category
  ) || categories[0] || null;

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
