"use client";
import React from "react";
import ArticleCard from "../ui/cards/ArticleCard";
import { Heart } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { SwiperSlide } from "swiper/react";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";

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

import { useTranslation } from "@/providers/I18nProvider";

const ArticleSection = ({ data }: TProps) => {
  const { t } = useTranslation();
  const pagination = {
    renderBullet: function (index: string | number, className: string) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    // <div
    //   className={cn(
    //     "relative overflow-hidden pl-4 pb-10 pt-4 sm:pb-15 lg:pb-18 lg:text-start"
    //   )}
    // >
    //   {/* Section Header */}
    //   <div className="section flex items-center justify-between">
    //     <div>
    //       <IconHeading
    //         text={t("pregnancy.articles")}
    //         icon={<Heart />}
    //         className="text-primary"
    //       />
    //       <SectionHeading>{t("pregnancy.ourArticles")}</SectionHeading>
    //     </div>
    //   </div>

    //   <div>
    //     {/* Scrollable Article Cards */}
    //     <Slider
    //       options={{
    //         spaceBetween: 10,
    //         slidesPerView: 1,
    //         pagination: pagination,
    //         navigation: true,
    //         // autoplay: {
    //         //   delay: 2500,
    //         //   disableOnInteraction: false,
    //         // },
    //         breakpoints: {
    //           320: {
    //             slidesPerView: 1,
    //             spaceBetween: 10,
    //           },
    //           321: {
    //             slidesPerView: 1.2,
    //             spaceBetween: 10,
    //           },
    //           768: {
    //             slidesPerView: 2.5,
    //             spaceBetween: 20,
    //           },
    //           1024: {
    //             slidesPerView: 3,
    //             spaceBetween: 20,
    //           },
    //           1366: {
    //             slidesPerView: 3.5,
    //             spaceBetween: 20,
    //           },
    //         },
    //         // loop: true,
    //       }}
    //       sideOverlayClassName="bg-transparent"
    //       className="overflow-visible topNavigation sm:pl-7 pt-4! pb-14! h-full"
    //     >
    //       {data.map(
    //         (
    //           { _id, cover_image, thumbnail_image, title, excerpt, slug },
    //           index
    //         ) => (
    //           <SwiperSlide key={_id + index} className="h-auto! flex">
    //             <ArticleCard
    //               image={thumbnail_image || cover_image}
    //               title={title}
    //               description={excerpt}
    //               slug={slug}
    //             />
    //           </SwiperSlide>
    //         )
    //       )}
    //     </Slider>
    //   </div>
    // </div>
    <div
      className={cn(
        "relative overflow-hidden pl-4 pb-10 pt-4 sm:pb-15 lg:pb-18 lg:text-start"
      )}
    >
      {/* Section Header */}
      <div className="section flex items-center justify-between">
        <div>
          <IconHeading
            text={t("pregnancy.articles")}
            icon={<Heart />}
            className="text-primary"
          />
          <SectionHeading>{t("pregnancy.ourArticles")}</SectionHeading>
        </div>
      </div>

      <div>
        <div className="section">
          {/* Scrollable Article Cards */}
          <Slider
            options={{
              spaceBetween: 10,
              slidesPerView: 1,
              pagination: pagination,
              navigation: true,
              // autoplay: {
              //   delay: 2500,
              //   disableOnInteraction: false,
              // },
              breakpoints: {
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                321: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1366: {
                  slidesPerView: 3.5,
                  spaceBetween: 20,
                },
              },
              // loop: true,
            }}
            sideOverlayClassName="bg-transparent"
            className="overflow-visible topNavigation sm:pl-7 pt-4! pb-14! h-full"
          >
            {data.map(
              (
                { _id, cover_image, thumbnail_image, title, excerpt, slug },
                index
              ) => (
                <SwiperSlide key={_id + index} className="h-auto! flex">
                  <ArticleCard
                    image={thumbnail_image || cover_image}
                    title={title}
                    description={excerpt}
                    slug={slug}
                  />
                </SwiperSlide>
              )
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ArticleSection;
