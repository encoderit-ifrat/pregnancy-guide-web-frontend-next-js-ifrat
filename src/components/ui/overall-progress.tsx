import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function OverallProgress({
  value = 17,
  tasksDone = 1,
  totalTasks = 6,
}: {
  value?: number;
  tasksDone?: number;
  totalTasks?: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="w-full font-inter space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="text-lg font-medium text-[#1B1343] font-[Outfit] align-middle">
            {t("checklists.progress.title")}
          </div>

          <div className="flex items-center gap-1 text-sm leading-[15.02px] text-[#1B1343] mt-1 font-normal">
            <div className="size-1 rounded-full bg-primary"></div>
            {t("checklists.progress.status", { done: tasksDone, total: totalTasks })}
          </div>
        </div>
        <div className="text-[22.53px] leading-[30.04px] font-bold text-primary">
          {value}%
        </div>
      </div>

      <div className="h-4 bg-[#F3F4F6] rounded-full shadow-[inset_0px_1.88px_3.75px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
