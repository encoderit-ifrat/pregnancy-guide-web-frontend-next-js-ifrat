"use client";

import React from "react";
import Image from "next/image";
import StatsCard from "@/components/ui/cards/StatusCard";
import { useTranslation } from "@/hooks/useTranslation";

const StatsSection: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: "/images/icons/heart.png",
      value: "41 veckor",
      label: t("stats.titel_1"),
    },
    {
      icon: "/images/icons/mothers-love.png",
      value: "3 perspektiv",
      label: t("stats.titel_2"),
    },
    {
      icon: "/images/icons/donation.png",
      value: "120+",
      label: t("stats.titel_3"),
    },
    {
      icon: "/images/icons/gift.png",
      value: "2000+",
      label: t("stats.titel_4"),
    },
  ];

  return (
    <section className="pt-8 pb-20">
      <div className="section">
        <div className="grid grid-cols-2 gap-3 lg:gap-6 ">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              number={stat.value}
              label={stat.label}
              icon={
                <Image
                  src={stat.icon}
                  alt=""
                  width={60}
                  height={60}
                  className="w-12 h-12"
                />
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
