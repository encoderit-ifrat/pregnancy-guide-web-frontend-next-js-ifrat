"use client";

import IconHeading from "@/components/ui/text/IconHeading";
import Timeline from "@/components/home/TimeLine";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export function TrackYourWeekSection() {
  const { t } = useTranslation();

  const data = [
    {
      title: "Förlossning article 1",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/5.png",
    },
    {
      title: "Förlossning article 2",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/2.png",
    },
    {
      title: "Förlossning article 3",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/4.png",
    },
    {
      title: "Förlossning article 4",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/1.png",
    },
  ];

  return (
    <section className="bg-[#FDFBFF] relative">
      <div className="container-xl">
        <div className="rounded-3xl">
          {/* Section Header */}
          <div className="mb-6 md:mb-12 text-center">
            <IconHeading
              text={t("trackWeek.label")}
              image="/images/icons/pregnant.png"
              className="text-primary justify-center"
            />
            <SectionHeading>{t("trackWeek.title")}</SectionHeading>
          </div>

          <Timeline timelineItems={data} />
        </div>
      </div>
    </section>
  );
}
