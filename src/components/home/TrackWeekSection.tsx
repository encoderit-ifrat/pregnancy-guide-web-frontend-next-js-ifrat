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
      title: "Veckans känsla",
      description:
        "Varje vecka får du en fråga om hur du mår och vad du tänker på. Se hur andra i samma graviditetsvecka svarar och känn igen dig i det de delar.",
      thumbnail_image: "/images/track-week/tw1.png",
    },
    {
      title: "Bjud in din partner",
      description:
        "Din partner får sin egen ingång i appen med innehåll anpassat för den som följer graviditeten utifrån. Ni följer samma vecka, var ni än befinner er.",
      thumbnail_image: "/images/track-week/tw2.png",
    },
    {
      title: "Bjud in närstående",
      description:
        "Dela graviditeten med dem som betyder mest. Familj och vänner kan följa med och känna sig nära, vecka för vecka.",
      thumbnail_image: "/images/track-week/tw3.png",
    },
    {
      title: "Forum för gravida",
      description:
        "Prata öppet med andra som är mitt i samma resa. Ställ frågor, dela erfarenheter och få svar från människor som verkligen förstår.",
      thumbnail_image: "/images/track-week/tw4.png",
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
