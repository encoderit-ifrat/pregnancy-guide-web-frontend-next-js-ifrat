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
import CheckListItem from "@/app/check-lists/_component/CheckList";
import { ChecklistFormData } from "./_types/checklist_page_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverallProgress from "@/components/ui/overall-progress";
import ActiveChecklist from "./_active-checklist/ActiveChecklist";
import FinalizedChecklist from "./_finalized-checklist/FinalizedChecklist";
import TemplateModal from "./_component/TemplateModal";

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
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const { isAuthenticated } = useCurrentUser();
  const { data, isLoading, refetch, isFetching } = useQueryGetAllMyChecklists({
    params: {
      id: queryID ?? "",
      page: page,
      limit: "5",
    },
  });
  const { mutate: deleteChecklist, isPending: isPendingDeleteChecklist } =
    useMutationDeleteChecklist();
  const { data: checklists, pagination: meta } = data ?? {};
  console.log("🔍 DEBUG meta:", meta, "checklists count:", checklists?.length);
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
      className={`flex items-center border bg-soft-white border-gray rounded-full px-4 py-2 transition w-auto hover:opacity-90 ${isAuthenticated
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

  if (isLoading) {
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
          <div className="max-w-[1213px] w-full mx-auto  pt-10 md:p-10 lg:p-12 bg-soft-white shadow-2xl rounded-xl">
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
                  className="h-12 py-2 px-4 rounded-full bg-white text-primary font-medium flex items-center gap-2.5 shadow-sm hover:bg-purple-50 hover:border-purple-100 transition-all font-outfit text-base"
                  onClick={() => setFormData({ type: "create", id: "" })}
                >
                  {t("threads.addNewList")}
                  <div className="size-8 p-1.5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                </Button>
                <Button
                  variant={"ghost"}
                  className="h-12 py-2 px-4 rounded-full bg-[#FFFFFF66] text-[#A97AEC] font-medium flex items-center gap-2.5 hover:bg-[#FFFFFF99] transition-all font-outfit text-base border border-transparent hover:border-white"
                  onClick={() => setIsTemplateOpen(true)}
                >
                  {t("threads.addTemplate")}
                  <div className="size-8 p-1.5 rounded-full bg-[#A97AEC] flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles size={20} strokeWidth={2} className="text-white" />
                  </div>
                </Button>
              </div>
            </div>
            <TabsContent value="active" className="m-0 flex flex-col gap-2">
              <ActiveChecklist
                checklistItems={checklists}
                totalPages={meta?.last_page || 1}
                currentPage={Number(page)}
                refetch={refetch}
              />
            </TabsContent>
            <TabsContent value="finalized" className="m-0 flex flex-col gap-2">
              <FinalizedChecklist />
            </TabsContent>

            {/* Pagination Footer */}
            {activeTab === "active" && meta && (
              <div className="w-full max-w-3xl mx-auto mt-8 pb-4">
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
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

        <TemplateModal
          isOpen={isTemplateOpen}
          onClose={() => setIsTemplateOpen(false)}
        />
      </div>
    </PageContainer>
  );
}
