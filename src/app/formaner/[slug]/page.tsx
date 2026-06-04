import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import BenefitDetailClient from "./_components/BenefitDetailClient";

export const dynamic = "force-dynamic";

async function getBenefit(slug: string, lang: string = "sv") {
  try {
    const res = await fetch(`${API_V1}/benefits/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang,
        "x-lang": lang,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const benefit = await getBenefit(slug, locale);

  if (!benefit) {
    return { title: "Förmån hittades inte | Familj" };
  }

  return {
    title: `${benefit.title} | Familj`,
    description: benefit.title,
    openGraph: {
      title: benefit.title,
      images: benefit.image
        ? [`${process.env.NEXT_PUBLIC_API_URL}${benefit.image}`]
        : [],
    },
  };
}

export default function BenefitDetailPage() {
  return <BenefitDetailClient />;
}
