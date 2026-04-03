"use client";

import React, { useState } from "react";
import { ChevronRight, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/Accordion";
import { CheckListsProps } from "../_types/checklists_component_types";
import { cn } from "@/lib/utils";
import { CheckBox } from "@/components/ui/Checkbox";
import { Spinner } from "@/components/ui/Spinner";
import { useMutationToggleChecklist } from "../../check-lists/_api/mutations/UseMutationToggleChecklist";
import { toast } from "sonner";

const DUMMY_CHECKLISTS = [
  {
    _id: "list-1",
    title: "Baby Preparation",
    description: "Essential preparations for your newborn",
    items: [
      { _id: "item-1-1", title: "Buy baby clothes", description: "Newborn essentials (0–3 months)", is_completed: true },
      { _id: "item-1-2", title: "Prepare nursery", description: "Setup crib and decorations", is_completed: false },
      { _id: "item-1-3", title: "Install baby monitor", description: "Connect to phone app", is_completed: false },
    ]
  },
  {
    _id: "list-2",
    title: "Health & Care",
    description: "Daily health and medical routines",
    items: [
      { _id: "item-2-1", title: "Take vitamins", description: "Daily prenatal supplements", is_completed: true },
      { _id: "item-2-2", title: "Yoga practice", description: "Gentle morning stretching", is_completed: false },
    ]
  }
];

export default function OverviewChecklist({ checkLists, count }: CheckListsProps) {
  const { t } = useTranslation();
  const [lists, setLists] = useState(checkLists || DUMMY_CHECKLISTS);

  // Sync state with props when checkLists changes
  React.useEffect(() => {
    if (checkLists) {
      setLists(checkLists);
    }
  }, [checkLists]);

  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();

  // Open the first item by default if available
  const [openItems, setOpenItems] = useState<string[]>(
    lists && lists.length > 0 ? [`item-0`] : []
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
        <Link href="/check-lists" className="sm:w-auto w-full">
          <Button
            variant="softPurple"
            className="rounded-full text-lg font-semibold px-16 shadow-none bg-[#A67EEA] hover:bg-[#8B5CF6] font-poppins"
          >
            Add List +
          </Button>
        </Link>
        <Link href="/check-lists" className="sm:w-auto w-full">
          <Button
            variant="outline"
            className="rounded-full text-lg font-semibold px-16 text-primary bg-white hover:bg-white/10 shadow-none border-1 font-poppins"
          >
            Add Task +
          </Button>
        </Link>
      </div>

      {/* Checklist Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-white/20">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full"
        >
          {lists?.map((list, index) => (
            <AccordionItem
              key={list._id || index}
              value={`item-${index}`}
              className={cn(
                "border-b border-gray-100 last:border-b-0 transition-all duration-300",
                openItems.includes(`item-${index}`) ? "bg-white" : "bg-gray-50/30"
              )}
            >

              <AccordionTrigger
                className="px-6 py-6 hover:no-underline group w-full"
              >
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[22px] font-semibold text-[#3D3177] leading-tight">
                      {list.title}
                    </span>
                    {!openItems.includes(`item-${index}`) && list.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1 font-normal">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-all duration-300",
                    openItems.includes(`item-${index}`)
                      ? "bg-[#F3E8FF] text-[#A97AEC] rotate-180"
                      : "bg-[#F3E8FF] text-[#A97AEC]"
                  )}>
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-0">
                <div className="space-y-0">
                  {list.items?.map((item, itemIdx) => (
                    <div
                      key={item._id || itemIdx}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 transition-all duration-200 border-t border-gray-50 group/item cursor-pointer",
                        item.is_completed
                          ? "bg-[#F0FDF4]"
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => handleToggle(list._id, item._id)}
                    >
                      {/* Checkbox */}
                      <div className="size-7 flex items-center justify-center shrink-0">
                        {toggleLoading === item._id && isPending ? (
                          <Spinner variant="circle" className="size-5" />
                        ) : (
                          <CheckBox
                            checked={item.is_completed}
                            onCheckedChange={() => handleToggle(list._id, item._id)}
                            className={cn(
                              "size-7 transition-all duration-200",
                              item.is_completed
                                ? "!bg-[#22C55E] !border-[#22C55E] text-white"
                                : "border-2 border-gray-300 bg-white"
                            )}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-medium truncate text-[#3D3177]">
                          {item.title}
                        </h4>
                        <p className="text-sm truncate text-[#1B1343]">
                          {item.description}
                        </p>
                      </div>

                      {/* Eye Icon */}
                      <div className="size-9 rounded-full bg-[#A67EEA] flex items-center justify-center text-white cursor-pointer hover:bg-[#8B5CF6] transition-all transform hover:scale-110 shrink-0 shadow-md">
                        <Eye className="size-5" />
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
    </div>
  );
}
