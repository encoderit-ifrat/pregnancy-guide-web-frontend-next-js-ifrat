"use client";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import IconRightArrow from "@/components/svg-icon/icon-rightArrow";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialData = {
  title: "",
  excerpt: "",
  cover_image: "",
  slug: "",
  thumbnail_image: "",
};
type TProps = {
  data: {
    title: string;
    excerpt: string;
    cover_image: string;
    slug: string;
    thumbnail_image?: string;
  };
};

function WeeklyDetails({ data = initialData }: TProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const { title, excerpt, cover_image, slug, thumbnail_image } = data;
  return (
    <section className="bg-white">
      <div className="section py-10 lg:py-16 -mt-1">
        <div className="text-center mb-7 lg:mb-14">
          <IconHeading
            text={t("pregnancy.articles")}
            image="/images/icons/heart-baby.png"
            className="text-primary justify-center"
          />
          <SectionHeading>
            {user
              ? t("pregnancy.weeklyDetails")
              : t("pregnancy.weeklyDetailsUserLoggedOut")}
          </SectionHeading>
        </div>

        <div className="bg-white shadow-week-details p-7 rounded-2xl">
          <div className="relative w-full h-[366px] md:h-145 overflow-hidden">
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <Image
                src={imageLinkGenerator(cover_image || thumbnail_image)}
                alt={title}
                width="1366"
                height="580"
                className="w-full h-full rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                priority
              />
            </Link>
            <div className="absolute bottom-0 left-0 right-0 bg-primary-dark/74 py-7 px-4 md:px-[52px] rounded-b-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl! md:text-3xl! font-semibold text-white">
                  {title}
                </h3>
                <Link href={`/articles/${slug || "article-not-found"}`}>
                  <IconRightArrow />
                </Link>
              </div>
            </div>
          </div>
          {/* <div className="px-4 py-4 w-full lg:w-1/2 space-y-4 text-center lg:text-left popover-foreground order-1 lg:order-2">
            <Link href={`/articles/${slug || "article-not-found"}`}>
            </Link>
            <p className="mt-3 mb-6">{excerpt}</p>
            <div className="pt-2">
              <Link href={`/articles/${slug || "article-not-found"}`}>
                <Button
                  variant="outline"
                  className="px-12 md:px-20 font-poppins font-semibold text-lg"
                >
                  {t("articles.readMore")}
                </Button>
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default WeeklyDetails;
