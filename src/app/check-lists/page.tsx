"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  CircleCheck,
  CircleQuestionMark,
  ListTodo,
  Plus,
  Sparkles,
} from "lucide-react";
import ChecklistForm from "./_component/CheckListForm";
import { AppDialog } from "@/components/base/AppDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { useQueryGetAllMyChecklists } from "./_api/queries/useQueryGetAllMyChecklists";
import { Button } from "@/components/ui/Button";
import { useMutationDeleteChecklist } from "./_api/mutations/UseMutationDeleteChecklist";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  Dialog,
  DialogContent,
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
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverallProgress from "@/components/ui/overall-progress";
import ActiveChecklist from "./_active-checklist/ActiveChecklist";

export default function CheckLists() {
  const [activeTab, setActiveTab] = useState("active");

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
          toast.warning(t("checklists.loginToAdd"));
        }
      }}
      className={`flex items-center border bg-soft-white border-gray rounded-full px-4 py-2 transition w-auto hover:opacity-90 ${
        isAuthenticated
          ? "cursor-pointer hover:bg-purple-50"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <span className="pr-2 text-primary text-base lg:text-lg font-medium">
        {t("checklists.addNew")}
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
      <div className="">
        <div className="flex flex-col items-center justify-center mb-14">
          {/* Section Label */}
          <IconHeading
            text={t("checklists.label")}
            image="/images/icons/baby-gift2.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("checklists.title")}
          </SectionHeading>
          <p className="max-w-lg text-center">{t("checklists.subtitle")}</p>
        </div>

        {/* CHECKLISTS Section */}
        <Tabs
          value={activeTab}
          defaultValue="active"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="max-w-5xl mx-auto  pt-10 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-10 sm:gap-4 mb-8">
              <div className="">
                <h3 className="text-3xl font-semibold">
                  {t("checklists.title")}
                </h3>
                <span className="font-outfit">
                  {t("checklists.description")}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3">
                <TabsList
                  variant="pill"
                  className="bg-white shadow-sm border border-white text-primary"
                >
                  <TabsTrigger
                    value="active"
                    variant="pill"
                    className="group/trigger py-2 px-3"
                  >
                    {t("threads.active")}
                    <div className="size-8 p-1.5 rounded-full bg-primary text-white group-data-[state=active]/trigger:bg-white group-data-[state=active]/trigger:text-primary!">
                      <ListTodo className="size-full" />
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="finalized"
                    variant="pill"
                    className="group/trigger py-2"
                  >
                    {t("threads.finalized")}
                    <div className="size-8 p-1.5 rounded-full  bg-primary text-white group-data-[state=active]/trigger:bg-white group-data-[state=active]/trigger:text-primary!">
                      <CircleCheck className="size-full" />
                    </div>
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant={"outline"}
                  className="px-4"
                  onClick={() => setFormData({ type: "create", id: "" })}
                >
                  {t("threads.addNewList")}
                  <div className="">
                    <Plus className="size-full" />
                  </div>
                </Button>
                <Button variant={"ghost"} className="px-2">
                  {t("threads.addTemplate")}
                  <div className="">
                    <Sparkles className="size-full" />
                  </div>
                </Button>
                {/* <Link
                      href="/check-lists/finalized"
                      className="inline-block flex-1 sm:flex-initial"
                      >
                      <Button size="default">
                        <span className="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5">
                          <span className="tracking-wide text-lg drop-shadow-sm whitespace-nowrap">
                            {t("checklists.finalizedTasks")}
                          </span>
                          <ChevronRight size="3" />
                        </span>
                      </Button>
                    </Link> */}

                {/* <div>
                  {isAuthenticated ? (
                    <AppDialog
                      dialogContentProps={{
                        className:
                          "max-h-[80vh] overflow-y-auto max-w-[95vw] sm:max-w-2xl lg:max-w-4xl",
                      }}
                      title={t("checklists.addChecklist")}
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
                </div> */}
              </div>
            </div>
            <TabsContent value="active" className="m-0 flex flex-col gap-2">
              <ActiveChecklist />
            </TabsContent>
            <TabsContent value="finalized" className="m-0 flex flex-col gap-2">
              Finalized
            </TabsContent>

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
        </Tabs>
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
                {isPendingDeleteChecklist
                  ? t("checklists.loading")
                  : t("common.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog
          open={formData.type == "create"}
          onOpenChange={() => setFormData({ type: "default", id: "" })}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-left">
                {t("checklists.addChecklist")}
              </DialogTitle>
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
        <Dialog
          open={formData.type == "update"}
          onOpenChange={() => setFormData({ type: "default", id: "" })}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-left">
                {t("checklists.updateChecklist")}
              </DialogTitle>
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
