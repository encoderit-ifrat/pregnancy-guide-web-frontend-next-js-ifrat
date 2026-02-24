"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { Button } from "../Button";
import { BASE_URL } from "@/data/global_data";
import Link from "next/link";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { ChevronRight } from "lucide-react";

type ArticleCardProps = {
  image: string;
  title: string;
  description: string;
  slug: string;
  showButton?: boolean;
  onClick?: () => void; // optional click handler for the button
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  title,
  description,
  slug,
  showButton = true,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden group bg-white p-2 md:p-3 rounded-2xl shadow h-full flex flex-col">
      <div className="shrink-0 relative overflow-hidden rounded min-w-full min-h-[138px] sm:min-h-[196px] md:min-w-2/6">
        <Link href={`/articles/${slug}`}>
          <Image
            src={imageLinkGenerator(image)}
            alt={title}
            fill
            className="object-cover rounded bg-primary-gradient transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-4 flex flex-col justify-between gap-2 flex-1">
        <p className="font-semibold font-poppins text-xl! text-primary-dark! whitespace-nowrap truncate">
          <Link href={`/articles/${slug}`}> {title}</Link>
        </p>
        <p className="flex-1">{description}</p>
        <Link
          href={`/articles/${slug}`}
          className="text-primary font-semibold font-poppins text-sm"
        >
          {t("articles.readMore")}
          {/*<Button
            variant="softPurple"
            onClick={onClick}
            className="self-start w-auto px-4 py-2"
          >
            READ MORE
          </Button>*/}
        </Link>
      </div>
      {showButton && (
        <div className="absolute -bottom-11 -right-11 transition-transform duration-300 group-hover:scale-130">
          <Link href={`/articles/${slug || "article-not-found"}`}>
            <button className="size-20 bg-primary text-white transition rounded-full relative cursor-pointer">
              <ChevronRight className="h-5 w-5 text-white absolute top-[16px] left-[10px]" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
