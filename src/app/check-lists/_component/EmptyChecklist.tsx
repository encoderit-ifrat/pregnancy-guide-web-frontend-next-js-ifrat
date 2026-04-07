"use client";

import React from "react";
import { Plus, Sparkles, ListChecks } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";

interface EmptyChecklistProps {
  onAddList: () => void;
  onBrowseTemplates: () => void;
  showCongratulations?: boolean;
}

export default function EmptyChecklist({
  onAddList,
  onBrowseTemplates,
  showCongratulations = true,
}: EmptyChecklistProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-10 animate-in fade-in duration-500">
      {showCongratulations && (
        <h2 className="text-[#22C55E] text-lg font-medium font-poppins text-center">
          {t("checklists.finalized.congratulations")}
        </h2>
      )}

      <div className="flex flex-col items-center space-y-6">
        <div className="size-20 rounded-full bg-[#F3E8FF] flex items-center justify-center shadow-sm">
          <ListChecks className="size-10 text-[#A97AEC]" />
        </div>

        <div className="space-y-3 text-center">
          <h3 className="text-3xl font-semibold text-[#3D3177] font-poppins">
            {t("checklists.finalized.noActiveTasks")}
          </h3>
          <p className="text-[#6A7282] max-w-sm mx-auto font-outfit text-base leading-relaxed px-4">
            {t("checklists.finalized.noActiveTasksDesc")}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onAddList}
          className="h-14 py-2 px-6 rounded-full border-[#A97AEC]/30 text-[#A97AEC] font-semibold flex items-center gap-3 hover:bg-[#F3E8FF]/50 transition-all font-outfit text-xl shadow-sm"
        >
          {t("checklists.finalized.addNewList")}
          <div className="size-8 rounded-full bg-[#A97AEC] text-white flex items-center justify-center shrink-0">
            <Plus size={20} strokeWidth={3} />
          </div>
        </Button>

        <Button
          onClick={onBrowseTemplates}
          className="h-14 py-2 px-6 rounded-full bg-[#A97AEC] hover:bg-[#9166D6] text-white font-semibold flex items-center gap-3 transition-all font-outfit text-xl shadow-md"
        >
          {t("checklists.finalized.browseTemplates")}
          <div className="size-8 rounded-full bg-white flex items-center justify-center shrink-0">
            <Sparkles size={18} strokeWidth={2} className="text-[#A97AEC]" />
          </div>
        </Button>
      </div>
    </div>
  );
}
