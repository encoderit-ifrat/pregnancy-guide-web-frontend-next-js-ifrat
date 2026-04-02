"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronDownIcon,
  Circle,
  Pencil,
  PlusIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { useMutationToggleChecklist } from "../_api/mutations/UseMutationToggleChecklist";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import {
  CheckListItemProps,
  ChecklistItemWithItems,
} from "../_types/checklist_item_types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckBox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import TaskForm from "./TaskForm";


export default function CheckList({
  checklistItems,
  overview,
  onDeleteAction,
  onEditAction,
  className,
}: CheckListItemProps) {
  const { t } = useTranslation();
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const [filteredLists, setFilterLists] = useState<ChecklistItemWithItems[]>(
    checklistItems || []
  );
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<string | null>(null);


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
    tasks: (list.items || []).map((item) => ({
      id: item._id,
      name: item.title,
      checked: !!(item.checked ?? item.is_completed),
      priority: "medium" as const,
      assignedTo: "none" as const,
      description: item.description,
      date: undefined,
      reminder: undefined,
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
          router.refresh();
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
        {data.map((group: any, index: number) => (
          <AccordionItem
            key={group.id}
            value={group.id}
            className={cn("py-3", index === 0 && "border-t")}
          >
            <div className="flex items-center justify-between gap-3 font-poppins font-semibold text-primary-dark">
              <div className="flex items-center gap-3">
                <AccordionTrigger>
                  <ChevronDownIcon className="bg-primary-light rounded-full p-2 md:ml-4 text-primary pointer-events-none size-9 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>

                <div className="text-[22px] font-semibold">{group.name}</div>

                <span className="rounded-full bg-[#F3F4F6] py-1.5 px-2.5 text-sm font-inter font-medium h-fit text-[#6A7282]">
                  0 / 2
                </span>

                <div className="flex items-center gap-1 text-primary font-semibold">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[3%] h-full bg-primary"></div>
                  </div>
                  <span>0%</span>
                </div>
              </div>
              <Button
                variant={"ghost"}
                className="shadow-none text-primary font-semibold hover:bg-transparent"
                onClick={() => setIsAddTaskOpen(group.id)}
              >
                Add Task{" "}
                <PlusIcon
                  className="bg-primary size-7 p-1.5 rounded-full text-white ml-2"
                  stroke="white"
                  strokeWidth={3}
                />
              </Button>
            </div>

            <AccordionContent>
              <div className="border-t my-2" />
              {/* TASK LEVEL */}
              <Accordion type="single" collapsible className="space-y-3">
                {group.tasks.map((task: any) => (
                  <AccordionItem
                    key={task.id}
                    value={task.id}
                    className={cn(
                      "border-none transition-colors duration-200",
                      task.checked && "bg-[#F0FDF4]"
                    )}
                  >
                    {/* Task Header */}
                    <div className="flex items-center gap-3 py-3 px-5 border-b last:border-b-0 border-gray-50">
                      {/* Checkbox */}
                      <div className="size-7 flex items-center justify-center shrink-0 cursor-pointer">
                        {toggleLoading === task.id && isPending ? (
                          <Spinner variant="circle" className="size-5" />
                        ) : (
                          <CheckBox
                            checked={task.checked}
                            onCheckedChange={() => handleChecklistToggle(task.id)}
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
                          "text-[#1B1343] text-[20px] font-medium transition-all duration-200",
                          task.checked && "line-through text-gray-400 opacity-60"
                        )}
                      >
                        {task.name}
                      </span>

                      <div className="ml-auto flex items-center gap-3">
                        {/* Priority Badge */}
                        <Badge
                          className={cn(
                            "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none transition-all duration-200",
                            task.priority === "high"
                              ? "bg-[#FFFBE5] text-[#BB4D00] border-[#FEE685]"
                              : task.priority === "medium"
                                ? "bg-[#E1EFFE] text-[#1E429F] border-[#C3DDFD]"
                                : "bg-[#DEF7EC] text-[#03543F] border-[#BCF0DA]"
                          )}
                        >
                          <div
                            className={cn(
                              "size-2 rounded-full",
                              task.priority === "high"
                                ? "bg-[#BB4D00]"
                                : task.priority === "medium"
                                  ? "bg-[#3F83F8]"
                                  : "bg-[#31C48D]"
                            )}
                          />
                          {task.priority}
                        </Badge>

                        {/* Due Date Badge */}
                        {task.date && (
                          <Badge className="bg-[#FFFBE5] text-[#BB4D00] border-[#FEE685] hover:bg-[#FFFBE5] flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none transition-all duration-200">
                            <Calendar className="size-3.5" />
                            {task.date === "28-01-2026"
                              ? "363d overdue"
                              : task.date}
                          </Badge>
                        )}

                        {/* Assigned To Icon */}
                        <div className="size-8 rounded-full border border-[#A67EEA] bg-white flex items-center justify-center text-[#A67EEA] font-bold text-xs shrink-0 transition-opacity hover:opacity-80">
                          {task.assignedTo === "partner"
                            ? "P"
                            : task.assignedTo === "me"
                              ? "M"
                              : "N"}
                        </div>

                        {/* Notification Icon */}
                        <div className="size-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#A67EEA] shrink-0 hover:bg-[#EDE9FE] transition-colors cursor-pointer">
                          <Bell className="size-4" />
                        </div>

                        <AccordionTrigger className="flex items-center hover:no-underline">
                          <div className="size-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary group-data-[state=open]:rotate-180 transition-all duration-200 shrink-0 hover:border-gray-200">
                            <ChevronDownIcon className="size-5" />
                          </div>
                        </AccordionTrigger>
                      </div>
                    </div>

                    {/* Task Details Expand */}
                    <AccordionContent className="border-t border-[#FEE685] bg-gray-50/30 p-5">
                      {/* <TaskForm /> */}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
        <Dialog open={!!isAddTaskOpen} onOpenChange={() => setIsAddTaskOpen(null)}>
          <DialogContent className="w-full sm:max-w-5xl p-0 border-none bg-transparent shadow-none">
            <DialogTitle className="sr-only">Add Task</DialogTitle>
            <TaskForm checklist_id={isAddTaskOpen || ""} onClose={() => setIsAddTaskOpen(null)} />
          </DialogContent>
        </Dialog>
      </Accordion>
    </>
  );
}
