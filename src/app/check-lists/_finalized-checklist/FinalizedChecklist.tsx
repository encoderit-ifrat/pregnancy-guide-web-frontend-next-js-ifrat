"use client";

import React from "react";
import OverallProgress from "@/components/ui/overall-progress";
import { ListTodo, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

interface FinalizedChecklistProps {
  onAddNew: () => void;
  onBrowseTemplates: () => void;
}

export default function FinalizedChecklist({
  onAddNew,
  onBrowseTemplates,
}: FinalizedChecklistProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <OverallProgress value={100} tasksDone={6} totalTasks={6} />

      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <p className="font-medium text-lg flex items-center justify-center gap-2 w-full text-center">
          <span className="!text-[#00A63E]">
            {t("checklists.finalized.congratulations")}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="size-24 rounded-full bg-[#F3E8FF] flex items-center justify-center">
          <ListTodo className="size-12 text-[#A97AEC]" />
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-3xl font-semibold text-primary-dark font-poppins">
            {t("checklists.finalized.noActiveTasks")}
          </h3>
          <p className="text-[#6A7282] max-w-sm mx-auto font-outfit text-lg leading-relaxed">
            {t("checklists.finalized.noActiveTasksDesc")}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button
            variant="outline"
            className="h-14 py-2 px-6 rounded-full bg-[#F9FAFB] text-[#A67EEA] font-medium flex items-center gap-3 hover:bg-white transition-all font-outfit text-xl shadow-sm"
            onClick={onAddNew}
          >
            {t("checklists.finalized.addNewList")}
            <div className="size-8 p-1.5 rounded-full bg-[#A67EEA] text-white flex items-center justify-center shrink-0">
              <Plus size={20} strokeWidth={3} />
            </div>
          </Button>

          <Button
            className="h-14 py-2 px-6 rounded-full bg-[#A67EEA] text-white font-medium flex items-center gap-3 hover:bg-[#9333EA] transition-all font-outfit text-xl shadow-md"
            onClick={onBrowseTemplates}
          >
            {t("checklists.finalized.browseTemplates")}
            <div className="size-8 p-1.5 rounded-full bg-white text-[#A67EEA] flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
