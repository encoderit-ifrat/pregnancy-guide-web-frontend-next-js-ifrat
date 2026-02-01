"use client";
import React, { useRef } from "react";
import ArticleCard from "../ui/cards/ArticleCard";
import IconHeading from "../ui/text/IconHeading";
import { SectionHeading } from "../ui/text/SectionHeading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Heart } from "lucide-react";
import { Slider } from "../ui/Slider";
import {
  Autoplay,
  FreeMode,
  Grid,
  Navigation,
  Pagination,
} from "swiper/modules";
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
            <div>
              {/*<Swiper*/}
              {/*  modules={[Grid, Navigation, Pagination, FreeMode, Autoplay]}*/}
              {/*  spaceBetween={10}*/}
              {/*  slidesPerView={1}*/}
              {/*  navigation={true}*/}
              {/*  pagination={{*/}
              {/*    ...pagination,*/}
              {/*    clickable: true,*/}
              {/*    enabled: true,*/}
              {/*  }}*/}
              {/*  grid={{*/}
              {/*    rows: 2,*/}
              {/*    fill: "row",*/}
              {/*  }}*/}
              {/*  breakpoints={{*/}
              {/*    320: {*/}
              {/*      slidesPerView: 1,*/}
              {/*      spaceBetween: 10,*/}
              {/*      grid: {*/}
              {/*        rows: 1,*/}
              {/*        fill: "row",*/}
              {/*      },*/}
              {/*    },*/}
              {/*    321: {*/}
              {/*      slidesPerView: 1.2,*/}
              {/*      spaceBetween: 10,*/}
              {/*    },*/}
              {/*    768: {*/}
              {/*      slidesPerView: 2.5,*/}
              {/*      spaceBetween: 20,*/}
              {/*      grid: {*/}
              {/*        rows: 1,*/}
              {/*        fill: "row",*/}
              {/*      },*/}
              {/*    },*/}
              {/*    1024: {*/}
              {/*      slidesPerView: 3,*/}
              {/*      spaceBetween: 20,*/}
              {/*      grid: {*/}
              {/*        rows: 2,*/}
              {/*        fill: "row",*/}
              {/*      },*/}
              {/*      pagination: {*/}
              {/*        enabled: false,*/}
              {/*      },*/}
              {/*    },*/}
              {/*  }}*/}
              {/*  className={cn("")}*/}
              {/*>*/}
              {/*  {data.map(*/}
              {/*    (*/}
              {/*      {_id, cover_image, thumbnail_image, title, excerpt, slug},*/}
              {/*      index*/}
              {/*    ) => (*/}
              {/*      <SwiperSlide key={_id + index} className="">*/}
              {/*        <ArticleCard*/}
              {/*          image={thumbnail_image || cover_image}*/}
              {/*          title={title}*/}
              {/*          description={excerpt}*/}
              {/*          slug={slug}*/}
              {/*          showButton={false}*/}
              {/*        />*/}
              {/*      </SwiperSlide>*/}
              {/*    )*/}
              {/*  )}*/}

              {/*  /!*overlay to hide slide under next button*!/*/}
              {/*  <div*/}
              {/*    className={cn(*/}
              {/*      "h-full w-[10px] absolute top-0 z-[1] right-0",*/}
              {/*    )}*/}
              {/*  ></div>*/}
              {/*  <div*/}
              {/*    className={cn(*/}
              {/*      "h-full w-[10px] absolute top-0 z-[1] left-0",*/}
              {/*    )}*/}
              {/*  ></div>*/}
              {/*</Swiper>*/}

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
                className=""
              >
                {data.map(
                  (
                    { _id, cover_image, thumbnail_image, title, excerpt, slug },
                    index
                  ) => (
                    <SwiperSlide key={_id + index} className="">
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
