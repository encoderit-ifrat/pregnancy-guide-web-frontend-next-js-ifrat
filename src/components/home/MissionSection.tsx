"use client";

import Image from "next/image";
import { Download, Heart } from "lucide-react";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import WaveLeaf from "../layout/svg/WaveLeaf";
import React from "react";
import ConcaveCurve from "../layout/svg/ConcaveCurve";
import { useTranslation } from "@/hooks/useTranslation";

export function MissionSection() {
  const { t } = useTranslation();

  return (
    <section className="relative">
      <div className="absolute inset-0 z-10 bg-[url('/images/heart-bg.png')] bg-repeat-x bg-repeat-y opacity-10" />

      <div className="relative z-20">
        <div className="container-xl max-w-6xl  pt-6 pb-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="order-2 md:order-1 flex justify-center lg:justify-end">
              <div className="relative overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/track-week/1.png"
                  alt="Baby feet"
                  width={420}
                  height={420}
                  className="h-[361px] w-[365.02px] md:h-[420px] md:w-[420px] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              {/* Section Label */}
              <IconHeading
                text={t("mission.label")}
                image="/images/icons/mother1.png"
                className="text-primary justify-center md:justify-start"
              />
              <SectionHeading>{t("mission.title")}</SectionHeading>

              <p className="mx-auto max-w-xl lg:mx-0">
                {t("mission.description")}
              </p>

              <div className="mt-4 text-[20px] sm:text-[24px] pl-2 md:pl-4 m-0 font-bold border-l-7 border-primary italic">
                Supporting every beginning with care.
                Guiding parents with trust.
              </div>
            </div>
          </div>
        </div>
        {/* divider */}
        <ConcaveCurve />
      </div>
    </section>
  );
}
