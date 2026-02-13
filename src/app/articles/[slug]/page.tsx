// app/articles/[slug]/page.tsx
import React from "react";
import ArticleWithTOC from "./_component/ArticleWithTOC";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utlis/authOptions";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { HeroSection2 } from "@/components/home/HeroSection2";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { CircleQuestionMark } from "lucide-react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import WeeklyQuestionView from "@/app/weekly-question/[id]/_components/WeeklyQuestionView";
import { API_V1 } from "@/consts";

// Force SSR for authenticated content
export const dynamic = "force-dynamic";

type Article = {
  id: string;
  title: string;
  content: string;
  cover_image?: string;
  excerpt?: string;
  slug: string;
};

// Fetch article data with authentication
async function getArticle(slug: string, token: string) {
  try {
    const res = await fetch(
      `${API_V1}/articles/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      title: "Login Required | Familij",
    };
  }

  const article = await getArticle(slug, session.token);

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
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session || !session.token) {
    redirect("/login");
  }

  const article = await getArticle(slug, session.token);

  if (!article) {
    notFound();
  }

  return (
    <div className="relative">
      <PageContainer className="z-20">
        <div className="max-w-5xl mx-auto px-4 bg-soft-white shadow-2xl rounded-lg p-6">
          <ArticleWithTOC article={article} />
        </div>
      </PageContainer>
      <div className="absolute inset-0 z-10 bg-[url('/images/heart-bg.png')] bg-repeat-x bg-repeat-y opacity-10" />
    </div>
  );
}
