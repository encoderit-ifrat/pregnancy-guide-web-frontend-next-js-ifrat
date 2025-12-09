import React from "react";
import IconVolunteer from "@/assets/IconVolunteer";
import IconChildren from "@/assets/IconChildren";
import IconDonated from "@/assets/IconDonated";
import IconProductAndGifts from "@/assets/IconProductAndGifts";
import StatsCard from "./StatsCard";

const statsData = [
  { icon: <IconVolunteer />, number: 530, label: "Our Volunteer" },
  { icon: <IconChildren />, number: 22, label: "Happy Children" },
  { icon: <IconDonated />, number: 22, label: "Total Donated" },
  { icon: <IconProductAndGifts />, number: 22, label: "Products & Gifts" },
];

const StatsSection: React.FC = () => {
  return (
    <section className="w-full py-20">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
        <div className="scrollbar-hide flex items-center justify-between gap-8 flex-nowrap overflow-auto">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
