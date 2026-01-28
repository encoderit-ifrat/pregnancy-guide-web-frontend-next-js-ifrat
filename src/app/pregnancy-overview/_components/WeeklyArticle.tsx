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

const initialData = {
  title: "",
  excerpt: "",
  cover_image: "",
  slug: "",
  thumbnail_image: "",
};

type TProps = {
  articles: [] | {
    title: string;
    excerpt: string;
    cover_image: string;
    slug: string;
    thumbnail_image?: string;
  };
};

function WeeklyArticle({ articles = initialData }: TProps) {
  const pagination = {
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="bg-white">
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

        {data && <Slider
          options={{
            spaceBetween: 10,
            slidesPerView: 1,
            pagination: pagination,
            navigation: true,
          }}
        >
          {articles.map((article, index) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 p-5">
                  <div className="w-full max-w-5xl mx-auto bg-soft-white   gap-4 flex flex-col md:flex-row ">
                    <div className="md:p-4">
                      <div className="relative shrink-0 flex-1 min-w-full md:min-w-56 min-h-80 bg-gray-100">
                        <Link href={`/articles/${article.slug}`}>
                          <Image
                            src={imageLinkGenerator(article.cover_image)}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            priority
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="w-full space-y-4 lg:text-start h-fit my-auto p-4">
                      <p className="text-2xl lg:text-3xl text-popover-foreground ">
                        <Link href={`/articles/${article.slug}`} className="text-wrap">
                          {article.title}
                        </Link>
                      </p>
                      <p className="text-base leading-6 text-text-mid">
                        {article.excerpt}
                      </p>
                      <div>
                        <Link href={`/articles/${article.slug}`}>
                          <Button
                            variant="softPurple"
                            className="w-auto self-start px-4 py-2"
                          >
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Slider>}
      </div>
    </section>
  );
}

export default WeeklyArticle;
