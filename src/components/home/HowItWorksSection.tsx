"use client";

import Image from "next/image";
import { Heart, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import IconHeading from "@/components/ui/text/IconHeading";
import VCard from "@/components/ui/cards/VCard";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
      image: "/images/articles/2.png",
    },
    {
      number: "02",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      image: "/images/articles/3.png",
    },
    {
      number: "03",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      image: "/images/articles/1.png",
    },
  ];

  return (
    <section className="relative py-10 md:pb-10">
      <div className="section">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <IconHeading
            text={t("howItWorks.label")}
            image="/images/icons/baby-face.png"
            className="text-primary justify-center"
          />
          <SectionHeading>{t("howItWorks.title")}</SectionHeading>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-5 justify-center sm:grid-cols-2 md:grid-cols-3">
          {steps.map((step, index) => (
            <VCard key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
