"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import IconLove from "@/components/svg-icon/icon-love";
import IconLike from "@/components/svg-icon/icon-like";
import IconDelete from "@/components/svg-icon/icon-delete";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { TinderNameItem } from "../_api/queries/useQueryGetTinderNames";
import { useMutationSwipeTinderName } from "../_api/mutations/useMutationSwipeTinderName";
import { toast } from "sonner";

interface CommunityCardProps {
  name: TinderNameItem;
  className?: string;
}

export default function CommunityCard({ name, className }: CommunityCardProps) {
  const { t } = useTranslation();
  const { mutate: swipe, isPending } = useMutationSwipeTinderName();

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Optimistic local counts
  const [likedCount, setLikedCount] = useState(name.liked_count);
  const [lovedCount, setLovedCount] = useState(name.loved_count);
  const [userAction, setUserAction] = useState<"like" | "love" | null>(null);

  const handleSwipe = (action: "like" | "love") => {
    if (userAction === action) return;

    if (action === "like") {
      setLikedCount((c) => c + 1);
      if (userAction === "love") setLovedCount((c) => Math.max(0, c - 1));
    } else {
      setLovedCount((c) => c + 1);
      if (userAction === "like") setLikedCount((c) => Math.max(0, c - 1));
    }
    setUserAction(action);

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
          toast.error("Failed to save your action. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <Card
        className={cn(
          "w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden hover:shadow-md transition-all p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
          <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
              {name.name}
            </h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              {/* Like button */}
              <button
                disabled={isPending}
                onClick={() => handleSwipe("like")}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  userAction === "like"
                    ? "text-primary"
                    : "text-primary-color hover:text-primary",
                  isPending && "opacity-60 cursor-not-allowed"
                )}
              >
                <IconLike
                  className={cn(
                    "size-4 sm:size-5 transition-transform",
                    userAction === "like" && "scale-110"
                  )}
                />
                <span className="text-sm sm:text-base font-medium">
                  {likedCount} {t("threads.like")}
                </span>
              </button>

              {/* Love button */}
              <button
                disabled={isPending}
                onClick={() => handleSwipe("love")}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  userAction === "love"
                    ? "text-pink-500"
                    : "text-primary-color hover:text-pink-500",
                  isPending && "opacity-60 cursor-not-allowed"
                )}
              >
                <IconLove
                  className={cn(
                    "size-4 sm:size-5 transition-transform",
                    userAction === "love"
                      ? "fill-pink-500 scale-110"
                      : "fill-[#3D3177]"
                  )}
                />
                <span className="text-sm sm:text-base font-medium">
                  {lovedCount} {t("threads.like")}
                </span>
              </button>
            </div>
          </div>

          {/* Right Side Action Area */}
          <div className="w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8"
              onClick={() => setOpenViewDialog(true)}
            >
              <span className="font-semibold text-sm">View</span>
              <ChevronRight className="size-4 sm:size-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-xl bg-white p-8">
          <div className="space-y-6">
            {/* Header row: name + delete icon */}
            <div className="flex items-start justify-between gap-4 border-b border-b-gray-200 pb-3">
              <h2 className="text-3xl font-bold text-primary-color">
                {name.name}
              </h2>
            </div>

            {/* Name details */}
            <div className="space-y-4">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1 text-primary-color">
                  Gender
                </h4>
                <p className="leading-relaxed capitalize">{name.gender}</p>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1 text-primary-color">
                  Category
                </h4>
                <p className="leading-relaxed">{name.category_id.name}</p>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-primary-color">
                  Stats
                </h4>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-primary-color">
                    <IconLike className="size-4" />
                    <span className="font-medium">
                      {likedCount} {t("threads.like")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-color">
                    <IconLove className="size-4 fill-[#3D3177]" />
                    <span className="font-medium">
                      {lovedCount} {t("threads.like")}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
