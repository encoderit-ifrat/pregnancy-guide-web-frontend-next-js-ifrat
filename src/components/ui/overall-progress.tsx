import React from "react";

export default function OverallProgress() {
  return (
    <div className="w-full font-inter space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="text-lg font-medium text-[#1B1343] font-[Outfit] align-middle">
            Overall Progress
          </div>

          <div className="flex items-center gap-1 text-sm leading-[15.02px] text-[#1B1343] mt-1 font-normal">
            <div className="size-1 rounded-full bg-primary"></div>1 of 6 tasks
          </div>
        </div>
        <div className="text-[22.53px] leading-[30.04px] font-bold text-primary">
          17%
        </div>
      </div>

      <div className="h-4 bg-[#F3F4F6] rounded-full shadow-[inset_0px_1.88px_3.75px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="h-full bg-primary rounded-full w-[17%]"></div>
      </div>
    </div>
  );
}
