import OverallProgress from "@/components/ui/overall-progress";
import React from "react";
import CheckList from "../_component/CheckList";
import { CheckListItemProps } from "../_types/checklist_item_types";

export default function ActiveChecklist({
  checklistItems,
  totalPages,
  currentPage,
  refetch,
}: CheckListItemProps) {
  const allTasks = checklistItems?.flatMap((item) => item.items) || [];
  const totalTasks = allTasks.length;
  const tasksDone = allTasks.filter((task) => task.is_completed || task.checked).length;
  const progressValue = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;

  return (
    <div className="space-y-10">
      <OverallProgress 
        value={progressValue} 
        tasksDone={tasksDone} 
        totalTasks={totalTasks} 
      />
      <CheckList
        checklistItems={checklistItems}
        totalPages={totalPages}
        currentPage={currentPage}
        refetch={refetch}
      />
    </div>
  );
}
