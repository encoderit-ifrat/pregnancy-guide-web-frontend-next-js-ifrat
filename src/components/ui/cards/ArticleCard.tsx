import Image from "next/image";
import React from "react";
import { Button } from "../Button";
import { BASE_URL } from "@/data/global_data";
import Link from "next/link";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

type ArticleCardProps = {
  image: string;
  title: string;
  description: string;
  slug: string;
  onClick?: () => void; // optional click handler for the button
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  title,
  description,
  slug,
  onClick,
}) => {
  return (
    <div className="bg-white p-2 md:p-3 rounded shadow">
      <div className="shrink-0 relative min-w-full min-h-50 md:min-h-64 md:min-w-2/6">
        <Link href={`/articles/${slug}`}>
          <Image
            src={imageLinkGenerator(image)}
            alt={title}
            fill
            className="object-cover rounded"
          />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between gap-2 ">
        <p className="font-semibold text-primary-dark font-roboto text-xl lg:text-2xl whitespace-nowrap truncate">
          <Link href={`/articles/${slug}`}> {title}</Link>
        </p>
        <p className="text-sm leading-6 text-text-mid line-clamp-3">
          {description}
        </p>
        <Link href={`/articles/${slug}`} className="text-primary text-sm">
            Read more
          {/*<Button
            variant="softPurple"
            onClick={onClick}
            className="self-start w-auto px-4 py-2"
          >
            READ MORE
          </Button>*/}
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
