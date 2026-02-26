// app/articles/[slug]/page.tsx
import React from "react";
// import ArticleWithTOC from "./_component/ArticleWithTOC";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ArticleWithTOC from "@/app/articles/[slug]/_component/ArticleWithTOC";
import { API_V1 } from "@/consts";

// Force SSR for authenticated content
export const dynamic = "force-dynamic";

// Fetch article data with authentication
async function getArticle(slug: string, lang: string = "en") {
  try {
    const res = await fetch(
      `${API_V1}/articles/public/${slug}?lang=${lang}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": lang,
          "x-lang": lang,
        },
        cache: "no-store",
      }
    );


    if (!res.ok) {
      return null; // Return null instead of throwing
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

// Generate metadata (still works with SSR)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "en";

  const article = await getArticle(slug, locale);

  if (!article) {
    return {
      title: "Article Not Found | Familij",
    };
  }

  return {
    title: `${article.title} | Familij`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image
        ? [`${process.env.NEXT_PUBLIC_API_URL}${article.cover_image}`]
        : [],
    },
  };
}

// Server Component - SSR (rendered on each request)
export default async function PublicArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "en";

  const article = await getArticle(slug, locale);
  console.log("👉 ~ ArticlePage ~ article:", article);

  if (!Boolean(article)) {
    notFound();
  }

  return (
    <div className="bg-background min-h-svh pb-32  md:pb-96">
      <div className="min-h-screen w-full max-w-6xl mx-auto  pt-24 py-8 px-4">
        <div className="bg-soft-white rounded-lg p-7">
          <h1 className="text-4xl md:text-5xl  font-bold text-foreground mb-6 text-wrap">
            {article?.title}
          </h1>
          <ArticleWithTOC article={article} />
        </div>
      </div>
    </div>
  );
}
