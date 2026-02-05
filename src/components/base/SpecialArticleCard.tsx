import Image from "next/image";
import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/data/global_data";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

type SpecialArticleCardProps = {
  image: string;
  title: string;
  description: string;
  slug?: string;
  onClick?: () => void;
};

const SpecialArticleCard: React.FC<SpecialArticleCardProps> = ({
  image,
  title,
  description,
  slug,
  onClick,
}) => {
  return (
    //
    <div className="bg-light-purple  flex  flex-col lg:items-center gap-2 w-full min-w-xs flex-1 shrink-0">
      {/* Image at the top */}
      <Link href={`/articles/${slug}`} className=" w-full">
        <div className="shrink-0 relative w-full h-64">
          <Image
            // src={BASE_URL + image}
            src={imageLinkGenerator(image)}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-col  sm:items-start  sm:text-left p-4 space-y-4 flex-1">
        <Link href={`/articles/${slug}`}>
          <p className="text-xl lg:text-2xl leading-6 lg:leading-10 text-foreground line-clamp-1">
            {title}
          </p>
        </Link>
        <div className="min-h-24">
          <p className="text-base leading-6 text-text-mid line-clamp-3">
            {description}
          </p>
        </div>
        <Link
          href={`/articles/${slug}`}
          className="inline-flex text-lg leading-20px   text-text-accent-purple gap-1"
        >
          More Details
        </Link>
      </div>
    </div>
  );
};

export default SpecialArticleCard;
