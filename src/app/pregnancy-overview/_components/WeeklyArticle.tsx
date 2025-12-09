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
function WeeklyArticle({ data = initialData }: TProps) {
  const { title, excerpt, cover_image, slug, thumbnail_image } = data;
  return (
    <section className="">
      <Image
        src={"/assets/logo/sss.svg"}
        alt="Wave"
        width={1920}
        height={239}
        className="w-full h-auto object-cover"
        priority
      />
      <div className="-mt-1 bg-soft-purple w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 p-5">
        <div className="w-full max-w-5xl mx-auto bg-soft-white   gap-4 flex flex-col md:flex-row ">
          <div className="md:p-4">
            <div className="relative shrink-0 flex-1 min-w-full md:min-w-56 min-h-80 bg-gray-100">
              <Link href={`/articles/${slug}`}>
                <Image
                  src={imageLinkGenerator(cover_image)}
                  alt={title}
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
              <Link href={`/articles/${slug}`} className="text-wrap">
                {title}
              </Link>
            </p>
            <p className="text-base leading-6 text-text-mid">{excerpt}</p>
            <div>
              <Link href={`/articles/${slug}`}>
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
      <Image
        src="/assets/logo/sssss.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="object-cover w-full h-auto bg-soft-purple"
        priority
      />
    </section>
  );
}

export default WeeklyArticle;
