import React from "react";

type StatsCardProps = {
  key: number;
  icon: React.ReactNode;
  number: string;
  label: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon, number, label }) => {
  return (
    <div
      className={`flex items-center gap-2 pr-4  rounded-full bg-primary w-full p-2 text-white shadow-lg`}
    >
      <div className="flex size-15 lg:size-24 items-center justify-center rounded-full bg-white shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-medium text-lg md:text-3xl">{number}</div>
        <div className="text-xs text-white/80 md:text-sm whitespace-nowrap font-outfit">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
