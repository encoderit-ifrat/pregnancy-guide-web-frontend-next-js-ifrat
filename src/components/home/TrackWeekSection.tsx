"use client";

import { FileText } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import Timeline from "@/components/home/TimeLine";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/providers/I18nProvider";

export function TrackYourWeekSection({ data }: { data: any }) {
  const { t } = useTranslation();

  return (
    <section className="bg-[#FDFBFF] relative">
      <div className="container-xl">
        {/* Dotted Border Container */}
        {/*<div className="rounded-3xl border-2 border-dashed border-primary-muted p-6 md:p-12">*/}
        <div className="rounded-3xl">
          {/* Section Header */}
          <div className="mb-6 md:mb-12 text-center">
            <IconHeading
              text={t("trackWeek.label")}
              icon={<FileText />}
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
