"use client";

import { API_BASE_URL } from "@/consts";
import { MoveRight } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useState } from "react";

const poppins = Poppins({
  weight: ["900"],
  subsets: ["latin"],
  display: "swap",
});

type TrackCardProps = {
  title: string;
  description: string;
  photoUrl: string;
  slug: string;
};

const TrackCard: React.FC<TrackCardProps> = ({
  title,
  slug,
  description,
  photoUrl,
}) => {
  const { t } = useTranslation();
  // Set fallback image state
  const [imgSrc, setImgSrc] = useState(
    // photoUrl ? API_BASE_URL + photoUrl : "/assets/logo/article1.svg"
    photoUrl ? API_BASE_URL + photoUrl : ""
  );

  return (
    <div className="bg-soft-white rounded-lg p-2 flex flex-col md:flex-row gap-4 items-center md:items-center">
      {/* Photo */}
      <div className="shrink-0">
        <Link
          // href={`/articles/${slug}`}
          href={`/home/articles/${slug}`}
        >
          <Image
            src={imgSrc}
            alt={title}
            width={152}
            height={152}
            unoptimized
            className="rounded object-cover w-[152px] h-[152px]"
            onError={() => setImgSrc("/placeholder.png")} // ✅ fallback
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-2 lg:items-start items-center">
        <p
          className={`${poppins.className} text-xl lg:text-2xl leading-6 text-secondary line-clamp-1`}
        >
          {/* <Link href={`/articles/${slug}`}> {title}</Link> */}
          <Link href={`/home/articles/${slug}`}> {title}</Link>
        </p>
        <p className="text-text-gray text-sm leading-5 line-clamp-3">
          {description}
        </p>
        <Link
          href={`/home/articles/${slug}`}
          className="text-text-accent-purple flex items-center uppercase text-base leading-4"
        >
          {t("articles.readMore")} <MoveRight />
        </Link>
      </div>
    </div>
  );
};

export default TrackCard;
