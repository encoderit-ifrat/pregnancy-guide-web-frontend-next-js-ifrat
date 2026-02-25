"use client";
import React, { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import ArticleCard from "../ui/cards/ArticleCard";
import IconHeading from "../ui/text/IconHeading";
import { SectionHeading } from "../ui/text/SectionHeading";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronRight, Heart } from "lucide-react";
import { Slider } from "../ui/Slider";
import {
  Autoplay,
  FreeMode,
  Grid,
  Navigation,
  Pagination,
} from "swiper/modules";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
  const { t } = useTranslation();
  const pagination = {
    renderBullet: function (index: string | number, className: string) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="bg-primary-light">
      <div className="relative section px-4 sm:pb-7 lg:pb-15 lg:text-start pb-10">
        <div className="w-full text-center pb-6 md:pt-6 mb-7">
          <div>
            <IconHeading
              text={t("pregnancy.articles")}
              image="/images/icons/pregnant.png"
              className="text-primary justify-center"
            />
            <SectionHeading>{t("pregnancy.specialArticles")}</SectionHeading>
          </div>
        </div>
        {Boolean(data?.length) && (
          <>
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
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
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
              className=""
            >
              {data.map(
                (
                  { _id, cover_image, thumbnail_image, title, excerpt, slug },
                  index
                ) => (
                  <SwiperSlide key={_id + index} className="h-auto!">
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
            <div className="justify-center hidden md:flex md:mt-8">
              <Link href="/search-article?page=1&tag=special&week=">
                <Button variant="default" className="px-8">
                  {t("pregnancy.viewAll")} <ChevronRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SpecialArticleSection;
