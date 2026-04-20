"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Eye, ChevronDown } from "lucide-react";
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
import ChecklistForm from "../../check-lists/_component/CheckListForm";
import TaskForm from "../../check-lists/_component/TaskForm";
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
import { useMutationToggleChecklist } from "../../check-lists/_api/mutations/UseMutationToggleChecklist";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  const [editingTask, setEditingTask] = useState<{
    checklistId: string;
    task: ChecklistItem;
  } | null>(null);
  const [editingList, setEditingList] = useState<any | null>(null);

  const [addTaskStep, setAddTaskStep] = useState<"select-list" | "form">(
    "select-list"
  );
  const [selectedChecklistIdForTask, setSelectedChecklistIdForTask] =
    useState<string>("");

  // Sync state with props when checkLists changes
  useEffect(() => {
    if (checkLists) {
      // console.log("OverviewChecklist Data:", checkLists);
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
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();

  // Open the first item by default if available
  const [openItem, setOpenItem] = useState<string | undefined>(
    lists && lists.length > 0 ? lists[0]._id : undefined
  );

  const handleToggle = (listId: string, itemId: string) => {
    setToggleLoading(itemId);
    toggleChecklist(
      { id: itemId },
      {
        onSuccess: () => {
          toast.success(
            t("checklists.toggleSuccess") || "Task updated successfully"
          );
          setLists((prevLists: Checklist[]) => {
            const updated = prevLists.map((list: Checklist) => {
              if (list._id === listId) {
                return {
                  ...list,
                  items: list.items.map((item: ChecklistItem) =>
                    item._id === itemId
                      ? { ...item, checked: !item.checked }
                      : item
                  ),
                };
              }
              return list;
            });

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
            className="sm:w-auto w-full rounded-full text-lg font-semibold px-16 text-primary bg-white hover:bg-white/10 shadow-none border font-poppins"
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
        className="w-full bg-white rounded-3xl overflow-hidden shadow-lg "
      >
        {lists?.map((list) => (
          <AccordionItem
            key={list._id}
            value={list._id}
            className={cn(
              "border-b border-gray-100 last:border-b-0 transition-all duration-300",
              openItem === list._id ? "bg-white" : "bg-gray-50/30"
            )}
          >
            <AccordionTrigger className="p-4 hover:no-underline group w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px] font-semibold text-[#3D3177] leading-tight">
                      {list.title}
                    </span>
                  </div>
                  {/* {openItem !== `item-${index}` && list.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1 font-normal">
                      {list.description}
                    </p>
                  )} */}
                </div>
                <div
                  className={cn(
                    "size-7 rounded-full flex items-center justify-center transition-all duration-300",
                    openItem === list._id
                      ? "bg-[#F3E8FF] text-[#A97AEC] rotate-180"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {list.items?.map((item: ChecklistItem, itemIdx: number) => (
                <div
                  key={item._id || itemIdx}
                  className={cn(
                    "flex items-center justify-between gap-4 p-4 transition-all duration-200 border-t border-gray-100 group/item cursor-pointer relative",
                    item.checked ? "bg-[#F0FDF4]" : "hover:bg-gray-50/50"
                  )}
                  onClick={() =>
                    setEditingTask({ checklistId: list._id, task: item })
                  }
                >
                  <div className=" flex-1 flex items-center gap-2.5 ">
                    <div className="shrink-0">
                      {toggleLoading === item._id && isPending ? (
                        <Spinner variant="circle" className="size-6" />
                      ) : (
                        <div
                          className={cn(
                            "size-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            item.checked
                              ? "bg-[#22C55E] border-[#22C55E]"
                              : "border-gray-200 bg-white"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(list._id, item._id);
                          }}
                        >
                          {item.checked && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3.5 text-white"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-lg font-semibold text-[#3D3177] whitespace-nowrap max-w-72 truncate overflow-hidden",
                        item.checked && "text-[#3D3177]/70"
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-normal max-w-72 truncate overflow-hidden",
                        item.checked ? "text-[#3D3177]/40" : "text-[#3D3177]/60"
                      )}
                    >
                      {item.description}
                    </span>
                  </div>

                  <div className="size-7 rounded-full border border-[#A67EEA]/40 flex items-center justify-center text-[#A67EEA] hover:bg-[#A67EEA] hover:text-white transition-all shrink-0">
                    <Eye className="size-4" />
                  </div>
                </div>
              ))}

              {(!list.items || list.items.length === 0) && (
                <div className="py-8 text-center text-gray-500 italic">
                  {t("checklists.noItems")}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {(!lists || lists.length === 0) && (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50">
            {t("checklists.noChecklistsForWeek")}
          </div>
        )}
      </Accordion>
      {/* </div> */}

      {/* See All Button */}
      <div className="flex justify-center pt-4">
        <Link href="/check-lists" className="w-full">
          <Button className="w-full rounded-full text-xl font-semibold bg-[#A67EEA] hover:bg-[#8B5CF6] shadow-xl border-none text-white transition-all transform hover:-translate-y-1">
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

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent
          className={cn(
            "max-h-[90vh] overflow-y-auto w-full p-0 border-none shadow-none",
            addTaskStep === "select-list"
              ? "lg:max-w-xl bg-white p-6 pt-10"
              : "lg:max-w-4xl bg-transparent"
          )}
        >
          <DialogTitle className="sr-only">
            {t("checklists.addTask")}
          </DialogTitle>

          {addTaskStep === "select-list" ? (
            <div className="space-y-6">
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
            <TaskForm
              checklist_id={selectedChecklistIdForTask}
              onClose={() => setIsAddTaskOpen(false)}
              refetch={() => {
                router.refresh();
                setIsAddTaskOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={Boolean(editingTask)}
        onOpenChange={() => setEditingTask(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {t("checklists.taskForm.updateTask")}
          </DialogTitle>
          <TaskForm
            checklist_id={editingTask?.checklistId || ""}
            task={
              editingTask?.task
                ? {
                    id: editingTask.task._id,
                    name: editingTask.task.title,
                    description: editingTask.task.description,
                    priority: editingTask.task.priority,
                    date: editingTask.task.due_date,
                    reminder: editingTask.task.reminder,
                    assignedTo: editingTask.task.assigned_to,
                  }
                : null
            }
            onClose={() => setEditingTask(null)}
            refetch={() => {
              router.refresh();
              setEditingTask(null);
            }}
          />
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
    </div>
  );
}
