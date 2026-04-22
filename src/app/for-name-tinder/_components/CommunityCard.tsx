"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronRight, Heart, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { TinderNameItem } from "../_api/queries/useQueryGetTinderNames";
import { useMutationSwipeTinderName } from "../_api/mutations/useMutationSwipeTinderName";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CommunityCardProps {
  name: TinderNameItem;
  className?: string;
}

export default function CommunityCard({ name, className }: CommunityCardProps) {
  // console.log("👉 ~ CommunityCard ~ name:", name);
  const { t } = useTranslation();
  const { mutate: swipe, isPending } = useMutationSwipeTinderName();

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Optimistic local counts
  const [likedCount, setLikedCount] = useState(name.liked_count);
  const [lovedCount, setLovedCount] = useState(name.loved_count);
  const [userAction, setUserAction] = useState<"like" | "love" | null>(null);

  const handleSwipe = (action: "like" | "love" | null) => {
    if (!action) {
      if (!userAction) return;
      // Undo current action
      if (userAction === "like") setLikedCount((c) => Math.max(0, c - 1));
      else setLovedCount((c) => Math.max(0, c - 1));
      setUserAction(null);
      // We still call swipe with the original action to toggle it off
      // assuming the backend handles toggling or we have an undo action.
      // If the backend doesn't support undo, we might need a different approach.
      // For now, we'll send the previous action to trigger the backend logic.
      action = userAction;
    } else {
      if (userAction === action) return;

      if (action === "like") {
        setLikedCount((c) => c + 1);
        if (userAction === "love") setLovedCount((c) => Math.max(0, c - 1));
      } else {
        setLovedCount((c) => c + 1);
        if (userAction === "like") setLikedCount((c) => Math.max(0, c - 1));
      }
      setUserAction(action);
    }

    swipe(
      { id: name._id, action },
      {
        onSuccess: (res) => {
          setLikedCount(res.data.liked_count);
          setLovedCount(res.data.loved_count);
        },
        onError: () => {
          setLikedCount(name.liked_count);
          setLovedCount(name.loved_count);
          setUserAction(null);
          toast.error(t("forNameTinder.failedSaveAction"));
        },
      }
    );
  };

  return (
    <>
      <Card
        className={cn(
          "w-full border border-border shadow-[0px_2px_24px_-2px_rgba(169,122,236,0.1)] rounded-md overflow-hidden hover:shadow-sm transition-all p-1.5 sm:p-2 md:p-2.5",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-3">
          <div className="flex-1 flex flex-col justify-between space-y-0.5">
            <h3 className="text-left text-sm sm:text-base lg:text-lg font-semibold text-primary-color leading-tight">
              {name.name}
            </h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
              <ToggleGroup
                type="single"
                value={userAction || ""}
                onValueChange={(val) => handleSwipe((val as "like" | "love") || null)}
                disabled={isPending}
                className="gap-1.5 sm:gap-3"
              >
                {/* Love button */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <ToggleGroupItem
                    value="love"
                    aria-label="Toggle love"
                    variant="default"
                    size="sm"
                    className="p-0 hover:bg-transparent data-[state=on]:bg-transparent"
                  >
                    <Heart className="size-4 group-data-[state=on]/toggle-group-item:fill-rose-500 group-data-[state=on]/toggle-group-item:stroke-rose-500" />
                  </ToggleGroupItem>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-primary-color">
                    {lovedCount} {t("forNameTinder.love")}
                  </span>
                </div>

                {/* Like button */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <ToggleGroupItem
                    value="like"
                    aria-label="Toggle like"
                    variant="default"
                    size="sm"
                    className="p-0 hover:bg-transparent data-[state=on]:bg-transparent"
                  >
                    <ThumbsUp className="size-4 group-data-[state=on]/toggle-group-item:fill-primary group-data-[state=on]/toggle-group-item:stroke-primary" />
                  </ToggleGroupItem>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-primary-color">
                    {likedCount} {t("threads.like")}
                  </span>
                </div>
              </ToggleGroup>
            </div>
          </div>

          {/* Right Side Action Area */}
          <div className="w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:min-w-16">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-2 sm:px-3 h-7 sm:h-8 text-[10px] sm:text-xs"
              onClick={() => setOpenViewDialog(true)}
            >
              <span className="font-semibold">
                {t("forNameTinder.view")}
              </span>
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-xl bg-white p-5">
          <DialogTitle className="sr-only">{name.name}</DialogTitle>
          <div className="space-y-4">
            {/* Header row: name + delete icon */}
            <div className="flex items-start justify-between gap-4 border-b border-b-gray-200 pb-2">
              <h2 className="text-2xl font-bold text-primary-color">
                {name.name}
              </h2>
            </div>

            {/* Name details */}
            <div className="space-y-3">
              <p
                className="leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: name?.description || "" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
