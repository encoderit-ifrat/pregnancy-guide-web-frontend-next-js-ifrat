import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { FileQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";
import ArticleBigCard from "@/components/ui/cards/ArticleBigCard";

type TProps = {
  articles: {
    title: string;
    excerpt: string;
    cover_image: string;
    slug: string;
    thumbnail_image?: string;
  }[];
};

function WeeklyArticle({ articles }: TProps) {
  const pagination = {
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="bg-white pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl text-center mx-auto">
          <IconHeading
            text="Articles"
            icon={<FileQuestion />}
            className="text-primary justify-center"
          />
          <SectionHeading>
            Articles & Insights for Your Pregnancy Journey
          </SectionHeading>
          <p>
            Expert advice, real stories, and helpful tips to support you and
            your family at every stage.
          </p>
        </div>

        {articles && articles.length && (
          <Slider
            options={{
              spaceBetween: 30,
              // slidesPerView: 1,
              slidesPerView: "auto",
              pagination: pagination,
              navigation: true,
              // autoplay: {
              //   delay: 4000,
              //   pauseOnMouseEnter: true,
              // },
              loop: true,
            }}
            sideOverlayClassName="bg-white w-4"
            className="px-7! py-10! lg:pb-14! h-full"
          >
            {articles.map((article, index) => (
              <SwiperSlide key={index} className="h-auto!">
                <ArticleBigCard data={article} />
              </SwiperSlide>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}

export default WeeklyArticle;
