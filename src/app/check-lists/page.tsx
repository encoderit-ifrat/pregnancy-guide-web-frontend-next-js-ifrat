"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CornerDownLeft,
  Plus,
  Square,
  SquarePen,
  Trash2,
} from "lucide-react";
import CheckList from "@/components/base/CheckList";
import ChecklistForm from "./_component/CheckListForm";
import { AppDialog } from "@/components/base/AppDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { useQueryGetAllMyChecklists } from "./_api/queries/useQueryGetAllMyChecklists";
import { useMutationToggleChecklist } from "./_api/mutations/UseMutationToggleChecklist";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmDialog } from "@/components/base/DeleteConfirmDialog";
import { useMutationDeleteChecklist } from "./_api/mutations/UseMutationDeleteChecklist";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import Pagination from "@/components/base/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Link from "next/link";
import CheckListItem from "@/app/check-lists/_component/CheckListItem";

export default function CheckLists() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryID = searchParams.get("id");
  const page = searchParams.get("page") || "1";

  const [formData, setFormData] = useState<{
    type: "default" | "update" | "delete";
    id: string;
    data?: any;
  }>({ type: "default", id: "" });
  const { isAuthenticated } = useCurrentUser();
  const { data, isLoading, refetch, isFetching } = useQueryGetAllMyChecklists({
    params: {
      id: queryID ?? "",
      page: page,
    },
  });
  const { mutate: deleteChecklist, isPending: isPendingDeleteChecklist } =
    useMutationDeleteChecklist();
  const { data: checklists, pagination: meta } = data?.data ?? {};
  const [filteredLists, setFilterLists] = useState(() => checklists);
  useEffect(() => {
    setFilterLists(checklists);
  }, [checklists]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/check-lists?${params.toString()}`);
  };

  const AddChecklistTrigger = (
    <div
      onClick={(e) => {
        if (!isAuthenticated) {
          e.preventDefault();
          toast.warning("Please log in to add a checklist");
        }
      }}
      className={`flex items-center border bg-soft-white border-gray rounded-full px-4 py-2 transition w-auto hover:opacity-90 ${
        isAuthenticated
          ? "cursor-pointer hover:bg-purple-50"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-center text-white bg-primary rounded-full w-10 h-10 hover:bg-primary-dark transition-all">
        <Plus size={22} strokeWidth={3} />
      </div>
      <span className="pl-2 text-bg-primary text-base lg:text-lg font-medium">
        Add
      </span>
    </div>
  );

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-svh pb-96">
      {/* CHECKLISTS Section */}
      <div className="px-4 pt-40 lg:pt-40 lg:text-start max-w-[1200px] mx-auto pb-7 lg:pb-60 flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
          <div className="flex gap-4 items-center">
            <Button variant="outline" size="icon" asChild>
              <Link href={"/pregnancy-overview"}>
                <CornerDownLeft />
              </Link>
            </Button>
            <p className="text-foreground  font-semibold text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight">
              CHECKLISTS
            </p>
          </div>

          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Finalized Tasks Button */}
            <Link
              href="/check-lists/finalized"
              className="inline-block flex-1 sm:flex-initial"
            >
              <Button
                variant="outline"
                size="lg"
                className="group relative overflow-hidden w-full sm:w-auto
               bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500
               dark:from-emerald-500 dark:via-teal-500 dark:to-cyan-600
               hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-600
               dark:hover:from-emerald-400 dark:hover:via-teal-400 dark:hover:to-cyan-500
               border-0 shadow-md sm:shadow-lg shadow-emerald-500/30
               hover:shadow-lg sm:hover:shadow-xl hover:shadow-emerald-500/40
               hover:scale-[1.02] sm:hover:scale-105 active:scale-95
               transition-all duration-300 ease-out
               h-9 xs:h-10 sm:h-11 md:h-12 lg:h-13
               px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7
               text-xs xs:text-sm sm:text-base lg:text-lg
               font-semibold sm:font-bold text-white
               min-w-[80px] sm:min-w-[120px]"
              >
                {/* Animated gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    -translate-x-full group-hover:translate-x-full 
                    transition-transform duration-1000 ease-in-out"
                />

                {/* Subtle pulse effect */}
                <div
                  className="absolute inset-0 rounded-lg bg-white/20 
                    opacity-0 group-hover:opacity-100 
                    animate-pulse transition-opacity duration-300"
                />

                <span className="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5">
                  {/* Animated checkmark icon */}
                  <span className="relative flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 
                     transform transition-all duration-300
                     group-hover:rotate-12 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    {/* Sparkle effect - hidden on very small screens */}
                    <span
                      className="hidden xs:block absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full
                         opacity-0 group-hover:opacity-100 
                         group-hover:animate-ping transition-opacity"
                    />
                  </span>

                  {/* Responsive text */}
                  <span className="tracking-wide drop-shadow-sm whitespace-nowrap">
                    Finalized Tasks
                  </span>

                  {/* Arrow indicator - hidden on mobile */}
                  <svg
                    className="hidden sm:block w-3 h-3 md:w-4 md:h-4 
                   transition-all duration-300 
                   group-hover:translate-x-1 opacity-80 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>

                {/* Bottom glow effect - only on larger screens */}
                <div
                  className="hidden sm:block absolute -bottom-1 left-1/2 -translate-x-1/2 
                    w-3/4 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent
                    opacity-0 group-hover:opacity-100 blur-sm
                    transition-opacity duration-300"
                />
              </Button>
            </Link>

            {/* Only allow dialog if logged in */}
            <div className="flex-1 sm:flex-initial">
              {isAuthenticated ? (
                <AppDialog
                  dialogContentProps={{
                    className: "max-w-[95vw] sm:max-w-2xl lg:max-w-4xl",
                  }}
                  title="Add Checklist"
                  customTrigger={AddChecklistTrigger}
                >
                  {(close) => (
                    <ChecklistForm
                      onSubmitForDialogAndRefetch={async () => {
                        await refetch();
                        close();
                      }}
                    />
                  )}
                </AppDialog>
              ) : (
                AddChecklistTrigger
              )}
            </div>
            <div></div>
          </div>
        </div>

        <CheckListItem
          checklistItems={checklists}
          onDeleteAction={(item: any) => {
            setFormData({ type: "delete", id: item._id });
          }}
          onEditAction={(item: any) => {
            setFormData({
              type: "update",
              id: item._id,
              data: item,
            });
          }}
        />
        {meta && meta.last_page > 1 && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page} // ← Changed from meta.total to meta.last_page
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <AlertDialog
        open={formData.type == "delete"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              checklist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                deleteChecklist(
                  { id: formData.id },
                  {
                    onSuccess: async (data) => {
                      await refetch();
                      toast.success("Check list deleted successfully");
                      setFormData({ type: "default", id: "" });
                    },
                    onError(error) {
                      setFormData({ type: "default", id: "" });
                    },
                  }
                );
              }}
              disabled={isPendingDeleteChecklist}
            >
              {isPendingDeleteChecklist ? "Loading..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={formData.type == "update"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left">Update Checklist</DialogTitle>
          </DialogHeader>
          <ChecklistForm
            onSubmitForDialogAndRefetch={async () => {
              await refetch();
              setFormData({ type: "default", id: "" });
            }}
            formData={formData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
