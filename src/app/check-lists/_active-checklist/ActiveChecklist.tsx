import OverallProgress from "@/components/ui/overall-progress";
import React from "react";
import CheckList from "../_component/CheckList";
import { CheckListItemProps } from "../_types/checklist_item_types";

export default function ActiveChecklist({
  checklistItems,
  totalPages,
  currentPage,
}: CheckListItemProps) {
  return (
    <div className="space-y-10">
      <OverallProgress />
      <CheckList
        checklistItems={checklistItems}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
