"use client";

import React, { useState } from "react";
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
  AccordionTrigger
} from "@/components/ui/Accordion";
import { CheckListsProps } from "../_types/checklists_component_types";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { useMutationToggleChecklist } from "../../check-lists/_api/mutations/UseMutationToggleChecklist";
import { toast } from "sonner";

export default function OverviewChecklist({ checkLists, count }: CheckListsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [lists, setLists] = useState(checkLists || []);
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
    task: any;
  } | null>(null);
  const [editingList, setEditingList] = useState<any | null>(null);

  // Sync state with props when checkLists changes
  React.useEffect(() => {
    if (checkLists) {
      console.log("OverviewChecklist Data:", checkLists);
      if (isNewlyCreated) {
        const currentIds = new Set(lists.map((l) => l._id));
        const newIndex = checkLists.findIndex((l) => !currentIds.has(l._id));

        if (newIndex !== -1) {
          setOpenItem(`item-${newIndex}`);
        }
        setIsNewlyCreated(false);
      }
      setLists(checkLists);
    }
  }, [checkLists, isNewlyCreated, lists]);

  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();

  // Open the first item by default if available
  const [openItem, setOpenItem] = useState<string | undefined>(
    lists && lists.length > 0 ? `item-0` : undefined
  );

  const handleToggle = (listId: string, itemId: string) => {
    setToggleLoading(itemId);
    toggleChecklist(
      { id: itemId },
      {
        onSuccess: () => {
          toast.success(t("checklists.toggleSuccess") || "Task updated successfully");
          setLists((prevLists) => {
            const updated = prevLists.map((list) => {
              if (list._id === listId) {
                return {
                  ...list,
                  items: list.items.map((item) =>
                    item._id === itemId
                      ? { ...item, is_completed: !item.is_completed }
                      : item
                  ),
                };
              }
              return list;
            });

            // Filter out checklists where all items are completed, consistent with main CheckList view
            return updated.filter((list) => {
              const allChecked = list.items.every((itm) => itm.is_completed);
              return !allChecked;
            });
          });
          setToggleLoading(null);
        },
        onError: () => {
          toast.error("Failed to update task");
          setToggleLoading(null);
        },
      }
    );
  };

  return (
    <div className="px-4 sm:pt-8 lg:pt-10 space-y-6 max-w-4xl mx-auto pb-7 lg:pb-15">
      {/* Buttons Header */}
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
          className="sm:w-auto w-full rounded-full text-lg font-semibold px-16 text-primary bg-white hover:bg-white/10 shadow-none border-1 font-poppins"
          onClick={() => {
            if (lists && lists.length > 0) {
              setIsAddTaskOpen(true);
            } else {
              toast.error(t("checklists.noListError") || "Please create a list first before adding tasks");
            }
          }}
        >
          {t("checklists.addTask")} +
        </Button>
      </div>

      {/* Checklist Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-white/20">
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="w-full"
        >
          {lists?.map((list, index) => (
            <AccordionItem
              key={list._id || index}
              value={`item-${index}`}
              className={cn(
                "border-b border-gray-100 last:border-b-0 transition-all duration-300",
                openItem === `item-${index}` ? "bg-white" : "bg-gray-50/30"
              )}
            >

              <AccordionTrigger
                className="px-6 py-6 hover:no-underline group w-full"
              >
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-[22px] font-semibold text-[#3D3177] leading-tight">
                        {list.title}
                      </span>
                    </div>
                    {openItem !== `item-${index}` && list.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1 font-normal">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <div className={cn(
                    "size-7 rounded-full flex items-center justify-center transition-all duration-300",
                    openItem === `item-${index}`
                      ? "bg-[#F3E8FF] text-[#A97AEC] rotate-180"
                      : "bg-gray-100 text-gray-400"
                  )}>
                    <ChevronDown className="size-4" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-0">
                <div className="space-y-0">
                  {list.items?.map((item, itemIdx) => (
                    <div
                      key={item._id || itemIdx}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 transition-all duration-200 border-t border-gray-100 group/item cursor-pointer relative",
                        item.is_completed
                          ? "bg-[#F0FDF4]"
                          : "hover:bg-gray-50/50"
                      )}
                      onClick={() =>
                        setEditingTask({ checklistId: list._id, task: item })
                      }
                    >
                      {/* Top accent line for first item if completed */}
                      {itemIdx === 0 && item.is_completed && (
                        <div className="absolute top-0 left-0 w-32 h-[1px] bg-[#22C55E]" />
                      )}

                      {/* Custom Circular Checkbox */}
                      <div className="shrink-0">
                        {toggleLoading === item._id && isPending ? (
                          <Spinner variant="circle" className="size-6" />
                        ) : (
                          <div
                            className={cn(
                              "size-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                              item.is_completed
                                ? "bg-[#22C55E] border-[#22C55E]"
                                : "border-gray-200 bg-white"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(list._id, item._id);
                            }}
                          >
                            {item.is_completed && (
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

                      {/* Content: Title & Description in same line */}
                      <div className="flex-1 flex items-baseline gap-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-[18px] font-semibold text-[#3D3177] shrink-0",
                            item.is_completed && "text-[#3D3177]/70"
                          )}>
                            {item.title}
                          </h4>
                        </div>
                        <p className={cn(
                          "text-sm truncate font-normal",
                          item.is_completed ? "text-[#3D3177]/40" : "text-[#3D3177]/60"
                        )}>
                          {item.description}
                        </p>
                      </div>

                      {/* Assigned To Initials */}
                      {item.assigned_to && item.assigned_to !== "none" && (
                        <div className={cn(
                          "size-7 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0",
                          item.assigned_to === "partner"
                            ? "border-[#22C55E]/40 text-[#22C55E] bg-[#F0FDF4]/50"
                            : "border-[#A67EEA]/40 text-[#A67EEA] bg-[#F3E8FF]/50"
                        )}>
                          {item.assigned_to === "partner" ? "P" : "M"}
                        </div>
                      )}

                      {/* Eye Icon with purple circle border */}
                      <div className="size-7 rounded-full border border-[#A67EEA]/40 flex items-center justify-center text-[#A67EEA] hover:bg-[#A67EEA] hover:text-white transition-all shrink-0">
                        <Eye className="size-4" />
                      </div>
                    </div>
                  ))}

                  {(!list.items || list.items.length === 0) && (
                    <div className="px-6 py-8 text-center text-gray-500 italic">
                      No items found in this list.
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {(!lists || lists.length === 0) && (
            <div className="p-12 text-center text-gray-500 bg-gray-50/50">
              No checklists available for this week.
            </div>
          )}
        </Accordion>
      </div>

      {/* See All Button */}
      <div className="flex justify-center pt-4">
        <Link href="/check-lists" className="w-full">
          <Button
            className="w-full rounded-full text-xl font-semibold bg-[#A67EEA] hover:bg-[#8B5CF6] shadow-xl border-none text-white transition-all transform hover:-translate-y-1"
          >
            See All <ChevronRight className="ml-2 size-6" />
          </Button>
        </Link>
      </div>

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
        onOpenChange={() => setIsAddTaskOpen(false)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Add Task</DialogTitle>
          <TaskForm
            checklist_id={
              openItem
                ? lists?.[parseInt(openItem.replace("item-", ""))]?._id || ""
                : lists?.[0]?._id || ""
            }
            onClose={() => setIsAddTaskOpen(false)}
            refetch={() => {
              router.refresh();
              setIsAddTaskOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={Boolean(editingTask)}
        onOpenChange={() => setEditingTask(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Edit Task</DialogTitle>
          <TaskForm
            checklist_id={editingTask?.checklistId || ""}
            task={editingTask?.task ? {
              id: editingTask.task._id,
              name: editingTask.task.title,
              description: editingTask.task.description,
              priority: editingTask.task.priority,
              date: editingTask.task.due_date,
              reminder: editingTask.task.reminder,
              assignedTo: editingTask.task.assigned_to,
            } : null}
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
              Edit Checklist
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
              data: editingList ? {
                _id: editingList._id,
                title: editingList.title,
                description: editingList.description,
                category: editingList.category,
                is_active: editingList.is_active,
              } : undefined
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
