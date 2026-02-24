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
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/providers/I18nProvider";

export default function CheckLists() {
  const { t } = useTranslation();
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
          toast.success(t("checklists.toggleSuccess"));
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
          toast.warning(t("checklists.loginToAdd"));
        }
      }}
      className={`flex items-center border bg-soft-white border-gray rounded-full px-4 py-2 transition w-auto hover:opacity-90 ${isAuthenticated
        ? "cursor-pointer hover:bg-purple-50"
        : "opacity-50 cursor-not-allowed"
        }`}
    >
      <div className="flex items-center justify-center text-white bg-primary rounded-full w-10 h-10 hover:bg-primary-dark transition-all">
        <Plus size={22} strokeWidth={3} />
      </div>
      <span className="pl-4 text-bg-primary text-base lg:text-lg font-medium">
        {t("checklists.addChecklist")}
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
        <div className="max-w-5xl mx-auto  py-10 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl">
          <SectionHeading variant="h3" className="text-center  lg:text-left">
            {t("checklists.finalizedTasks")}
          </SectionHeading>

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
              <AlertDialogTitle>{t("checklists.deleteTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("checklists.deleteDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("checklists.cancel")}</AlertDialogCancel>
              <Button
                onClick={() => {
                  deleteChecklist(
                    { id: formData.id },
                    {
                      onSuccess: async (data) => {
                        await refetch();
                        toast.success(t("checklists.deleteSuccess"));
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
                {isPendingDeleteChecklist ? t("common.loading") : t("common.confirm")}
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
              <DialogTitle className="text-left">{t("checklists.updateChecklist")}</DialogTitle>
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
