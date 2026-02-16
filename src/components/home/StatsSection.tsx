import React from "react";
import Image from "next/image";
import StatsCard from "@/components/ui/cards/StatusCard";

const stats = [
  {
    icon: "/images/icons/heart.png",
    value: "530+",
    label: "Our Volunteer",
  },
  {
    icon: "/images/icons/mothers-love.png",
    value: "22+",
    label: "Happy Children",
  },
  {
    icon: "/images/icons/donation.png",
    value: "22+",
    label: "Our Volunteer",
  },
  {
    icon: "/images/icons/gift.png",
    value: "22+",
    label: "Our Volunteer",
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="pt-8 pb-20">
      <div className="section">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6 ">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              number={stat.value}
              label={stat.label}
              // icon={<stat.icon className="min-md:size-10 text-text-primary" />}
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
