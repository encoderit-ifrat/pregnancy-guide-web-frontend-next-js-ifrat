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
      value: "530+",
      label: t("stats.ourVolunteer"),
    },
    {
      icon: "/images/icons/mothers-love.png",
      value: "22+",
      label: t("stats.happyChildren"),
    },
    {
      icon: "/images/icons/donation.png",
      value: "22+",
      label: t("stats.ourVolunteer"),
    },
    {
      icon: "/images/icons/gift.png",
      value: "22+",
      label: t("stats.ourVolunteer"),
    },
  ];

  return (
    <section className="pt-8 pb-20">
      <div className="section">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6 ">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              number={stat.value}
              label={stat.label}
              icon={<Image
                src={stat.icon}
                alt=""
                width={60}
                height={60}
                className="w-12 h-12"
              />}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
