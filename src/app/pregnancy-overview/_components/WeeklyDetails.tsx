import { Button } from "@/components/ui/Button";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { Heart } from "lucide-react";
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
      <div className="bg-white py-10 lg:py-20 -mt-1">
        <div className="text-center">
          <IconHeading text="Articles" icon={<Heart />} className="text-primary justify-center" />
          <SectionHeading>Weekly Details</SectionHeading>
        </div>

        <div>
          <div className="relative w-full h-[180] md:h-[580px]">
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <Image
                src={imageLinkGenerator(cover_image)}
                alt={title}
                fill
                className="w-full h-full object-cover lg:object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                priority
              />
            </Link>
          </div>
          <div className="px-6 sm:px-8 w-full lg:w-1/2 space-y-4 text-center lg:text-left popover-foreground order-1 lg:order-2">
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
