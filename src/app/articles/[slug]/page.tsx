// app/articles/[slug]/page.tsx
import React from "react";
import ArticleWithTOC from "./_component/ArticleWithTOC";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utlis/authOptions";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

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
    <div className="bg-background min-h-svh pb-32  md:pb-96">
      <div className="min-h-screen w-full max-w-6xl mx-auto  pt-24 py-8 px-4">
        <div className="bg-soft-white rounded-lg p-7">
          <h1 className="text-4xl md:text-5xl  font-bold text-[#300043] mb-6 text-wrap">
            {article?.title}
          </h1>
          <ArticleWithTOC article={article} />
        </div>
      </div>
    </div>
  );
}
