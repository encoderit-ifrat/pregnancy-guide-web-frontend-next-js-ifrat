"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
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

import { CheckListItemProps, ChecklistItemWithItems } from "../_types/checklist_item_types";

export default function CheckListItem({
  checklistItems,
  overview = false,
  onDeleteAction,
  onEditAction,
}: CheckListItemProps) {
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const [filteredLists, setFilterLists] = useState<ChecklistItemWithItems[]>([]);

  const router = useRouter();

  // FIX: Only update when checklistItems prop changes
  useEffect(() => {
    setFilterLists(checklistItems);
  }, [checklistItems]); // Add dependency array

  function handleChecklistToggle(id: string) {
    setToggleLoading(id);
    toggleChecklist(
      { id },
      {
        onSuccess(res) {
          toast.success("Checklist updated successfully.");
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
              if (allChecked) {
                // toast.success(`"${item.title}" completed and removed! 🎉`);
                return false; // Remove this checklist
              }
              return true; // Keep this checklist
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
    <Accordion type="single" collapsible className="w-full space-y-3">
      {filteredLists?.map((item: ChecklistItemWithItems, index: number) => {
        const hasItemDetails =
          item?.items?.length > 0 &&
          item.items.some((itm) => itm.title && itm.description);

        return (
          <AccordionItem
            key={item._id}
            value={`item-${index}`}
            className="bg-white rounded-2xl shadow-lg border border-purple-100 pr-2"
          >
            <AccordionTrigger
              className={`flex items-center justify-between pr-4${
                !hasItemDetails ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3 size-full p-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-soft" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-2xl font-bold text-foreground w-full max-w-32 md:max-w-md truncate">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {!overview && item.userId && (
                  <div className="flex items-center gap-3">
                    <SquarePen
                      className="size-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAction?.(item);
                      }}
                    />
                    <Trash2
                      className="size-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAction?.(item);
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 rounded-lg space-y-2">
              {item?.items?.map((itm: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleChecklistToggle(itm._id)}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    itm.checked
                      ? "bg-green-50 border-2 border-green-300"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="pt-0.5">
                    {toggleLoading == itm._id && isPending ? (
                      <Spinner variant="circle" />
                    ) : itm.checked ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-lg block ${
                        itm.checked
                          ? "text-green-800 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {itm.title}
                    </span>
                    {itm.description && (
                      <p
                        className={`text-sm mt-1 ${
                          itm.checked
                            ? "text-green-700 opacity-75"
                            : "text-gray-600"
                        }`}
                      >
                        {itm.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
