"use client";

import React from "react";
import OverallProgress from "@/components/ui/overall-progress";
import { useQueryGetAllMyCompletedChecklists } from "../_api/queries/useQueryGetAllMyChecklists";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import CheckList from "../_component/CheckList";
import Pagination from "@/components/base/Pagination";
import EmptyChecklist from "../_component/EmptyChecklist";

type ChecklistItem = {
  _id: string;
  assigned_to: string;
  checked?: boolean;
  is_completed?: boolean;
  checklist_id: string;
  createdAt: string;
  description: string;
  due_date: string;
  priority: string;
  reminder: boolean;
  title: string;
  updatedAt: string;
  __v: number;
};

type Checklist = {
  _id: string;
  title: string;
  description: string;
  category: string;
  userId: string;
  is_active: boolean;
  is_global: boolean;
  is_own: boolean;
  owned: boolean;
  all_checked: boolean;
  items: ChecklistItem[];
  progress: {
    completed: number;
    percentage: number;
    total: number;
  };
  created_by: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  __v: number;
};

interface FinalizedChecklistProps {
  onAddList?: () => void;
  onBrowseTemplates?: () => void;
}

export default function FinalizedChecklist({
  onAddList,
  onBrowseTemplates,
}: FinalizedChecklistProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQueryGetAllMyCompletedChecklists({
    params: {
      page: page,
      limit: "5",
    },
  });

  const checklists = apiResponse?.data || [];
  // console.log("👉 ~ FinalizedChecklist ~ checklists:", checklists);
  const meta = apiResponse?.pagination;

  const allTasks = checklists?.flatMap((item: Checklist) => item.items) || [];
  const totalTasks = allTasks.length;
  const tasksDone = allTasks.filter(
    (task: ChecklistItem) => task.is_completed || task.checked
  ).length;
  const progressValue =
    totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/check-lists?${params.toString()}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-10">
      <OverallProgress
        value={progressValue}
        tasksDone={tasksDone}
        totalTasks={totalTasks}
      />

      {checklists.length > 0 ? (
        <div className="space-y-8">
          <CheckList checklistItems={checklists} refetch={refetch} readOnly={true} />
          {meta && meta.last_page > 1 && (
            <div className="w-full max-w-3xl mx-auto mt-8 pb-4">
              <Pagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyChecklist
          onAddList={onAddList || (() => { })}
          onBrowseTemplates={onBrowseTemplates || (() => { })}
        />
      )}
    </div>
  );
}
