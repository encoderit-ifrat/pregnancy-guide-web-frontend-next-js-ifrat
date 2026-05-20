import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchArticle from "../sok/_component/SearchArticle";
import { HeroSection2 } from "@/components/home/HeroSection2";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";

// Force SSR for dynamic content
export const dynamic = "force-dynamic";

// Normalize slug: handle URL decoding and map Swedish/pretty variants to database slugs
function normalizeSlug(slug: string): string {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch (e) {
    // ignore
  }

  const lower = decoded.toLowerCase();

  const mapping: Record<string, string> = {
    "infor-forlossning": "frlossning",
    "mat-och-kostrad": "mat-och-kostrd",
    "efter-forlossning": "efter-frlossning",
    "inför-förlossning": "frlossning",
    "mat-och-kostråd": "mat-och-kostrd",
    "efter-förlossning": "efter-frlossning",
    "forlossning": "frlossning",
    "förlossning": "frlossning",
  };

  if (mapping[lower]) {
    return mapping[lower];
  }

  // Fallback: strip Swedish characters just like the backend slugification did
  return lower
    .replace(/[åä]/g, "")
    .replace(/[ö]/g, "");
}

// Valid category slugs (database slugs)
const VALID_CATEGORIES = [
  "graviditet",
  "frlossning",
  "mat-och-kostrd",
  "efter-frlossning",
];

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

const CATEGORY_METADATA: Record<string, { title: string; description: string }> = {
  "graviditet": {
    title: "Graviditet | Artiklar för dig som väntar barn | Familj.se",
    description: "Läs om graviditet, kroppen, känslorna och vardagen för dig som väntar barn. Trygg och saklig läsning för dig som är gravid och för din partner.",
  },
  "frlossning": {
    title: "Inför förlossning | Förbered er tillsammans | Familj.se",
    description: "Allt ni behöver veta inför förlossningen. Smärtlindring, sammandragningar, hinnsvepning, kejsarsnitt och partnerns roll under förlossningen.",
  },
  "mat-och-kostrd": {
    title: "Mat och kostråd för gravida | Familj.se",
    description: "Vad får man äta som gravid? Läs om listeria, fisk och skaldjur, ost, kosttillskott och vilka livsmedel du bör undvika under graviditeten.",
  },
  "efter-frlossning": {
    title: "Efter förlossning | Återhämtning och bebistiden | Familj.se",
    description: "Allt om tiden efter förlossningen. Återhämtning, amning, sömn med nyfött barn, känslor och vardagen med bebis. Stöd för hela familjen.",
  },
};

// Generate metadata
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const normalizedCategory = normalizeSlug(category);

  const metadataInfo = CATEGORY_METADATA[normalizedCategory];
  if (!metadataInfo) {
    return {
      title: "Kategori hittades inte | Familj",
    };
  }

  return {
    title: metadataInfo.title,
    description: metadataInfo.description,
    openGraph: {
      type: "website",
      title: metadataInfo.title,
      description: metadataInfo.description,
      locale: "sv_SE",
      siteName: "Familj.se",
    },
    twitter: {
      card: "summary_large_image",
      title: metadataInfo.title,
      description: metadataInfo.description,
    },
  };
}

// Generate static params for known categories
export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

// Fetch category and articles data
async function getCategoryData(
  category: string,
  searchParams: { page?: string; search?: string },
  lang: string = "sv"
) {
  try {
    const params = new URLSearchParams({
      page: searchParams.page || "1",
      lang: lang,
      withCategory: "true",
      category: category,
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

  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  // Get locale from cookies
  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  // Fetch data
  const articlesData = await getCategoryData(
    category,
    resolvedSearchParams,
    locale
  );
  const articles = articlesData?.data?.data ?? [];
  const categories = articlesData?.data?.categories ?? [];
  const pagination = articlesData?.data?.pagination ?? null;

  const categoryData = categories.find(
    (c: any) => c.slug === category
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
