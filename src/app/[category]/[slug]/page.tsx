import React from "react";
import ArticleWithTOC from "../../_articles/[slug]/_component/ArticleWithTOC";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/utlis/authOptions";
import { notFound, redirect } from "next/navigation";
import { HeroSection2 } from "@/components/home/HeroSection2";
import { PageContainer } from "@/components/layout/PageContainer";
import { API_V1 } from "@/consts";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

// Force SSR for authenticated content
export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ category: string; slug: string }>;
};

// Fetch article data with authentication
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

// Generate metadata
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
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

  const md = article.metaDetails;
  const title = md?.metaTitle || article.title;
  const description = md?.metaDescription || article.excerpt || article.title;
  const ogTitle = md?.ogTitle || title;
  const ogDescription = md?.ogDescription || description;
  const rawOgImage = md?.ogImage || article.cover_image;
  const ogImage = rawOgImage
    ? rawOgImage.startsWith("http")
      ? rawOgImage
      : `${process.env.NEXT_PUBLIC_API_URL}${rawOgImage}`
    : OG_DEFAULT_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(`/${category}/${slug}`),
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

// Server Component - SSR
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
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
        <div className="w-full md:px-0 ">
          <ArticleWithTOC article={article} />
        </div>
      </PageContainer>
      <div className="absolute inset-0 z-10 bg-[url('/images/heart-bg.png')] bg-repeat-x bg-repeat-y opacity-5" />
    </div>
  );
}
