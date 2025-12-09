import React from "react";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  icon,
}) => {
  return (
    <div className="relative aspect-square mx-auto flex flex-col items-center justify-center text-center bg-white rounded-full w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] shadow-xl p-6 sm:p-8">
      {/* Icon */}
      <div className="w-[60px] sm:w-[70px] md:w-[80px] mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#403471]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-[#323232] mt-2 leading-relaxed px-4">
        {description}
      </p>

      {/* Step Badge */}
      <div className="absolute -top-6 right-4 sm:right-6 flex items-center justify-center">
        {/* Outer dotted circle */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-dotted border-[#000000] flex items-center justify-center">
          {/* Inner filled circle */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#5C4F9D] text-white rounded-full flex flex-col items-center justify-center p-2">
            <span className="text-base sm:text-lg md:text-2xl font-bold">
              {step}
            </span>
            <span className="text-sm sm:text-lg md:text-2xl font-bold">
              STEP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
