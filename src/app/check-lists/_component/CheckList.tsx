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

export default function CheckList() {
  const { t } = useTranslation();
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const [filteredLists, setFilterLists] = useState<ChecklistItemWithItems[]>(
    []
  );
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const router = useRouter();
  type Task = {
    id: string;
    name: string;
    checked: boolean;
    priority: "high" | "medium" | "low";
    assignedTo: "me" | "partner" | "none";
    description?: string;
    date?: string;
    reminder?: string;
  };

  type Group = {
    id: string;
    name: string;
    tasks: Task[];
  };

  const data: Group[] = [
    {
      id: "1",
      name: "Baby Preparation",
      tasks: [
        {
          id: "t1",
          name: "Buy baby clothes",
          checked: false,
          priority: "high",
          assignedTo: "partner",
          description: "Buy newborn essentials (0–3 months)",
          date: "01-02-2026",
          reminder: "1 day before",
        },
        {
          id: "t2",
          name: "Prepare nursery",
          checked: true,
          priority: "medium",
          assignedTo: "me",
          description: "Setup crib, lighting, and decorations",
          date: "05-02-2026",
        },
        {
          id: "t3",
          name: "Install baby monitor",
          checked: false,
          priority: "low",
          assignedTo: "me",
          description: "Connect monitor to phone app",
        },
        {
          id: "t4",
          name: "Pack hospital bag",
          checked: false,
          priority: "high",
          assignedTo: "partner",
          description: "Include clothes, documents, essentials",
          date: "28-01-2026",
          reminder: "2 days before",
        },
      ],
    },

    {
      id: "2",
      name: "Health & Appointments",
      tasks: [
        {
          id: "t5",
          name: "Doctor appointment",
          checked: false,
          priority: "high",
          assignedTo: "me",
          description: "Monthly pregnancy checkup",
          date: "10-02-2026",
          reminder: "3 hours before",
        },
        {
          id: "t6",
          name: "Take vitamins",
          checked: true,
          priority: "medium",
          assignedTo: "me",
          description: "Daily prenatal vitamins",
          reminder: "Every morning",
        },
        {
          id: "t7",
          name: "Blood test",
          checked: false,
          priority: "high",
          assignedTo: "partner",
          description: "Routine lab test",
          date: "15-02-2026",
        },
        {
          id: "t8",
          name: "Vaccination schedule",
          checked: false,
          priority: "low",
          assignedTo: "none",
          description: "Check recommended vaccines",
        },
      ],
    },

    {
      id: "3",
      name: "Home & Shopping",
      tasks: [
        {
          id: "t9",
          name: "Buy groceries",
          checked: true,
          priority: "low",
          assignedTo: "partner",
          description: "Weekly grocery shopping",
        },
        {
          id: "t10",
          name: "Order baby stroller",
          checked: false,
          priority: "high",
          assignedTo: "me",
          description: "Compare brands and order online",
          reminder: "Tonight",
        },
        {
          id: "t11",
          name: "Clean house",
          checked: false,
          priority: "medium",
          assignedTo: "none",
          description: "Deep cleaning before baby arrives",
        },
        {
          id: "t12",
          name: "Buy diapers",
          checked: false,
          priority: "high",
          assignedTo: "partner",
          description: "Stock up for first 2 months",
          date: "20-02-2026",
        },
      ],
    },

    {
      id: "4",
      name: "Work & Personal",
      tasks: [
        {
          id: "t13",
          name: "Submit leave application",
          checked: false,
          priority: "high",
          assignedTo: "me",
          description: "Apply for parental leave",
          date: "25-01-2026",
        },
        {
          id: "t14",
          name: "Finish project report",
          checked: true,
          priority: "medium",
          assignedTo: "me",
          description: "Finalize and submit report",
        },
        {
          id: "t15",
          name: "Backup important files",
          checked: false,
          priority: "low",
          assignedTo: "none",
          description: "Store files in cloud",
        },
        {
          id: "t16",
          name: "Team meeting",
          checked: false,
          priority: "medium",
          assignedTo: "me",
          date: "30-01-2026",
          reminder: "30 minutes before",
        },
      ],
    },
  ];
  // FIX: Only update when checklistItems prop changes
  // useEffect(() => {
  //   setFilterLists(checklistItems);
  // }, [checklistItems]); // Add dependency array

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
    // <Accordion type="single" collapsible className="w-full">
    //   {filteredLists?.map((item: ChecklistItemWithItems, index: number) => {
    //     const hasItemDetails =
    //       item?.items?.length > 0 && item.items.some((itm) => itm.title);

    //     return (
    //       <AccordionItem
    //         key={item._id}
    //         value={`item-${index}`}
    //         className={cn("bg-white", className)}
    //       >
    //         <AccordionTrigger
    //           className={cn(
    //             "flex items-center justify-between  px-4 ",
    //             !hasItemDetails ? "opacity-50 cursor-not-allowed" : ""
    //           )}
    //           actionButtons={
    //             <>
    //               {!overview && item.userId && (
    //                 <>
    //                   <button
    //                     className="bg-primary-light hover:bg-primary text-primary hover:text-white rounded-full p-2 cursor-pointer"
    //                     onClick={(e) => {
    //                       e.stopPropagation();
    //                       onEditAction?.(item);
    //                     }}
    //                   >
    //                     <Pencil className="size-5" />
    //                   </button>
    //                   <button
    //                     className="bg-primary-light hover:bg-primary text-primary hover:text-white rounded-full p-2 cursor-pointer"
    //                     onClick={(e) => {
    //                       e.stopPropagation();
    //                       onDeleteAction?.(item);
    //                     }}
    //                   >
    //                     <Trash2 className="size-5" />
    //                   </button>
    //                 </>
    //               )}
    //             </>
    //           }
    //         >
    //           <div className="size-full pl-0 p-4 flex items-center cursor-pointer">
    //             {item?.all_checked && (
    //               <div className="mr-4 md:mr-0 bg-green-600 rounded-full p-1">
    //                 <Check className="h-4 w-4 text-white shrink-0" />
    //               </div>
    //             )}
    //             <div className="sm:pl-6 text-primary-dark">
    //               <h4 className="text-[22px] mb-0 font-semibold w-full max-w-48 md:max-w-md truncate">
    //                 {item.title}
    //               </h4>
    //               {item.description && (
    //                 <p className="text-[16px] mt-1 font-normal line-clamp-2">
    //                   {item.description}
    //                 </p>
    //               )}
    //             </div>
    //           </div>
    //         </AccordionTrigger>
    //         <AccordionContent>
    //           {/* percentage Completed */}
    //           <div className="relative h-0.5 w-full bg-gray-200">
    //             <div
    //               className="absolute h-0.5 bg-green-500"
    //               style={{ width: `${item?.progress?.percentage || 0}%` }}
    //             ></div>
    //           </div>
    //           <div>
    //             {item?.items?.map((itm: any, idx: number) => (
    //               <div
    //                 key={idx}
    //                 onClick={() => handleChecklistToggle(itm._id)}
    //                 className={`flex items-center gap-4 p-2 sm:p-4 m-2 cursor-pointer transition-all ${itm.checked ? "bg-green-50" : "hover:bg-gray-50"} border-b last:border-b-0`}
    //               >
    //                 <div className="pt-0.5">
    //                   {toggleLoading == itm._id && isPending ? (
    //                     <Spinner variant="circle" />
    //                   ) : itm.checked ? (
    //                     <div className="bg-green-600 rounded-full p-1">
    //                       <Check className="h-4 w-4 text-white shrink-0" />
    //                     </div>
    //                   ) : (
    //                     <Circle className="h-6 w-6 text-gray-400 shrink-0" />
    //                   )}
    //                 </div>
    //                 <div className="flex-1">
    //                   <h4
    //                     className={`text-xl text-primary-dark font-bold block ${
    //                       itm.checked ? "text-green-800" : "text-gray-700"
    //                     }`}
    //                   >
    //                     {itm.title}
    //                   </h4>
    //                   {itm.description && (
    //                     <p
    //                       className={`text-sm text-primary-dark font-medium mt-1 ${
    //                         itm.checked
    //                           ? "text-green-700 opacity-75"
    //                           : "text-gray-600"
    //                       }`}
    //                     >
    //                       {itm.description}
    //                     </p>
    //                   )}
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </AccordionContent>
    //       </AccordionItem>
    //     );
    //   })}
    // </Accordion>

    <Accordion type="multiple" className="w-full space-y-4">

      {data.map((group, index) => (
        <AccordionItem key={group.id} value={group.id} className={cn("py-3", index === 0 && "border-t")}>
          <div className="flex items-center justify-between gap-3 font-poppins font-semibold text-primary-dark">

            <div className="flex items-center gap-3">

              <AccordionTrigger>
                <ChevronDownIcon className="bg-primary-light rounded-full p-2 md:ml-4 text-primary pointer-events-none size-9 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>

              <div className="text-[22px] font-semibold">
                {group.name}
              </div>

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
              onClick={() => setIsAddTaskOpen(true)}
            >
              Add Task <PlusIcon className="bg-primary size-7 p-1.5 rounded-full text-white ml-2" stroke="white" strokeWidth={3} />
            </Button>
          </div>

          <AccordionContent>
            <div className="border-t my-2" />
            {/* TASK LEVEL */}
            <Accordion type="single" collapsible className="space-y-3">
              {group.tasks.map((task) => (
                <AccordionItem
                  key={task.id}
                  value={task.id}
                // className="border rounded-lg px-3"
                >
                  {/* Task Header */}
                  <div className="flex items-center gap-3 my-3 px-5">
                    <CheckBox checked={task.checked} />
                    <span
                      className={cn(
                        "text-[#1B1343] text-[22px]",
                        task.checked && "line-through text-gray-400"
                      )}
                    >
                      {task.name}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                      {/* Priority Badge */}
                      <Badge
                        className={cn(
                          "capitalize hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none",
                          task.priority === "medium"
                            ? "bg-[#E1EFFE] text-[#1E429F] border-[#C3DDFD]"
                            : task.priority === "low"
                              ? "bg-[#DEF7EC] text-[#03543F] border-[#BCF0DA]"
                              : "bg-[#FFFBE5] text-[#BB4D00] border-[#FEE685]"
                        )}
                      >
                        <div className={cn(
                          "size-2 rounded-full",
                          task.priority === "high" ? "bg-[#D99B6A]" :
                            task.priority === "medium" ? "bg-[#3F83F8]" :
                              task.priority === "low" ? "bg-[#31C48D]" :
                                "bg-yellow-500"
                        )} />
                        {task.priority}
                      </Badge>

                      {/* Due Date Badge */}
                      {task.date && (
                        <Badge
                          className="bg-[#FFFBE5] text-[#BB4D00] border-[#FEE685] hover:bg-[#FFFBE5] flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border shadow-none"
                        >
                          <Calendar className="size-3.5" />
                          {task.date === "28-01-2026" ? "363d overdue" : task.date}
                        </Badge>
                      )}

                      {/* Assigned To Icon */}
                      <div className="size-8 rounded-full border border-[#A67EEA] bg-white flex items-center justify-center text-[#A67EEA] font-bold text-xs shrink-0">
                        {task.assignedTo === "partner" ? "P" : task.assignedTo === "me" ? "M" : "N"}
                      </div>

                      {/* Notification Icon */}
                      <div className="size-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#A67EEA] shrink-0">
                        <Bell className="size-4" />
                      </div>

                      <AccordionTrigger className="flex items-center">
                        <div className="size-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-primary group-data-[state=open]:rotate-180 transition-transform shrink-0">
                          <ChevronDownIcon className="size-5" />
                        </div>
                      </AccordionTrigger>
                    </div>
                  </div>

                  {/* Task Details Expand */}
                  <AccordionContent className="border-t border-[#FEE685] bg-gray-50/30 p-5">
                    <TaskForm />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="w-full sm:max-w-5xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Add Task</DialogTitle>
          <TaskForm />
        </DialogContent>
      </Dialog>
    </Accordion>
  );
}
