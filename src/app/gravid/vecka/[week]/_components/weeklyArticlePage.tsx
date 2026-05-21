import React from "react";
import ArticleWithTOC from "@/app/_articles/[slug]/_component/ArticleWithTOC";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/utlis/authOptions";
import { notFound, redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { API_V1 } from "@/consts";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function getArticle(slug: string, token: string, lang: string = "sv") {
  try {
    const res = await fetch(`${API_V1}/articles/${slug}?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": lang,
        "x-lang": lang,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

type WeeklyArticlePageProps = {
  week: number;
  track: "barn" | "mamma" | "partner";
  slug: string;
};

export async function generateWeeklyArticleMetadata({
  week,
  track,
  slug,
}: WeeklyArticlePageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      title: "Login Required",
    };
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const article = await getArticle(slug, session.token, locale);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const ogImage = article.cover_image
    ? `${process.env.NEXT_PUBLIC_API_URL}${article.cover_image}`
    : OG_DEFAULT_IMAGE;

  return {
    title: `${article.title}`,
    description: article.excerpt || article.title,
    alternates: {
      canonical: canonicalUrl(`/gravid/vecka/${week}/${track}/${slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [{ url: ogImage }],
    },
  };
}

export async function WeeklyArticlePage({
  week,
  track,
  slug,
}: WeeklyArticlePageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.token) {
    redirect("/logga-in");
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const article = await getArticle(slug, session.token, locale);

  if (!article) {
    notFound();
  }

  return (
    <div className="relative bg-article-bg min-h-screen">
      <PageContainer
        className="z-20"
        waaveClassName="text-article-bg"
        childClassName="bg-article-bg"
      >
        <div className="w-full px-4 md:px-0 ">
          <ArticleWithTOC article={article} />
        </div>
      </PageContainer>
      <div className="absolute inset-0 z-10 bg-[url('/images/heart-bg.png')] bg-repeat-x bg-repeat-y opacity-5" />
    </div>
  );
}
