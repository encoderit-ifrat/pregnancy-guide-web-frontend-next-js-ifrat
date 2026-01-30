"use client";
import React, { useRef } from "react";
import ArticleCard from "../ui/cards/ArticleCard";
import IconHeading from "../ui/text/IconHeading";
import { SectionHeading } from "../ui/text/SectionHeading";
import { SwiperSlide } from "swiper/react";
import { Heart } from "lucide-react";
import { Slider } from "../ui/Slider";

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

const SpecialArticleSection = ({ data }: TProps) => {
  const pagination = {
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="bg-primary-light">
      <div className="relative max-w-7xl mx-auto px-4 sm:pb-7 lg:pb-15 lg:text-start pb-10">
        {Boolean(data?.length) && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <IconHeading
                  text="Atricles"
                  icon={<Heart />}
                  className="text-primary"
                />
                <SectionHeading>Special Articles</SectionHeading>
              </div>
            </div>
            <div
              className="flex flex-col md:flex-row items-center flex-nowrap gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              <Slider
                options={{
                  spaceBetween: 10,
                  slidesPerView: 1,
                  navigation: true,
                  pagination: {
                    ...pagination,
                    enabled: true,
                  },
                  grid: {
                    rows: 1,
                    fill: "row",
                  },
                  breakpoints: {
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                      grid: {
                        rows: 1,
                        fill: "row",
                      },
                    },
                    321: {
                      slidesPerView: 1.2,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 2.5,
                      spaceBetween: 20,
                      grid: {
                        rows: 1,
                        fill: "row",
                      },
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                      grid: {
                        rows: 2,
                        fill: "row",
                      },
                      pagination: {
                        enabled: false,
                      },
                    },
                  },
                }}
                sideOverlayClassName="bg-transparent"
                  className="overflow-visible sm:pl-7 pt-4! pb-14! h-full"
              >
                {data.map(
                  (
                    { _id, cover_image, thumbnail_image, title, excerpt, slug },
                    index
                  ) => (
                    <SwiperSlide key={_id + index} className="h-auto flex">
                      <ArticleCard
                        image={thumbnail_image || cover_image}
                        title={title}
                        description={excerpt}
                        slug={slug}
                        showButton={false}
                      />
                    </SwiperSlide>
                  )
                )}
              </Slider>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SpecialArticleSection;
