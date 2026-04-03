"use client";

import React from "react";
import OverallProgress from "@/components/ui/overall-progress";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryGetAllMyCompletedChecklists } from "../_api/queries/useQueryGetAllMyChecklists";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import CheckList from "../_component/CheckList";
import Pagination from "@/components/base/Pagination";



export default function FinalizedChecklist() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";

  const { data: apiResponse, isLoading, refetch } = useQueryGetAllMyCompletedChecklists({
    params: {
      page: page,
      limit: "5",
    },
  });

  const checklists = apiResponse?.data || [];
  const meta = apiResponse?.pagination;

  const allTasks = checklists?.flatMap((item: any) => item.items) || [];
  const totalTasks = allTasks.length;
  const tasksDone = allTasks.filter((task: any) => task.is_completed || task.checked).length;
  const progressValue = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;

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
          <CheckList
            checklistItems={checklists}
            refetch={refetch}
          />
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
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="size-24 rounded-full bg-[#F3E8FF] flex items-center justify-center">
            <Sparkles className="size-12 text-[#A97AEC]" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-3xl font-semibold text-primary-dark font-poppins">
              {t("checklists.finalized.noActiveTasks")}
            </h3>
            <p className="text-[#6A7282] max-w-sm mx-auto font-outfit text-lg leading-relaxed">
              {t("checklists.finalized.noActiveTasksDesc")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
