"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleQuestionMark,
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
import { ChecklistFormData } from "./_types/checklist_page_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import WeeklyQuestionView from "@/app/weekly-question/[id]/_components/WeeklyQuestionView";
import { PageContainer } from "@/components/layout/PageContainer";

export default function CheckLists() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryID = searchParams.get("id");
  const page = searchParams.get("page") || "1";

  const [formData, setFormData] = useState<ChecklistFormData>({
    type: "default",
    id: "",
  });
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
      className={`flex items-center border bg-soft-white border-gray rounded-full px-6 py-2 transition w-auto hover:opacity-90 ${
        isAuthenticated
          ? "cursor-pointer hover:bg-purple-50"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <span className="pr-2 text-primary text-base lg:text-lg font-medium">
        Add New
      </span>

      <div className="flex items-center justify-center text-white bg-primary rounded-full w-6 h-6 hover:bg-primary-dark transition-all">
        <Plus size={22} strokeWidth={3} />
      </div>
    </div>
  );

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <div className="min-h-svh">
        <div className="flex flex-col items-center justify-center mb-10">
          {/* Section Label */}
          <IconHeading
            text="Your Checklist"
            icon={<CircleQuestionMark />}
            className="text-primary justify-center md:justify-start"
          />
          <SectionHeading>CHECKLISTS</SectionHeading>
          <p className="max-w-lg text-center">
            Expert advice, real stories, and helpful tips to support you and
            your family at every stage.
          </p>
        </div>

        {/* CHECKLISTS Section */}
        <div className="max-w-5xl mx-auto p-4 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
            <div className="flex gap-4 items-center">
              <SectionHeading variant="h3">Checklists</SectionHeading>
            </div>

            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Finalized Tasks Button */}
              <Link
                href="/check-lists/finalized"
                className="inline-block flex-1 sm:flex-initial"
              >
                <Button size="default">
                  <span className="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5">
                    {/* Animated checkmark icon */}
                    <span className="relative flex items-center justify-center shrink-0">
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
                   group-hover:translate-x-1 opacity-80 shrink-0"
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
    </PageContainer>
  );
}
