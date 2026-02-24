"use client";

import Image from "next/image";

import WaveDivider from "@/components/layout/svg/WaveDivider";
import { useTranslation } from "@/providers/I18nProvider";

export default function HeroSection2() {
  const { t } = useTranslation();
  return (
    <section className="relative bg-[#F6F0FF] pt-2 pb-0 lg:pb-0">
      <div className="section px-4">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="order-1 text-center lg:order-1 lg:text-left">
            <p className="text-primary text-2xl">{t("hero2.label")}</p>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl text-primary-dark">
              {t("hero2.title")}
            </h1>
            <p className="mx-auto mb-8 text-sm leading-relaxed text-text-secondary lg:mx-0 lg:text-lg">
              {t("hero2.subtitle")}
            </p>
          </div>

          {/* Tree Illustration */}
          <div className="order-2 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/article-bg.png"
                alt="Tree of life illustration"
                width={500}
                height={600}
                className="h-auto w-full transform md:translate-y-[20px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <WaveDivider
        className="text-white transform translate-y-[1px]"
        bgClassName="bg-[#F6F0FF]"
      />
    </section>
  );
}
