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
    <section className="bg-white">
      <div className="section py-10 lg:py-16 -mt-1">
        <div className="text-center mb-7 lg:mb-14">
          <IconHeading
            text="Articles"
            icon={<Heart />}
            className="text-primary justify-center"
          />
          <SectionHeading>Weekly Details</SectionHeading>
        </div>

        <div className="bg-white shadow-lg p-5 rounded-2xl">
          <div className="relative w-full h-[180] md:h-145">
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <Image
                src={imageLinkGenerator(cover_image || thumbnail_image)}
                alt={title}
                width="1366"
                height="580"
                className="w-full h-full rounded-2xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                priority
              />
            </Link>
          </div>
          <div className="px-4 py-4 w-full lg:w-1/2 space-y-4 text-center lg:text-left popover-foreground order-1 lg:order-2">
            <Link href={`/articles/${slug || "article-not-found"}`}>
              <h3 className="text-3xl!">{title}</h3>
            </Link>
            <p className="mt-3 mb-6">{excerpt}</p>
            <div className="pt-2">
              <Link href={`/articles/${slug || "article-not-found"}`}>
                <Button
                  variant="outline"
                  className="px-12 font-poppins font-semibold text-lg w-full"
                >
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WeeklyDetails;
