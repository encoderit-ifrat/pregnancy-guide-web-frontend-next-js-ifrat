"use client";

import Image from "next/image";
import {
  Tag,
  Shield,
  Cloud,
  Zap,
  Headphones,
} from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { Slider } from "@/components/ui/Slider";
import { SwiperSlide } from "swiper/react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/providers/I18nProvider";

export function WhyChooseUsSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("whyChooseUs.securePrivate"),
      description: t("whyChooseUs.securePrivateDesc"),
      icon: Shield,
      image: "/images/why-choose-us/1.png",
    },
    {
      title: t("whyChooseUs.cloudSync"),
      description: t("whyChooseUs.cloudSyncDesc"),
      icon: Cloud,
      image: "/images/why-choose-us/2.png",
    },
    {
      title: t("whyChooseUs.fastResponsive"),
      description: t("whyChooseUs.fastResponsiveDesc"),
      icon: Zap,
      image: "/images/why-choose-us/3.png",
    },
    {
      title: t("whyChooseUs.support247"),
      description: t("whyChooseUs.support247Desc"),
      icon: Headphones,
      image: "/images/why-choose-us/4.png",
    },
  ];

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
            text={t("whyChooseUs.label")}
            icon={<Tag />}
            className="text-primary justify-center"
          />
          <SectionHeading>{t("whyChooseUs.title")}</SectionHeading>
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
          {features.map((feature, index) => (
            <SwiperSlide key={index} className="h-auto flex">
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Image */}
                <div className="relative h-77.5">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#240443]/100 via-[#240443]/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-white!">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white!">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    </section>
  );
}
