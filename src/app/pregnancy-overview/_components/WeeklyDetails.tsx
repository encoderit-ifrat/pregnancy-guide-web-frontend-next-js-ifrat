import { Button } from "@/components/ui/Button";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  const { title, excerpt, cover_image, slug, thumbnail_image } = data;
  return (
    <section>
      <Image
        src="/assets/logo/sss.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="object-cover w-full h-auto"
        priority
      />
      <div className="bg-soft-purple py-10 lg:py-20 -mt-1">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative w-full lg:w-1/2 h-[320px] sm:h-[380px] lg:h-[471px] order-2 lg:order-1 px-6 sm:px-8 lg:px-0">
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <div className="relative w-full h-full">
                <Image
                  src={imageLinkGenerator(cover_image)}
                  alt={title}
                  fill
                  className="object-cover lg:object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="px-6 sm:px-8 w-full lg:w-1/2 space-y-4 text-center lg:text-left popover-foreground order-1 lg:order-2">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-medium whitespace-nowrap">
              WEEKLY DETAILS
            </p>
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <p className="text-lg sm:text-xl lg:text-2xl text-text-dark">
                {title}
              </p>
            </Link>
            <p className="text-sm sm:text-base leading-6 text-text-mid">
              {excerpt}
            </p>
            <div className="pt-3">
              <Link href={`/articles/${slug || "article-not-found"}`}>
                <Button variant="darkPurple">Read More</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklyDetails;
