"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleX,
  Eye,
  Flag,
  PlusIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import ChecklistForm from "@/app/checklistor/_component/CheckListForm";
import TaskForm from "@/app/checklistor/_component/TaskForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { CheckListsProps } from "../_types/checklists_component_types";
import { Checklist, ChecklistItem } from "../_types/pregnancy_overview_types";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { useMutationToggleChecklist } from "@/app/checklistor/_api/mutations/UseMutationToggleChecklist";
import { useMutationDeleteChecklist } from "@/app/checklistor/_api/mutations/UseMutationDeleteChecklist";
import { useMutationUpdateItem } from "@/app/checklistor/_api/mutations/UseMutationUpdateItem";
import { useMutationDeleteItem } from "@/app/checklistor/_api/mutations/UseMutationDeleteItem";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { CheckBox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { sv } from "date-fns/locale";

export default function OverviewChecklist({
  checkLists,
  count,
}: CheckListsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useCurrentUser();
  const filterCompletedLists = (checklists: Checklist[]) => {
    return checklists.filter((list) => {
      const hasItems = list.items && list.items.length > 0;
      const allChecked = list.items.every((item) => item.checked);
      return !(hasItems && allChecked);
    });
  };

  const [lists, setLists] = useState<Checklist[]>(
    filterCompletedLists(checkLists || [])
  );
  const [formData, setFormData] = useState<{
    type: "default" | "create" | "update" | "delete";
    id: string;
  }>({
    type: "default",
    id: "",
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);
  const [editingList, setEditingList] = useState<any | null>(null);

  const [addTaskStep, setAddTaskStep] = useState<"select-list" | "form">(
    "select-list"
  );
  const [selectedChecklistIdForTask, setSelectedChecklistIdForTask] =
    useState<string>("");

  // Sync state with props when checkLists changes
  useEffect(() => {
    if (checkLists) {
      const filtered = filterCompletedLists(checkLists);
      if (isNewlyCreated) {
        const currentIds = new Set(lists.map((l) => l._id));
        const newIndex = checkLists.findIndex((l) => !currentIds.has(l._id));

        if (newIndex !== -1) {
          setOpenItem(checkLists[newIndex]._id);
        }
        setIsNewlyCreated(false);
      }
      setLists(filtered);
    }
  }, [checkLists, isNewlyCreated]);

  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<{
    task: {
      id: string;
      name: string;
      checked: boolean;
      priority: string;
      assignedTo: string;
      description: string;
      date: string | undefined;
      reminder: string | boolean | null | undefined;
    };
    checklist_id: string;
    owned: boolean;
  } | null>(null);
  const [isListTaskOpen, setIsListTaskOpen] = useState<{
    task: {
      id: string;
      name: string;
      checked: boolean;
      priority: string;
      assignedTo: string;
      description: string;
      date: string | undefined;
      reminder: string | boolean | null | undefined;
    };
    checklist_id: string;
    owned: boolean;
  } | null>(null);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const { mutate: deleteChecklist, isPending: isPendingDelete } =
    useMutationDeleteChecklist();
  const { mutate: updateItem } = useMutationUpdateItem();
  const { mutate: deleteItem, isPending: isDeletingItem } =
    useMutationDeleteItem();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data?.roles?.[0]?.name === "partner") {
            setIsPartner(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Open the first item by default if available
  const [openItem, setOpenItem] = useState<string | undefined>(
    lists && lists.length > 0 ? lists[0]._id : undefined
  );

  const handleToggle = (itemId: string) => {
    setToggleLoading(itemId);
    toggleChecklist(
      { id: itemId },
      {
        onSuccess: () => {
          toast.success(t("checklists.toggleSuccess"));
          setLists((prevLists: Checklist[]) => {
            const updated = prevLists.map((list: Checklist) => ({
              ...list,
              items: list.items.map((item: ChecklistItem) =>
                item._id === itemId
                  ? {
                      ...item,
                      checked: !item.checked,
                      is_completed: !(item.checked ?? item.is_completed),
                    }
                  : item
              ),
            }));

            return filterCompletedLists(updated);
          });
          setToggleLoading(null);
        },
        onError: () => {
          toast.error(t("checklists.failedToUpdate"));
          setToggleLoading(null);
        },
      }
    );
  };

  const handleEditList = (list: Checklist) => {
    setEditingList(list);
  };

  return (
    <div className="px-4 sm:pt-8 lg:pt-10 space-y-6 max-w-4xl mx-auto pb-7 lg:pb-15">
      {/* Buttons Header */}
      {user?.roles?.[0]?.name !== "partner" && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant="softPurple"
            className="sm:w-auto w-full rounded-full text-lg font-semibold px-16 shadow-none bg-[#A67EEA] hover:bg-[#8B5CF6] font-poppins"
            onClick={() => setFormData({ type: "create", id: "" })}
          >
            {t("checklists.addList")} +
          </Button>
          <Button
            variant="outline"
            className="sm:w-auto w-full rounded-full text-lg font-semibold justify-center px-16 text-primary bg-white hover:bg-white/10 shadow-none border font-poppins"
            onClick={() => {
              if (lists && lists.length > 0) {
                setAddTaskStep("select-list");
                // default to current open item or first item
                const initialId = openItem || lists?.[0]?._id;
                setSelectedChecklistIdForTask(initialId || "");
                setIsAddTaskOpen(true);
              } else {
                toast.error(t("checklists.noListError"));
              }
            }}
          >
            {t("checklists.addTask")} +
          </Button>
        </div>
      )}

      {/* Checklist Container */}
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="w-full space-y-4"
      >
        {lists?.map((list) => {
          const taskCount = list.items?.length || 0;
          const completedCount =
            list.items?.filter((item) => item.checked ?? item.is_completed)
              .length || 0;

          return (
            <AccordionItem
              key={list._id}
              value={list._id}
              className="border border-checklist-border rounded-md overflow-hidden"
            >
              <div className="flex flex-wrap bg-bg-checklist px-4 sm:px-6 py-3 sm:py-4 rounded-t-md border border-checklist-border items-center justify-between gap-1 sm:gap-2 font-poppins font-semibold text-primary-dark">
                <div className="flex items-center font-medium sm:font-semibold">
                  <span className="text-[15px] sm:text-[22px] truncate max-w-[140px] sm:max-w-none">
                    {list.title}
                  </span>
                  {user?.roles?.[0]?.name !== "partner" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditList(list);
                      }}
                      className="ml-0 sm:ml-2 cursor-pointer bg-transparent rounded-full"
                    >
                      <SquarePen className="p-2 text-[#A9A9AD] pointer-events-none size-9 shrink-0 transition-transform duration-200" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="rounded-full bg-[#E8E4F8] py-1.5 px-2.5 text-[13px] font-inter font-medium h-fit text-[#7B6FB8] shrink-0">
                    {completedCount} / {taskCount}
                  </span>
                  <AccordionTrigger>
                    <ChevronDown className="bg-[#E8E4F8] rounded-full p-2 md:ml-4 text-[#7B6FB8] pointer-events-none size-9 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                </div>
              </div>

              <AccordionContent className="pb-0 bg-white">
                <div className="border-t border-t-checklist-border" />

                {list.items?.map((item: ChecklistItem, itemIdx: number) => {
                  const isItemChecked = !!(item.checked ?? item.is_completed);

                  return (
                    <div
                      key={item._id || itemIdx}
                      className={cn(
                        "border-none transition-colors duration-200",
                        itemIdx % 2 === 0 ? "" : "bg-[#FAFAFA]",
                        isItemChecked && "bg-[#F0FDF4]"
                      )}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-5">
                        <div className="size-7 flex items-center justify-center shrink-0 cursor-pointer">
                          {toggleLoading === item._id && isPending ? (
                            <Spinner variant="circle" className="size-5" />
                          ) : (
                            <CheckBox
                              checked={isItemChecked}
                              onCheckedChange={() => handleToggle(item._id)}
                              className={cn(
                                "size-7 transition-all duration-200",
                                isItemChecked
                                  ? "!bg-[#22C55E] !border-[#22C55E] text-white"
                                  : "border-2 border-gray-300 bg-white"
                              )}
                            />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[#1B1343] text-sm sm:text-[20px] font-medium transition-all duration-200 truncate",
                            isItemChecked &&
                              "line-through text-gray-400 opacity-60"
                          )}
                        >
                          {item.title}
                        </span>

                        <div className="ml-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
                          <div
                            onClick={() =>
                              setIsDetailOpen({
                                task: {
                                  id: item._id,
                                  name: item.title,
                                  checked: isItemChecked,
                                  priority: item.priority || "",
                                  assignedTo: item.assigned_to || "none",
                                  description: item.description || "",
                                  date: item.due_date,
                                  reminder: item.reminder ?? false,
                                },
                                checklist_id: list._id,
                                owned: list.owned ?? true,
                              })
                            }
                            className="size-7 rounded-full border border-[#A67EEA]/40 flex items-center justify-center text-[#A67EEA] hover:bg-[#A67EEA] hover:text-white transition-all shrink-0"
                          >
                            <Eye className="size-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!list.items || list.items.length === 0) && (
                  <div className="py-8 text-center text-gray-500 italic">
                    {t("checklists.noItems")}
                  </div>
                )}

                {user?.roles?.[0]?.name !== "partner" && (
                  <div className="w-full bg-bg-checklist px-3 md:px-[18px] py-[15px] flex items-center justify-between md:justify-end gap-1 sm:gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      className="flex-1 md:flex-none md:shrink-0 shadow-none bg-[#F4EEFC] text-[#6035C1] font-medium md:font-semibold hover:bg-transparent text-sm sm:text-lg px-2 sm:py-[14px] sm:px-6 border border-[#BAA8EA] rounded-[5px]"
                      onClick={() => {
                        setIsAddTaskOpen(true);
                        setAddTaskStep("form");
                        setSelectedChecklistIdForTask(list._id);
                      }}
                    >
                      <span>{t("checklists.addTask")}</span>
                      <PlusIcon
                        className="bg-[#6035C1] size-5 md:size-7 p-1.5 rounded-full text-white sm:ml-2"
                        stroke="white"
                        strokeWidth={3}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 md:flex-none md:shrink-0 hover:bg-red-50 shadow-none bg-[#F6F6FA] text-[#8F8DAB] justify-center font-medium md:font-semibold text-sm sm:text-lg px-2 sm:py-[14px] sm:px-6 border border-[#DFDEEA] rounded-[5px]"
                      onClick={() => setDeleteId(list._id)}
                      disabled={isPendingDelete}
                    >
                      <span>{t("checklists.deleteList")}</span>
                      <div className="size-5 md:w-6 md:h-6 flex items-center justify-center rounded-full bg-[#8F8DAB]">
                        <Trash2 className="size-3 text-white" />
                      </div>
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}

        {(!lists || lists.length === 0) && (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50 rounded-2xl">
            {t("checklists.noChecklistsForWeek")}
          </div>
        )}
      </Accordion>
      {/* </div> */}

      {/* See All Button */}
      <div className="flex justify-center pt-4">
        <Link href="/checklistor" className="w-full">
          <Button className="w-full justify-center rounded-full text-xl font-semibold bg-[#A67EEA] hover:bg-[#8B5CF6] shadow-xl border-none text-white transition-all transform hover:-translate-y-1">
            {t("checklists.seeAll")} <ChevronRight className="ml-2 size-6" />
          </Button>
        </Link>
      </div>

      <Dialog
        open={formData.type == "create"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-left">
              {t("checklists.addChecklist")}
            </DialogTitle>
          </DialogHeader>
          <ChecklistForm
            onSubmitForDialogAndRefetch={async () => {
              setIsNewlyCreated(true);
              router.refresh();
              setFormData({ type: "default", id: "" });
            }}
            formData={formData}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddTaskOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddTaskOpen(false);
            setAddTaskStep("select-list");
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-full sm:max-w-5xl p-0 border-none bg-white rounded-2xl shadow-none max-h-[95vh] overflow-y-auto"
        >
          <DialogTitle className="sr-only">
            {t("checklists.addTask")}
          </DialogTitle>

          {addTaskStep === "select-list" ? (
            <div className="p-6 pt-10 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-poppins font-semibold text-[#3D3177]">
                  {t("checklists.form.selectCategory")}
                </DialogTitle>
              </DialogHeader>

              <RadioGroup
                value={selectedChecklistIdForTask}
                onValueChange={setSelectedChecklistIdForTask}
                className="space-y-3"
              >
                {lists.map((list) => (
                  <div
                    key={list._id}
                    className="flex items-center space-x-3 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all cursor-pointer has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 shadow-sm"
                  >
                    <RadioGroupItem value={list._id} id={list._id} />
                    <label
                      htmlFor={list._id}
                      className="flex-1 text-lg font-medium text-[#3D3177] cursor-pointer"
                    >
                      {list.title}
                    </label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                className="w-full h-12 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 mt-4"
                onClick={() => setAddTaskStep("form")}
              >
                {t("common.next")}
              </Button>
            </div>
          ) : (
            <>
              <div className="px-5 sm:px-[30px] py-5 border-b flex items-center justify-between border-b-[#F0EDF8]">
                <h3 className="text-xl sm:text-[30px] text-[#3D3177] font-semibold">
                  {t("checklists.taskForm.createTask")}
                </h3>
                <CircleX
                  className="shrink-0 size-8 cursor-pointer text-black"
                  onClick={() => {
                    setIsAddTaskOpen(false);
                    setAddTaskStep("select-list");
                  }}
                />
              </div>
              <TaskForm
                checklist_id={selectedChecklistIdForTask}
                onClose={() => {
                  setIsAddTaskOpen(false);
                  setAddTaskStep("select-list");
                }}
                refetch={() => {
                  router.refresh();
                  setIsAddTaskOpen(false);
                  setAddTaskStep("select-list");
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog
        open={Boolean(editingList)}
        onOpenChange={() => setEditingList(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left">
              {t("checklists.editChecklist")}
            </DialogTitle>
          </DialogHeader>
          <ChecklistForm
            onSubmitForDialogAndRefetch={async () => {
              router.refresh();
              setEditingList(null);
            }}
            formData={{
              type: "update",
              id: editingList?._id || "",
              data: editingList
                ? {
                    _id: editingList._id,
                    title: editingList.title,
                    description: editingList.description,
                    category: editingList.category,
                    is_active: editingList.is_active,
                  }
                : undefined,
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={!!isDetailOpen} onOpenChange={() => setIsDetailOpen(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] overflow-y-auto w-full lg:max-w-[672px] rounded-2xl bg-white p-0"
        >
          {isDetailOpen && (
            <div>
              <div className="px-5 sm:px-[30px] py-5 border-b flex items-center justify-between border-b-[#F0EDF8]">
                <DialogTitle asChild>
                  <h3 className="text-xl sm:text-[30px] text-[#3D3177] font-semibold">
                    {isDetailOpen.task.name}
                  </h3>
                </DialogTitle>
                <CircleX
                  className="shrink-0 size-8 cursor-pointer text-black"
                  onClick={() => setIsDetailOpen(null)}
                />
              </div>
              <div className="px-5 sm:px-8 py-6">
                {isDetailOpen.task?.description && (
                  <p className="text-base font-normal text-[#1B1343] mb-6">
                    {isDetailOpen.task.description}
                  </p>
                )}
                <div className="space-y-3">
                  <div className="w-full px-4 py-[17px] flex items-center justify-between gap-3 rounded-[5px] border border-[#F3EAFF]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="text-[#A97AEC] shrink-0" />
                      <span className="text-sm md:text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        {t("checklists.taskForm.dueDate")}
                      </span>
                    </div>
                    {isDetailOpen.task.date ? (
                      <p className="text-base font-semibold text-[#3D3177]">
                        {format(isDetailOpen.task.date, "do LLL RRRR", {
                          locale: sv,
                        })}
                      </p>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {t("checklists.taskForm.none")}
                      </span>
                    )}
                  </div>
                  <div className="w-full px-4 py-[17px] flex items-center justify-between gap-3 rounded-[5px] border border-[#F3EAFF]">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_4022_3329)">
                          <path
                            d="M7.8125 13.5417C6.8854 13.5417 5.97912 13.2668 5.20826 12.7517C4.43741 12.2366 3.8366 11.5045 3.48181 10.648C3.12703 9.79147 3.0342 8.84897 3.21507 7.93968C3.39594 7.0304 3.84238 6.19516 4.49794 5.53961C5.1535 4.88405 5.98873 4.43761 6.89801 4.25674C7.8073 4.07587 8.7498 4.1687 9.60633 4.52348C10.4629 4.87827 11.1949 5.47908 11.71 6.24993C12.2251 7.02079 12.5 7.92707 12.5 8.85417C12.4986 10.0969 12.0043 11.2884 11.1255 12.1672C10.2468 13.046 9.05528 13.5403 7.8125 13.5417ZM15.625 20.8333C15.6233 19.4525 15.0741 18.1287 14.0977 17.1523C13.1213 16.1759 11.7975 15.6267 10.4167 15.625H5.20833C3.82751 15.6267 2.50371 16.1759 1.52731 17.1523C0.550919 18.1287 0.00165402 19.4525 0 20.8333L0 25H15.625V20.8333ZM18.2292 9.375C17.3021 9.375 16.3958 9.10008 15.6249 8.58502C14.8541 8.06995 14.2533 7.33786 13.8985 6.48133C13.5437 5.6248 13.4509 4.6823 13.6317 3.77302C13.8126 2.86373 14.259 2.0285 14.9146 1.37294C15.5702 0.71738 16.4054 0.270939 17.3147 0.0900711C18.224 -0.0907971 19.1665 0.00203103 20.023 0.356817C20.8795 0.711603 21.6116 1.31241 22.1267 2.08327C22.6417 2.85412 22.9167 3.7604 22.9167 4.6875C22.9153 5.93028 22.421 7.12176 21.5422 8.00054C20.6634 8.87932 19.4719 9.37362 18.2292 9.375ZM19.7917 11.4583H14.5833C14.4005 11.4667 14.2183 11.4852 14.0375 11.5135C13.6588 12.3899 13.0994 13.1765 12.3958 13.8219C13.9232 14.2541 15.2682 15.1723 16.2268 16.4375C17.1854 17.7028 17.7056 19.246 17.7083 20.8333H25V16.6667C24.9983 15.2858 24.4491 13.962 23.4727 12.9856C22.4963 12.0093 21.1725 11.46 19.7917 11.4583Z"
                            fill="#A97AEC"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_4022_3329">
                            <rect width="25" height="25" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="text-sm md:text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        {t("checklists.taskForm.assignedTo")}
                      </span>
                    </div>
                    {isDetailOpen.task.assignedTo !== "none" &&
                    isDetailOpen.task.assignedTo ? (
                      isDetailOpen.task.assignedTo !== "both" ? (
                        <Badge
                          className={cn(
                            "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none bg-[#E6DBFD] text-base text-[#3D3177]"
                          )}
                        >
                          {isDetailOpen.task.assignedTo === "me"
                            ? "Mig"
                            : "Partner"}
                        </Badge>
                      ) : (
                        <Badge
                          className={cn(
                            "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none bg-[#E6DBFD] text-base text-[#3D3177]"
                          )}
                        >
                          Både
                        </Badge>
                      )
                    ) : (
                      <span className="text-sm text-gray-400">
                        {t("checklists.taskForm.none")}
                      </span>
                    )}
                  </div>
                  <div className="w-full px-4 py-[17px] flex items-center justify-between gap-3 rounded-[5px] border border-[#F3EAFF]">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src="/flag.png"
                        width={700}
                        height={700}
                        alt="flag"
                        className="h-5 w-5 object-cover"
                      />
                      <span className="text-sm md:text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        {t("checklists.taskForm.priority")}
                      </span>
                    </div>
                    {isDetailOpen.task.priority ? (
                      <Badge
                        className={cn(
                          "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none bg-[#E6DBFD] text-base text-[#3D3177]"
                        )}
                      >
                        {t(isDetailOpen.task.priority)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {t("checklists.taskForm.none")}
                      </span>
                    )}
                  </div>
                  {!isDetailOpen.task.checked && (
                    <div className="w-full flex items-center justify-center gap-3">
                      <button
                        type="button"
                        disabled={isDetailOpen.owned === false}
                        onClick={() => {
                          if (!isDetailOpen || isDetailOpen.owned === false)
                            return;
                          const newReminder = !isDetailOpen.task.reminder;
                          updateItem(
                            {
                              id: isDetailOpen.task.id,
                              data: {
                                checklist_id: isDetailOpen.checklist_id,
                                title: isDetailOpen.task.name,
                                priority: isDetailOpen.task.priority || "high",
                                assigned_to:
                                  isDetailOpen.task.assignedTo === "none"
                                    ? "both"
                                    : isDetailOpen.task.assignedTo,
                                due_date: isDetailOpen.task.date
                                  ? new Date(isDetailOpen.task.date)
                                  : new Date(),
                                description:
                                  isDetailOpen.task.description || "",
                                reminder: newReminder,
                              } as any,
                            },
                            {
                              onSuccess: () => {
                                setIsDetailOpen((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        task: {
                                          ...prev.task,
                                          reminder: newReminder,
                                        },
                                      }
                                    : null
                                );
                              },
                              onError: () => {
                                toast.error(t("checklists.failedToUpdate"));
                              },
                            }
                          );
                        }}
                        className={cn(
                          "w-full sm:max-w-[360px] flex items-center justify-center gap-3.5 border border-[#A97AEC] py-2 md:py-3 rounded-md transition-all",
                          isDetailOpen.task.reminder
                            ? "bg-[#A855F7] text-white hover:bg-[#9333EA] border-[#A855F7]"
                            : "bg-white text-[#A97AEC] hover:bg-purple-50",
                          isDetailOpen.owned === false &&
                            "opacity-60 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        <div
                          className={cn(
                            "size-7 md:size-8 rounded-full flex items-center justify-center shrink-0",
                            isDetailOpen.task.reminder
                              ? "bg-white/20 text-white"
                              : "border-[#A855F7] text-[#A855F7]"
                          )}
                        >
                          <Bell
                            className={cn(
                              "size-5 md:size-6",
                              isDetailOpen.task.reminder
                                ? "text-white"
                                : "text-[#A855F7]"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-base md:text-lg font-normal w-fit shrink-0",
                            isDetailOpen.task.reminder
                              ? "text-white"
                              : "text-[#A97AEC]"
                          )}
                        >
                          {isDetailOpen.task.reminder
                            ? t("checklists.taskForm.reminderSet")
                            : t("checklists.taskForm.setReminder")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!isDetailOpen.task.checked && (
                <div className="w-full flex flex-row items-center gap-1 md:gap-2.5 px-2 sm:px-5 lg:px-8 py-4 md:py-6 border-t border-[#F0EDF8]">
                  <Button
                    onClick={() => {
                      handleToggle(isDetailOpen.task.id);
                      setIsDetailOpen(null);
                    }}
                    className="w-auto px-1 py-1.5 flex-1 rounded-[5px] bg-[#F2FCF6] border border-[#82CDA8] text-[#0FBD23] text-xs md:text-lg font-medium hover:bg-[#E6F9ED]"
                  >
                    {t("checklists.taskForm.markComplete")}
                    <div className="size-5 sm:w-[28px] sm:h-[28px] bg-[#0FBD23] rounded-full flex items-center justify-center">
                      <Check className="size-3 sm:size-5 text-white" />
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsListTaskOpen(isDetailOpen);
                      setIsDetailOpen(null);
                    }}
                    className="w-auto px-1 py-1.5 flex-1 rounded-[5px] bg-[rgb(244,238,252)] border border-[#BAA8EA] text-[#6035C1] text-xs md:text-lg font-medium hover:bg-[#EBE0F9]"
                  >
                    {t("checklists.taskForm.markEdit")}
                    <div className="size-5 sm:w-[28px] sm:h-[28px] bg-[#6035C1] rounded-full flex items-center justify-center">
                      <SquarePen className="size-3 sm:size-5 text-white" />
                    </div>
                  </Button>
                  {!isPartner && (
                    <Button
                      onClick={() => {
                        setIsDeleteTaskOpen(true);
                      }}
                      className="w-auto px-1 py-1.5 flex-1 rounded-[5px] bg-[#FEF2F2] border border-[#F99F9D] text-[#F14B4C] text-xs md:text-lg font-medium hover:bg-[#FDE5E5]"
                    >
                      {t("checklists.taskForm.markDelete")}
                      <div className="size-5 sm:w-[28px] sm:h-[28px] bg-[#E7000B] rounded-full flex items-center justify-center">
                        <Trash2 className="size-3 sm:size-5 text-white" />
                      </div>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Edit Dialog */}
      <Dialog
        open={!!isListTaskOpen}
        onOpenChange={() => setIsListTaskOpen(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl p-0 border-none bg-white rounded-2xl shadow-none"
        >
          {isListTaskOpen && (
            <div>
              <div className="px-5 sm:px-[30px] py-5 border-b flex items-center justify-between border-b-[#F0EDF8]">
                <DialogTitle asChild>
                  <h3 className="text-xl sm:text-[30px] text-[#3D3177] font-semibold">
                    {isListTaskOpen.task.name}
                  </h3>
                </DialogTitle>
                <CircleX
                  className="shrink-0 size-8 cursor-pointer text-black"
                  onClick={() => setIsListTaskOpen(null)}
                />
              </div>
              <TaskForm
                checklist_id={isListTaskOpen.checklist_id}
                task={isListTaskOpen.task}
                onClose={() => setIsListTaskOpen(null)}
                refetch={() => {
                  router.refresh();
                  setIsListTaskOpen(null);
                }}
                readOnly={isListTaskOpen.owned === false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Checklist Alert */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("checklists.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("checklists.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="justify-center"
              disabled={isPendingDelete}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) {
                  deleteChecklist(
                    { id: deleteId },
                    {
                      onSuccess: () => {
                        setDeleteId(null);
                        router.refresh();
                      },
                    }
                  );
                }
              }}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? t("common.loading") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Alert */}
      <AlertDialog open={isDeleteTaskOpen} onOpenChange={setIsDeleteTaskOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("checklists.taskForm.deleteConfirm.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("checklists.taskForm.deleteConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="justify-center"
              disabled={isDeletingItem}
            >
              {t("checklists.taskForm.deleteConfirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={(e) => {
                e.preventDefault();
                if (isDetailOpen?.task.id) {
                  deleteItem(isDetailOpen.task.id, {
                    onSuccess: () => {
                      setIsDeleteTaskOpen(false);
                      setIsDetailOpen(null);
                      router.refresh();
                    },
                  });
                }
              }}
              disabled={isDeletingItem}
            >
              {isDeletingItem
                ? t("common.loading")
                : t("checklists.taskForm.deleteConfirm.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
