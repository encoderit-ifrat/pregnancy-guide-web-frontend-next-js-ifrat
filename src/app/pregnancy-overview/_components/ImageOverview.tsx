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

function ImageOverview({ data }: TProps) {
  return (
    <section className="relative w-full mx-auto bg-chart-5 px-4 py-12 lg:py-20">
      {Boolean(data?.[0]?.slug) && (
        <div className="relative max-w-5xl w-full mx-auto h-[300px] sm:h-[400px] lg:h-[600px]">
          <Link href={`/articles/${data?.[0]?.slug || "article-not-found"}`}>
            <Image
              src={imageLinkGenerator(data?.[0]?.cover_image)}
              alt={data?.[0]?.title || "Banner Image"}
              fill
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
              {data?.[0]?.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ImageOverview;
