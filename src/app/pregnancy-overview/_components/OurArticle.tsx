import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type Category = {
  _id: string;
  slug: string;
  name: string;
};

export type Tag = {
  _id: string;
  name: string;
  slug: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: Category[];
  tags: Tag[];
  status: "published" | "draft" | "archived";
  cover_image: string;
  featured: boolean;
};

type TProps = {
  data: Article[];
};

function OurArticle({ data }: TProps) {
  const firstArticle = data?.[0];
  const otherArticles = data?.slice(1);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full mx-auto bg-white px-4 py-12 lg:py-20">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 gap-10 md:grid-cols-2">
      {Boolean(firstArticle?.slug) && (
        <div className="h-[300px] sm:h-[400px] lg:h-[400px]">
          <Link href={`/articles/${firstArticle?.slug || "article-not-found"}`}>
            <Image
              src={imageLinkGenerator(firstArticle?.cover_image)}
              alt={firstArticle?.title || "Banner Image"}
              height={600}
              width={600}
              className="object-cover"
              priority
            />
          </Link>
          <Image
            src="/assets/logo/sipLayer.svg"
            alt="Overlay"
            fill
            className="object-cover mix-blend-hard-light pointer-events-none"
          />
          <div className="absolute bottom-11 lg:bottom-18 left-1/2 -translate-x-1/2 w-[90%] text-center px-2  sm:left-6 sm:translate-x-0 sm:text-left sm:w-auto lg:left-20 ">
            <p className="text-2xl lg:leading-10 leading-6 text-soft-white uppercase text-start">
              {firstArticle?.title}
            </p>
          </div>
        </div>
      )}
        {(otherArticles || []).map((article) => (
        <div className="">
          <Link href={`/articles/${article?.slug || "article-not-found"}`}>
            <Image
              src={imageLinkGenerator(article?.cover_image)}
              alt={article?.title || "Banner Image"}
              fill
              className="object-cover"
              priority
            />
          </Link>
        </div>
        ))}
      </div>
    </section>
  );
}

export default OurArticle;
