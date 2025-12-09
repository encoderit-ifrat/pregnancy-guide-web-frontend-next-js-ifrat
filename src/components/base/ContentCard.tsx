// components/base/ContentCard.tsx (Updated)
import Image from "next/image";
import React from "react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

type Article = {
  _id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  slug: string;
};

function ContentCard({ article }: { article?: Article }) {
  // Fallback for demo purposes
  const defaultArticle = {
    _id: "1",
    title: "PRAESENT FAUCIBUS, ELIT A EUISMOD RHONCUS, MEGNA NISI FINIBBUS EST",
    excerpt:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae...",
    cover_image: "/assets/logo/babyBump3.svg",
    slug: "sample-article",
  };

  const data = article || defaultArticle;

  return (
    <div className="bg-white w-full max-w-[1200px] p-6 mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col lg:flex-row items-center justify-between gap-6 border border-gray-100">
      <div className="relative w-full lg:w-1/2 h-[300px] md:h-[350px] rounded-xl overflow-hidden">
        
        <Link href={`/articles/${data.slug}`}><Image
          src={imageLinkGenerator(data.cover_image)}
          alt={data.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        </Link>
      </div>

      <div className="w-full lg:w-1/2 space-y-4 text-[#300043] px-4 lg:px-10">
        <p className="text-2xl md:text-3xl font-semibold leading-snug">
         <Link href={`/articles/${data.slug}`}>{data.title}</Link>
        </p>
        <p className="text-sm text-[#555555] leading-relaxed">{data.excerpt}</p>
        <div className="pt-2">
          <Link href={`/articles/${data.slug}`}>
            <Button
              variant="softPurple"
              size="default"
              className="px-6 py-2 rounded-full"
            >
              Read More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
