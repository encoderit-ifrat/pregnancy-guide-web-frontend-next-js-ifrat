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
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`,
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
    <div className="relative min-h-svh">
      <section className="absolute bg-[#F6F0FF] top-0 left-0 w-full h-[60vh] z-10">
        <div className="h-[60vh]"></div>
        <WaveDivider
          className="text-white transform translate-y-[1px]"
          bgClassName="bg-[#F6F0FF]"
        />
      </section>
      <div className="relative z-20 px-4 pt-6 md:pt-24 pb-10 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 bg-soft-white shadow-2xl rounded-lg p-6">
          <ArticleWithTOC article={article} />
        </div>
      </div>
    </div>
  );
}
