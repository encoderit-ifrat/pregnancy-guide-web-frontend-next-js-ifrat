"use client";

import Image from "next/image";
import { Tag, Shield, Cloud, Zap, Headphones, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { Slider } from "@/components/ui/Slider";
import { SwiperSlide } from "swiper/react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

const features = [
  {
    title: "Secure & Private",
    description: "Verified & professional.",
    icon: Shield,
    image: "/images/why-choose-us/1.png",
  },
  {
    title: "Cloud Sync",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent",
    icon: Cloud,
    image: "/images/why-choose-us/2.png",
  },
  {
    title: "Fast & Responsive",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent",
    icon: Zap,
    image: "/images/why-choose-us/3.png",
  },
  {
    title: "24/7 Support",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent",
    icon: Headphones,
    image: "/images/why-choose-us/4.png",
  },
  {
    title: "Cloud Sync",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent",
    icon: Cloud,
    image: "/images/why-choose-us/2.png",
  },
  {
    title: "Fast & Responsive",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent",
    icon: Zap,
    image: "/images/why-choose-us/3.png",
  },
];

export function WhyChooseUsSection() {
  const pagination = {
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="relative overflow-hidden bg-primary-light">
      <div className="max-w-7xl relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <IconHeading text="Choose Us" icon={<Tag />} className="text-primary justify-center" />
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
            }
          }}
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Image */}
                <div className="relative h-[310px]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#240443]/100 via-[#240443]/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="mb-1 text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Slider>
        {/* Navigation Arrows - Desktop */}
        {/*<button*/}
        {/*  onClick={prevSlide}*/}
        {/*  className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-transform hover:scale-110 md:flex"*/}
        {/*  aria-label="Previous slide"*/}
        {/*>*/}
        {/*  <ChevronLeft className="h-6 w-6" />*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  onClick={nextSlide}*/}
        {/*  className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-transform hover:scale-110 md:flex"*/}
        {/*  aria-label="Next slide"*/}
        {/*>*/}
        {/*  <ChevronRight className="h-6 w-6" />*/}
        {/*</button>*/}
      </div>
    </section>
  );
}
