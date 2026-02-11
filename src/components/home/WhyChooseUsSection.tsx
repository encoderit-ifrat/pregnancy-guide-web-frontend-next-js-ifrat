"use client";

import Image from "next/image";
import {Tag,} from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import {Slider} from "@/components/ui/Slider";
import {SwiperSlide} from "swiper/react";
import {SectionHeading} from "@/components/ui/text/SectionHeading";
import {imageLinkGenerator} from "@/helpers/imageLinkGenerator";
import Link from "next/link";

// const features = [
//   {
//     title: "Secure & Private",
//     description: "Verified & professional.",
//     icon: Shield,
//     image: "/images/why-choose-us/1.png",
//   },
//   {
//     title: "Cloud Sync",
//     description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//     icon: Cloud,
//     image: "/images/why-choose-us/2.png",
//   },
//   {
//     title: "Fast & Responsive",
//     description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//     icon: Zap,
//     image: "/images/why-choose-us/3.png",
//   },
//   {
//     title: "24/7 Support",
//     description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//     icon: Headphones,
//     image: "/images/why-choose-us/4.png",
//   },
// ];

export function WhyChooseUsSection({data}: { data: any }) {
  const pagination = {
    renderBullet: function (index: string | number, className: string) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="relative overflow-hidden bg-primary-light pt-10 pb-20">
      <div className="max-w-7xl relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <IconHeading
            text="Choose Us"
            icon={<Tag/>}
            className="text-primary justify-center"
          />
          <SectionHeading>Why choose Us</SectionHeading>
        </div>

        <Slider
          options={{
            spaceBetween: 10,
            slidesPerView: 1,
            pagination: pagination,
            navigation: true,
            breakpoints: {
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            },
          }}
        >
          {data.map((d: any, index: number) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                <Link
                  href={`/articles/${d?.slug || "article-not-found"}`}
                >
                  {/* Image */}
                  <div className="relative h-77.5">
                    <Image
                      src={imageLinkGenerator(d.thumbnail_image || d.cover_image)}
                      alt={d.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#240443]/100 via-[#240443]/20 to-transparent"/>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-white! line-clamp-1"
                            title={d.title}
                        >
                          {d.title}
                        </h3>
                        <p className="text-sm text-white! line-clamp-2"
                           title={d.excerpt}
                        >
                          {d.excerpt}
                        </p>
                      </div>
                      {/* <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    </div> */}
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    </section>
  );
}
