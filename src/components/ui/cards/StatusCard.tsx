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
      className={`flex items-center gap-4 rounded-full bg-primary p-2 text-white shadow-lg`}
    >
      <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold md:text-3xl">{number}</div>
        <div className="text-xs text-white/80 md:text-sm">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;
