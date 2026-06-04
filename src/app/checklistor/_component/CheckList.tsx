"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronDownIcon,
  Circle,
  Eye,
  Flag,
  Pencil,
  PlusIcon,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { useMutationToggleChecklist } from "../_api/mutations/UseMutationToggleChecklist";
import { useMutationDeleteChecklist } from "../_api/mutations/UseMutationDeleteChecklist";
import { useMutationUpdateItem } from "../_api/mutations/UseMutationUpdateItem";
import { useMutationDeleteItem } from "../_api/mutations/UseMutationDeleteItem";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import {
  CheckListItemProps,
  ChecklistItemWithItems,
} from "../_types/checklist_item_types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";
import { format, isPast, differenceInDays, parseISO } from "date-fns";
import { CheckBox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
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
import TaskForm from "./TaskForm";
import ChecklistForm from "./CheckListForm";
import { ChecklistFormData } from "../_types/checklist_page_types";
import api from "@/lib/axios";

// Interceptor to strip validation-blocking fields from checklist PATCH body payloads
api.interceptors.request.use((config) => {
  if (config.method === "patch" && config.url?.includes("/checklists/")) {
    if (config.data) {
      delete config.data._id;
      delete config.data.items;
      Object.keys(config.data).forEach((key) => {
        if (
          config.data[key] === undefined ||
          config.data[key] === null ||
          config.data[key] === ""
        ) {
          delete config.data[key];
        }
      });
    }
  }
  return config;
});

type Task = {
  id: string;
  name: string;
  checked: boolean;
  priority: string;
  assignedTo: string;
  description: string;
  date: string | undefined;
  reminder: string | boolean | null | undefined;
};

type Group = {
  id: string;
  name: string;
  owned: boolean | undefined;
  tasks: Task[];
};

export default function CheckList({
  checklistItems,
  overview,
  onDeleteAction,
  onEditAction,
  className,
  refetch,
  readOnly = false,
}: CheckListItemProps) {
  const { t } = useTranslation();
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const { mutate: deleteChecklist, isPending: isPendingDelete } =
    useMutationDeleteChecklist();
  const [filteredLists, setFilterLists] = useState<ChecklistItemWithItems[]>(
    checklistItems || []
  );
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChecklistFormData>({
    type: "default",
    id: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isListTaskOpen, setIsListTaskOpen] = useState<{
    task: Task;
    checklist_id: string;
    owned: boolean;
  } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<{
    task: Task;
    checklist_id: string;
    owned: boolean;
  } | null>(null);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    if (typeof window != undefined) {
      const user = localStorage.getItem("user");
      if (user) {
        const data = JSON.parse(user);
        if (data?.roles[0]?.name == "partner") {
          setIsPartner(true);
        }
      }
    }
  }, []);

  const { mutate: updateItem } = useMutationUpdateItem();
  const { mutate: deleteItem, isPending: isDeletingItem } =
    useMutationDeleteItem();

  function handleToggleReminder() {
    if (!isDetailOpen || readOnly || isDetailOpen.owned === false) return;
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
          description: isDetailOpen.task.description || "",
          reminder: newReminder,
        } as any,
      },
      {
        onSuccess: () => {
          refetch?.();
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
          toast.error("Failed to update reminder");
        },
      }
    );
  }

  // Sync filteredLists with checklistItems prop
  useEffect(() => {
    if (checklistItems) {
      setFilterLists(checklistItems);
    }
  }, [checklistItems]);

  const router = useRouter();

  // Map filteredLists (from props) to the structure expected by the UI
  const data = (filteredLists || []).map((list) => ({
    id: list._id,
    name: list.title,
    owned: list.owned,
    tasks: (list.items || []).map((item) => ({
      id: item._id,
      name: item.title,
      checked: !!(item.checked ?? item.is_completed),
      priority: item.priority || "",
      assignedTo: item.assigned_to || "none",
      description: item.description,
      date: item.due_date,
      reminder: item.reminder,
    })),
  }));

  function handleChecklistToggle(id: string) {
    setToggleLoading(id);
    toggleChecklist(
      { id },
      {
        onSuccess(res) {
          toast.success(t("checklists.toggleSuccess"));
          setFilterLists((old: ChecklistItemWithItems[]) => {
            // Update the checked status
            const updated = old.map((item: ChecklistItemWithItems) => {
              return {
                ...item,
                items: item.items.map((data) => {
                  if (data._id === id) {
                    return {
                      ...data,
                      is_completed: !data.is_completed,
                    };
                  } else {
                    return data;
                  }
                }),
              };
            });

            // Filter out checklists where all items are checked
            return updated.filter((item: ChecklistItemWithItems) => {
              const allChecked = item.items.every((itm) => itm.is_completed);
              return !allChecked;
              // Keep this checklist
            });
          });
          setToggleLoading(null);
          refetch?.();
        },
        onError(res) {
          setToggleLoading(null);
        },
      }
    );
  }

  return (
    <>
      <Accordion type="multiple" className="w-full space-y-4">
        {data.map((group: Group, index: number) => (
          <AccordionItem
            key={group.id}
            value={group.id}
            className="border border-checklist-border rounded-md overflow-hidden"
          >
            <div className="flex flex-wrap bg-bg-checklist px-4 sm:px-6 py-3 sm:py-4 rounded-t-md border border-checklist-border items-center justify-between gap-1 sm:gap-2 font-poppins font-semibold text-primary-dark">
              <div className="flex items-center font-medium sm:font-semibold">
                <span className="text-[15px] sm:text-[22px] truncate max-w-[140px] sm:max-w-none">
                  {group.name}
                </span>
                {!readOnly && group.owned !== false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const listObj = filteredLists?.find(
                        (item) => item._id === group.id
                      );
                      if (listObj) {
                        setFormData({
                          type: "update",
                          id: group.id,
                          data: {
                            _id: listObj._id,
                            title: listObj.title,
                            description: listObj.description || "",
                            category: listObj.category || "general",
                            is_active: listObj.is_active ?? true,
                            items: listObj.items?.map((item) => ({
                              _id: item._id,
                              title: item.title,
                              description: item.description || "",
                              week: item.week || 0,
                              is_completed: !!(
                                item.is_completed ?? item.checked
                              ),
                              order: item.order || 0,
                              is_optional: !!item.is_optional,
                              priority: item.priority || "none",
                              due_date: item.due_date,
                              reminder: !!item.reminder,
                              assigned_to: item.assigned_to || "none",
                            })),
                          },
                        });
                      }
                    }}
                    className="ml-0 sm:ml-2 cursor-pointer bg-transparent rounded-full"
                  >
                    <SquarePen className="p-2 text-[#A9A9AD] pointer-events-none size-9 shrink-0 transition-transform duration-200" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="rounded-full bg-[#E8E4F8] py-1.5 px-2.5 text-[13px] font-inter font-medium h-fit text-[#7B6FB8] shrink-0">
                  {group.tasks.filter((task: Task) => task.checked).length} /{" "}
                  {group.tasks.length}
                </span>
                <AccordionTrigger>
                  <ChevronDownIcon className="bg-primary-light rounded-full p-2 md:ml-4 text-primary pointer-events-none size-9 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
              </div>

              {/* <div className="hidden sm:flex items-center gap-1 text-primary font-semibold">
                  {(() => {
                    const completedTasks = group.tasks.filter(
                      (task: Task) => task.checked
                    ).length;
                    const totalTasks = group.tasks.length;
                    const percentage =
                      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    return (
                      <>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span>{percentage.toFixed(2)}%</span>
                      </>
                    );
                  })()}
                </div> */}
            </div>

            <AccordionContent className="pb-0">
              <div className="border-t border-t-checklist-border" />
              {/* TASK LEVEL */}

              {group.tasks.map((task: Task, index: number) => (
                <div
                  key={task.id}
                  className={cn(
                    "border-none transition-colors duration-200",
                    index % 2 === 0 ? "" : "bg-[#FAFAFA]",
                    task.checked && "bg-[#F0FDF4]"
                  )}
                >
                  {/* Task Header */}
                  <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-5 ">
                    {/* Checkbox */}
                    <div className="size-7 flex items-center justify-center shrink-0 cursor-pointer">
                      {toggleLoading === task.id && isPending ? (
                        <Spinner variant="circle" className="size-5" />
                      ) : (
                        <CheckBox
                          checked={task.checked}
                          onCheckedChange={() =>
                            !readOnly && handleChecklistToggle(task.id)
                          }
                          disabled={readOnly}
                          className={cn(
                            "size-7 transition-all duration-200",
                            task.checked
                              ? "!bg-[#22C55E] !border-[#22C55E] text-white"
                              : "border-2 border-gray-300 bg-white"
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[#1B1343] text-sm sm:text-[20px] font-medium transition-all duration-200 truncate",
                        task.checked && "line-through text-gray-400 opacity-60"
                      )}
                    >
                      {task.name}
                    </span>

                    <div className="ml-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
                      <div
                        onClick={() =>
                          setIsDetailOpen({
                            task,
                            checklist_id: group.id,
                            owned: group.owned ?? true,
                          })
                        }
                        className="size-7 rounded-full border border-[#A67EEA]/40 flex items-center justify-center text-[#A67EEA] hover:bg-[#A67EEA] hover:text-white transition-all shrink-0"
                      >
                        <Eye className="size-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!readOnly && group.owned !== false && (
                <div className="w-full bg-bg-checklist px-[18px] py-[15px] flex items-center justify-end gap-1 sm:gap-2 shrink-0 ">
                  <Button
                    variant={"ghost"}
                    className="shadow-none bg-[#F4EEFC] text-[#6035C1] font-semibold hover:bg-transparent text-sm sm:text-lg px-2 sm:py-[14px] sm:px-6 border border-[#BAA8EA] rounded-[5px]"
                    onClick={() => setIsAddTaskOpen(group.id)}
                  >
                    <span className="hidden sm:inline">
                      {t("checklists.addTask")}
                    </span>
                    <PlusIcon
                      className="bg-primary size-7 p-1.5 rounded-full text-white sm:ml-2"
                      stroke="white"
                      strokeWidth={3}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    className=" hover:bg-red-50 shadow-none bg-[#F6F6FA] text-[#8F8DAB] font-semibold text-sm sm:text-lg px-2 sm:py-[14px] sm:px-6 border border-[#DFDEEA] rounded-[5px]"
                    onClick={() => setDeleteId(group.id)}
                    disabled={isPendingDelete}
                  >
                    <span className="hidden sm:inline">
                      {t("checklists.deleteList")}
                    </span>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#8F8DAB]">
                      <Trash2 className="size-3 text-white" />
                    </div>
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
        <Dialog
          open={!!isAddTaskOpen}
          onOpenChange={() => setIsAddTaskOpen(null)}
        >
          <DialogContent className="w-full sm:max-w-5xl p-0 border-none bg-transparent shadow-none max-h-[95vh] overflow-y-auto">
            <DialogTitle className="sr-only">
              {t("checklists.addTask")}
            </DialogTitle>
            <TaskForm
              checklist_id={isAddTaskOpen || ""}
              onClose={() => setIsAddTaskOpen(null)}
              refetch={refetch}
            />
          </DialogContent>
        </Dialog>
      </Accordion>
      {/* details dialouge */}
      <Dialog open={!!isDetailOpen} onOpenChange={() => setIsDetailOpen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-[672px] rounded-2xl bg-white p-0">
          {isDetailOpen && (
            <div className="">
              <div className="px-5 sm:px-[30px] py-5 border-b border-b-[#F0EDF8]">
                <h3 className="text-xl sm:text-[30px] text-[#3D3177] font-semibold ">
                  {isDetailOpen.task.name}
                </h3>
              </div>
              <div className="px-5 sm:px-8 py-6">
                <p className="text-base font-normal text-[#1B1343] mb-6">
                  {isDetailOpen.task?.description || "no description"}
                </p>
                <div className="space-y-3">
                  <div className="w-full px-4 py-[17px] flex items-center justify-between gap-3 rounded-[5px] border border-[#F3EAFF]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="text-[#A97AEC] shrink-0" />
                      <span className="text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        Förfallodatum
                      </span>
                    </div>
                    {isDetailOpen.task.date ? (
                      <p className="text-base font-semibold text-[#3D3177]">
                        {/* {t("checklists.overdue", {
                          days: format(isDetailOpen.task.date, "io LLL RRR"),
                        })} */}
                        {format(isDetailOpen.task.date, "io LLL RRR")}
                      </p>
                    ) : (
                      <span className="text-sm text-gray-400">{t("none")}</span>
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
                        <g clip-path="url(#clip0_4022_3329)">
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
                      <span className="text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        Tilldelad till
                      </span>
                    </div>
                    {isDetailOpen.task.assignedTo !== "none" &&
                    isDetailOpen.task.assignedTo ? (
                      isDetailOpen.task.assignedTo !== "both" ? (
                        // <div
                        //   className={cn("size-5 rounded-full", {
                        //     "bg-[#2DD4BF]":
                        //       isDetailOpen.task.assignedTo === "partner",
                        //     "bg-[#A855F7]":
                        //       isDetailOpen.task.assignedTo === "me",
                        //   })}
                        // />
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
                        // <div className="flex -space-x-2.5">
                        //   <div className="size-5 rounded-full bg-[#A855F7]" />
                        //   <div className="size-5 rounded-full bg-[#2DD4BF]" />
                        // </div>
                        <Badge
                          className={cn(
                            "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none bg-[#E6DBFD] text-base text-[#3D3177]"
                          )}
                        >
                          Både
                        </Badge>
                      )
                    ) : (
                      <span className="text-sm text-gray-400">{t("none")}</span>
                    )}
                  </div>
                  <div className="w-full px-4 py-[17px] flex items-center justify-between gap-3 rounded-[5px] border border-[#F3EAFF]">
                    <div className="flex items-center gap-1.5">
                      <Flag className="text-[#A97AEC]" />
                      <span className="text-base font-normal text-[#3D3177] w-20 sm:w-24 shrink-0">
                        Prioritet
                      </span>
                    </div>
                    {isDetailOpen.task.priority ? (
                      // <Badge
                      //   className={cn(
                      //     "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none",
                      //     isDetailOpen.task.priority === "high"
                      //       ? "bg-[#FFFBE5] text-[#BB4D00] border-[#FEE685]"
                      //       : isDetailOpen.task.priority === "medium"
                      //         ? "bg-[#E1EFFE] text-[#1E429F] border-[#C3DDFD]"
                      //         : "bg-[#DEF7EC] text-[#03543F] border-[#BCF0DA]"
                      //   )}
                      // >
                      <Badge
                        className={cn(
                          "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none bg-[#E6DBFD] text-base text-[#3D3177]"
                        )}
                      >
                        {t(isDetailOpen.task.priority)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">{t("none")}</span>
                    )}
                  </div>
                  <div className="w-full flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={readOnly || isDetailOpen.owned === false}
                      onClick={handleToggleReminder}
                      className={cn(
                        "w-full sm:max-w-[360px] flex items-center justify-center gap-3.5 border border-[#A97AEC] py-3 rounded-md transition-all",
                        isDetailOpen.task.reminder
                          ? "bg-[#A855F7] text-white hover:bg-[#9333EA] border-[#A855F7]"
                          : "bg-white text-[#A97AEC] hover:bg-purple-50",
                        (readOnly || isDetailOpen.owned === false) &&
                          "opacity-60 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center shrink-0",
                          isDetailOpen.task.reminder
                            ? "bg-white/20 text-white"
                            : "border-[#A855F7] text-[#A855F7]"
                        )}
                      >
                        <Bell
                          className={cn(
                            "size-6",
                            isDetailOpen.task.reminder
                              ? "text-white"
                              : "text-[#A855F7]"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-lg font-normal w-fit shrink-0",
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
                </div>
              </div>
              {!isDetailOpen.task.checked && (
                <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 px-5 sm:px-8 py-6 border-t border-[#F0EDF8]">
                  <Button
                    onClick={() => {
                      handleChecklistToggle(isDetailOpen.task.id);
                      setIsDetailOpen(null);
                    }}
                    className="w-full s:w-auto py-1.5 flex-1 rounded-[5px] bg-[#F2FCF6] border border-[#82CDA8] text-[#0FBD23] font-semibold hover:bg-[#E6F9ED]"
                  >
                    Slutförd
                    <div className="w-[28px] h-[28px] bg-[#0FBD23] rounded-full flex items-center justify-center">
                      <Check className="size-5 text-white" />
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsListTaskOpen(isDetailOpen);
                      setIsDetailOpen(null);
                    }}
                    className="w-full s:w-auto py-1.5 flex-1 rounded-[5px] bg-[rgb(244,238,252)] border border-[#BAA8EA] text-[#6035C1] font-semibold hover:bg-[#EBE0F9]"
                  >
                    Redigera
                    <div className="w-[28px] h-[28px] bg-[#6035C1] rounded-full flex items-center justify-center">
                      <SquarePen className="size-5 text-white" />
                    </div>
                  </Button>
                  {!isPartner && (
                    <Button
                      onClick={() => {
                        setIsDeleteTaskOpen(true);
                      }}
                      className="w-full s:w-auto py-1.5 flex-1 rounded-[5px] bg-[#FEF2F2] border border-[#F99F9D] text-[#F14B4C] font-semibold hover:bg-[#FDE5E5]"
                    >
                      Radera
                      <div className="w-[28px] h-[28px] bg-[#E7000B] rounded-full flex items-center justify-center">
                        <Trash2 className="size-5 text-white" />
                      </div>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* task diaouge */}
      <Dialog
        open={!!isListTaskOpen}
        onOpenChange={() => setIsListTaskOpen(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {t("checklists.taskForm.updateTask")}
          </DialogTitle>
          {isListTaskOpen && (
            <TaskForm
              checklist_id={isListTaskOpen.checklist_id}
              task={isListTaskOpen.task}
              onClose={() => setIsListTaskOpen(null)}
              refetch={refetch}
              readOnly={readOnly || isListTaskOpen.owned === false}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* checklist dialog */}
      <Dialog
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <DialogContent className="w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left">
              {formData.type === "update"
                ? "Ändra titeln"
                : t("checklists.addChecklist")}
            </DialogTitle>
          </DialogHeader>
          <ChecklistForm
            onSubmitForDialogAndRefetch={async () => {
              await refetch?.();
              setFormData({ type: "default", id: "" });
            }}
            formData={formData}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("checklists.deleteTitle") || "Delete Checklist"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("checklists.deleteDescription") ||
                "Are you sure you want to delete this checklist?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPendingDelete}>
              {t("common.cancel") || "Cancel"}
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
                        refetch?.();
                      },
                    }
                  );
                }
              }}
              disabled={isPendingDelete}
            >
              {isPendingDelete
                ? t("common.loading")
                : t("common.delete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <AlertDialogCancel disabled={isDeletingItem}>
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
                      refetch?.();
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
    </>
  );
}
