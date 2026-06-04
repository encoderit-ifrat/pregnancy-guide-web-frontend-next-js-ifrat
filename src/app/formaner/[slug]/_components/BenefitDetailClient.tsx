"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { API_V1 } from "@/consts";
import BenefitContent from "./BenefitContent";

type BenefitData = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  content?: string;
};

export default function BenefitDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const [benefit, setBenefit] = useState<BenefitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const fetchBenefit = async () => {
      try {
        const res = await fetch(`${API_V1}/benefits/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const json = await res.json();
        const data = json.data || json;

        if (!cancelled) {
          if (data && data._id) {
            setBenefit(data);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBenefit();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-svh bg-article-bg">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound || !benefit) {
    return (
      <div className="min-h-svh bg-article-bg">
        <div className="min-h-screen w-full px-4 md:px-0 max-w-[680px] mx-auto py-20 text-center">
          <p className="text-gray-500 text-lg">Förmån hittades inte</p>
          <Link
            href="/formaner"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mt-4"
          >
            Tillbaka till förmåner
          </Link>
        </div>
      </div>
    );
  }

  const safeContent = benefit?.content || "";

  return (
    <div className="bg-article-bg min-h-svh py-6">
      {benefit.image && (
        <div className="w-full px-4 lg:px-0 max-w-[780px] mx-auto mb-6">
          <div className="relative h-[210px] sm:h-[320px] lg:h-[400px] rounded-xl overflow-hidden">
            <Image
              src={imageLinkGenerator(benefit.image) ?? ""}
              alt={benefit.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
      <div className="min-h-screen w-full px-4 md:px-0 max-w-[680px] mx-auto">
        <div className="pb-6 pt-3">
          {/* <Link
            href="/formaner"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6"
          >
            <ChevronLeft className="size-5" />
            Tillbaka till förmåner
          </Link> */}

          <h1 className="text-[40px] leading-[1.25] font-semibold text-[#1A1A1A] mb-8 text-wrap font-heading">
            {benefit.title}
          </h1>

          {safeContent && <BenefitContent content={safeContent} />}
        </div>
      </div>
    </div>
  );
}
