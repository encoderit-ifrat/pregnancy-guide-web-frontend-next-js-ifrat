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
import { AppDialog } from "@/components/base/AppDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
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
import {
  useQueryGetAllMyChecklists,
  useQueryGetAllMyCompletedChecklists,
} from "../_api/queries/useQueryGetAllMyChecklists";
import { useMutationToggleChecklist } from "../_api/mutations/UseMutationToggleChecklist";
import { useMutationDeleteChecklist } from "../_api/mutations/UseMutationDeleteChecklist";
import Loading from "@/app/loading";
import ChecklistForm from "../_component/CheckListForm";
import Link from "next/link";
import { ChecklistFormData } from "../_types/checklist_page_types";
import { ChecklistItemWithItems } from "../_types/checklist_item_types";
import { PageContainer } from "@/components/layout/PageContainer";
import CheckListItem from "@/app/check-lists/_component/CheckListItem";
import {SectionHeading} from "@/components/ui/text/SectionHeading";

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
  const { data, isLoading, refetch, isFetching } =
    useQueryGetAllMyCompletedChecklists({
      params: {
        id: queryID ?? "",
        page: page,
      },
    });
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const { mutate: deleteChecklist, isPending: isPendingDeleteChecklist } =
    useMutationDeleteChecklist();
  const { data: checklists, pagination: meta } = data?.data ?? {};
  const [filteredLists, setFilterLists] = useState(() => checklists);
  useEffect(() => {
    setFilterLists(checklists);
  }, [checklists]);
  function handleChecklistToggle(id: string) {
    setToggleLoading(id);
    toggleChecklist(
      { id },
      {
        onSuccess(res) {
          toast.success("Checklist updated successfully.");
          setFilterLists((old: ChecklistItemWithItems[] | undefined) =>
            (old ?? []).map((item: ChecklistItemWithItems) => {
              return {
                ...item,
                items: item.items.map(
                  (data: { _id: string; is_completed?: boolean }) => {
                    if (data._id === id) {
                      return {
                        ...data,
                        is_completed: !data.is_completed,
                      };
                    } else {
                      return data;
                    }
                  }
                ),
              };
            })
          );
          refetch();
          setToggleLoading(null);
        },
        onError(res) {
          setToggleLoading(null);
        },
      }
    );
  }
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/check-lists/finalized?${params.toString()}`);
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
      <span className="pl-4 text-bg-primary text-base lg:text-lg font-medium">
        Add Checklist
      </span>
    </div>
  );

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <div className="min-h-svh">
        {/* CHECKLISTS Section */}
        <div className="max-w-5xl mx-auto p-6 pt-10 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
            <SectionHeading variant="h3">Finalized Checklists</SectionHeading>
          </div>
          {/*<div className="flex gap-4 mb-4">*/}
          {/*  <p className="text-foreground font-semibold leading-20px text-2xl lg:text-4xl">*/}
          {/*    Finalized Checklists*/}
          {/*  </p>*/}
          {/*</div>*/}

          <CheckListItem checklistItems={filteredLists} overview={true} />
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
                account and remove your data from our servers.
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
