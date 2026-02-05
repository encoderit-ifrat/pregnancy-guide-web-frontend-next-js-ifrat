import { Users, Heart, Baby, Gift } from "lucide-react";
import React from "react";
import StatsCard from "@/components/ui/cards/StatusCard";

const stats = [
  {
    icon: Users,
    value: "530+",
    label: "Our Volunteer",
  },
  {
    icon: Heart,
    value: "22+",
    label: "Happy Children",
  },
  {
    icon: Baby,
    value: "22+",
    label: "Our Volunteer",
  },
  {
    icon: Gift,
    value: "22+",
    label: "Our Volunteer",
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="pt-8 pb-20">
      <div className="section">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              number={stat.value}
              label={stat.label}
              icon={<stat.icon className="h-10 w-10 text-text-primary" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { StatsSection };
