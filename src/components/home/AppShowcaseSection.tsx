"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/providers/I18nProvider";

export function AppShowcaseSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-primary-light pt-10 pb-20">
      <div className="max-w-7xl relative mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Section Label */}
            <IconHeading
              text={t("appShowcase.label")}
              icon={<Sparkles />}
              className="text-primary justify-center lg:justify-start"
            />
            <SectionHeading>
              {t("appShowcase.title1")}
              <br />
              {t("appShowcase.title2")}
            </SectionHeading>

            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-text-secondary lg:mx-0 lg:text-lg">
              {t("appShowcase.description")}
            </p>
          </div>

          {/* Phone Mockups Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/images/mobiles.png"
                alt="App screenshot"
                width={600}
                height={400}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
