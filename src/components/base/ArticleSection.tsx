"use client";
import React, { useRef } from "react";
import ArticleCard from "../ui/cards/ArticleCard";
// import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

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
  thumbnail_image: string;
  featured: boolean;
};

type TProps = {
  data: Article[];
};

const ArticleSection = ({ data }: TProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative px-4 sm:pb-7 lg:pb-15 lg:text-start max-w-5xl mx-auto pb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <p className="text-foreground font-semibold  text-3xl lg:text-4xl py-7">
          OUR ARTICLES
        </p>
        {/* Scroll Buttons (floating on sides) */}
        <div className="justify-between pointer-events-none gap-4 hidden md:flex">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleScroll("left")}
            className="rounded-full shadow-md bg-background/80 backdrop-blur pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleScroll("right")}
            className="rounded-full shadow-md bg-background/80 backdrop-blur pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Article Cards */}
      <div
        ref={scrollRef}
        className="flex flex-col md:flex-row items-center flex-nowrap gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {data?.map(
          ({ _id, cover_image, thumbnail_image, title, excerpt, slug }) => (
            <ArticleCard
              key={_id}
              image={thumbnail_image}
              title={title}
              description={excerpt}
              slug={slug}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ArticleSection;
