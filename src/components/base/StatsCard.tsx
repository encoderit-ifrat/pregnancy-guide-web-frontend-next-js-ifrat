import React from "react";

type StatsCardProps = {
  icon: React.ReactNode;
  number: number;
  label: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, number, label }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-circle">
      {/* Icon */}
      <div className="w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] md:w-[60px] md:h-[60px] flex-shrink-0">
        {icon}
      </div>

      {/* Number + Label */}
      <div className="flex flex-col items-start">
        <h3 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-none">
          {number}+
        </h3>
        <p className="text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 text-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
