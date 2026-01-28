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
    <div className="bg-white p-2 rounded shadow">
      <div className="shrink-0 relative min-w-full min-h-64 md:min-h-36 md:min-w-2/6">
        <Link href={`/articles/${slug}`}>
          <Image
            src={imageLinkGenerator(image)}
            alt={title}
            fill
            className="object-cover"
          />
        </Link>
      </div>
      <div className="shrink-0 flex-1 flex flex-col justify-between gap-2 ">
        <p className="font-roboto text-xl lg:text-2xl text-foreground whitespace-nowrap truncate max-w-48">
          <Link href={`/articles/${slug}`}> {title}</Link>
        </p>
        <p className="text-sm leading-6 text-text-mid line-clamp-2">
          {description}
        </p>
        <Link href={`/articles/${slug}`}>
          <Button
            variant="softPurple"
            onClick={onClick}
            className="self-start w-auto px-4 py-2"
          >
            READ MORE
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
