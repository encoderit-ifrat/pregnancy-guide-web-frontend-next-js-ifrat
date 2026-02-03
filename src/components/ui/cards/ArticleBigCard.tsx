import Image from "next/image";
import { Card } from "@/components/ui/Card";
import React from "react";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type BigSliderCardProps = {
  data?: {
    title?: string;
    excerpt?: string;
    cover_image?: string;
    slug: string;
    thumbnail_image?: string;
  };
};

export default function ArticleBigCard({ data = {} }: BigSliderCardProps) {
  return (
    <Card className="h-full flex flex-col grow! bg-white rounded-lg shadow-[0_10px_30px_rgba(60,64,67,0.2)] p-3 sm:p-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: text content */}
        <div className="h-full order-2 md:order-1 px-2 md:pl-6 md:pr-10 flex flex-col justify-between">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#3b2b6f] mb-4">
            {data?.title}
          </h3>
          <p className="flex-1 text-sm md:text-base text-gray-600 mb-6 max-w-xl line-clamp-6 md:line-clamp-8">
            {data?.excerpt}
          </p>

          <button
            type="button"
            className="inline-block px-6 py-3 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
          >
            Read More
          </button>
        </div>

        {/* Right: image with circular logo overlay */}
        <div className="order-1 md:order-2 mb-6 md:mb-0 relative">
          <Image
            src={imageLinkGenerator(data?.cover_image || data?.thumbnail_image)}
            alt={data?.title || ""}
            width={840}
            height={600}
            className="object-fit object-cover rounded-lg w-[340px] !h-[340px] sm:w-[400px] sm:!h-[400px] border"
          />

          {/* circular logo badge */}
          <div
            className="absolute transform left-1/2 bottom-0 md:left-0 md:top-1/2 -translate-x-1/2 translate-y-1/2 md:-translate-y-1/2 bg-primary
          size-26 md:size-28 rounded-full flex items-center justify-center border-8 md:border-10 border-white"
          >
            <div className="flex items-center justify-center">
              <Logo dark={false} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
