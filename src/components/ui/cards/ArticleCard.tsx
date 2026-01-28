import Image from "next/image";
import {Card} from "@/components/ui/Card";
import React from "react";
import {imageLinkGenerator} from "@/helpers/imageLinkGenerator";
import Logo from "@/components/ui/Logo";
import {cn} from "@/lib/utils";

type BigSliderCardProps = {
  data?: {
    title?: string;
    excerpt?: string;
    cover_image?: string;
    slug: string;
    thumbnail_image?: string;
  };
};

export default function ArticleCard({data = {}}: BigSliderCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow-[0_6px_24px_rgba(60,64,67,0.08)] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: text content */}
        <div className="px-2 md:px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#3b2b6f] mb-4">{data?.title}</h3>
          <p className="text-sm md:text-base text-gray-600 mb-6 max-w-xl">{data?.excerpt}</p>

          <button
            type="button"
            className="inline-block px-6 py-3 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
          >
            Read More
          </button>
        </div>

        {/* Right: image with circular logo overlay */}
        <div className="relative flex justify-end">
          <Image
            src={imageLinkGenerator(data?.cover_image || data?.thumbnail_image)}
            alt={data?.title || ''}
            width={840}
            height={600}
            className="object-cover rounded-lg w-full h-full border"
          />

          {/* circular logo badge */}
          <div className="absolute transform left-1/2 top-0 md:left-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary
          w-22 h-22 md:w-24 md:h-24 rounded-full flex items-center justify-center border-6 md:border-8 border-white">
            <div className="flex items-center justify-center">
              <Logo dark={false}/>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
