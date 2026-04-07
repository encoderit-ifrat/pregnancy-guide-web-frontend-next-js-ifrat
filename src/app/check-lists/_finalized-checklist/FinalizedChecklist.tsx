"use client";

import React from "react";
import OverallProgress from "@/components/ui/overall-progress";
import { useQueryGetAllMyCompletedChecklists } from "../_api/queries/useQueryGetAllMyChecklists";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import CheckList from "../_component/CheckList";
import Pagination from "@/components/base/Pagination";
import EmptyChecklist from "../_component/EmptyChecklist";

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
  const meta = apiResponse?.pagination;

  const allTasks = checklists?.flatMap((item: any) => item.items) || [];
  const totalTasks = allTasks.length;
  const tasksDone = allTasks.filter(
    (task: any) => task.is_completed || task.checked
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
          onAddList={onAddList || (() => {})}
          onBrowseTemplates={onBrowseTemplates || (() => {})}
        />
      )}
    </div>
  );
}
