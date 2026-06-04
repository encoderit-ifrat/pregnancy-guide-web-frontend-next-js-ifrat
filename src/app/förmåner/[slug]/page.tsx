import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { API_V1 } from "@/consts";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BenefitContent from "./_components/BenefitContent";

export const dynamic = "force-dynamic";

async function getBenefit(slug: string, lang: string = "sv") {
  try {
    const res = await fetch(`${API_V1}/benefits/public/${slug}`, {
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

export default async function BenefitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get("familj-locale")?.value || "sv";

  const benefit = await getBenefit(slug, locale);

  if (!benefit) {
    notFound();
  }

  const safeContent = benefit?.content || "";

  return (
    <div className="bg-article-bg min-h-svh pt-20">
      <div className="min-h-screen w-full px-4 md:px-0 max-w-[680px] mx-auto">
        <div className="py-6">
          <Link
            href="/f%C3%B6rm%C3%A5ner"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6"
          >
            <ChevronLeft className="size-5" />
            Tillbaka till förmåner
          </Link>

          {benefit.image && (
            <div className="relative w-full h-[210px] sm:h-[320px] lg:h-[400px] mb-6 rounded-xl overflow-hidden">
              <Image
                src={imageLinkGenerator(benefit.image) ?? ""}
                alt={benefit.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-[40px] leading-[1.25] font-semibold text-[#1A1A1A] mb-8 text-wrap font-heading">
            {benefit.title}
          </h1>

          {safeContent && <BenefitContent content={safeContent} />}
        </div>
      </div>
    </div>
  );
}
