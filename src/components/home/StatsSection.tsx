"use client";

import { Users, Heart, Baby, Gift } from "lucide-react";
import React from "react";
import StatsCard from "@/components/ui/cards/StatusCard";
import { useTranslation } from "@/providers/I18nProvider";

const StatsSection: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: "530+",
      label: t("stats.ourVolunteer"),
    },
    {
      icon: Heart,
      value: "22+",
      label: t("stats.happyChildren"),
    },
    {
      icon: Baby,
      value: "22+",
      label: t("stats.ourVolunteer"),
    },
    {
      icon: Gift,
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
              icon={<stat.icon className="min-md:size-10 text-text-primary" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
