"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";

import { MoreHorizontal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ThreadDetailPage from "./ThreadDetailPage";
import { Badge } from "@/components/ui/badge";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import IconShare from "@/components/svg-icon/icon-share";
import IconFlag from "@/components/svg-icon/icon-flag";
import { Thread } from "../_types/thread_types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutationShareThread } from "../_api/mutations/useThreadMutations";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";

interface MyThreadCardProps {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    time: string;
  };
  stats: {
    likes: number | string;
    replies: number | string;
    views: number | string;
    shares: number | string;
  };
  lastReply?: {
    time: string;
    user: string;
  };
  thread?: Thread;
  className?: string;
  onLike?: () => void;
  onFlag?: () => void;
  onShare?: () => void;
}

export default function MyThreadCard({
  id,
  title,
  description,
  createdBy,
  stats,
  lastReply,
  thread,
  className,
  onLike,
  onFlag,
  onShare,
}: MyThreadCardProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [openFlagDialog, setOpenFlagDialog] = React.useState(false);
  const [openReadMoreDialog, setOpenReadMoreDialog] = React.useState(false);

  const isLiked = thread?.likes?.includes(user?._id || "") || false;
  const isFlagged = thread?.flags?.includes(user?._id || "") || false;

  const [currentShares, setCurrentShares] = React.useState(stats.shares);
  const shareMutation = useMutationShareThread();

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
    try {
      const res = await shareMutation.mutateAsync(id);
      console.log("Share response:", res);
      if (res.data?.data?.shares_count !== undefined) {
        setCurrentShares(res.data.data.shares_count);
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleAuthAction = (action?: () => void) => {
    if (!user) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    action?.();
  };

  const handleLike = () => {
    onLike?.();
  };
  return (
    // <ThreadDetailPage
    //     title={title}
    //     excerpt={excerpt}
    //     createdBy={createdBy}
    //     stats={stats}
    //     lastReply={lastReply}
    // >
    <Card
      className={cn(
        "border border-[#F3F4F6] rounded-2xl overflow-hidden bg-white mb-6 cursor-pointer hover:shadow-md transition-shadow shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)]",
        className
      )}
    >
      <CardContent className="px-4 py-5 sm:px-8 sm:py-7">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary-color leading-tight">
              {title}
            </h3>
            <Badge
              variant="outline"
              className="bg-[#EEE4FD] text-primary-color px-3 py-0.5 rounded-full text-[10px] sm:text-sm font-medium border-none truncate  w-fit"
            >
              {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
            </Badge>
          </div>
          <button className="text-primary-color h-fit w-fit bg-[#F6F0FF] p-1.5 sm:px-2 rounded-full transition-colors hidden sm:block">
            <MoreHorizontal className="size-4 sm:size-5" />
          </button>
        </div>

        <div className="mb-6 ">
          <p className="text-primary-color text-sm sm:text-base">
            {description}{" "}
            {/* <span className="text-[#9679E1] text-sm sm:text-base cursor-pointer hover:underline">
              {t("articles.readMore")}
            </span> */}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-[#F3F4F6] sm:gap-x-10">
          <div
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors hover:text-primary",
              isLiked ? "text-primary" : "text-secondary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleAuthAction(handleLike);
            }}
          >
            <IconLove
              className={cn(
                "size-3.5 sm:size-4 md:size-5",
                isLiked ? "text-primary" : "text-secondary"
              )}
            />
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {stats.likes} {t("threads.like")}
            </span>
          </div>
          <div
            className={cn("flex items-center gap-1.5 sm:gap-2 text-secondary")}
          >
            <IconReply className="size-3.5 sm:size-4 md:size-5" />
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {stats.replies} {t("threads.replies")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-secondary">
            <IconEye className="size-3.5 sm:size-4 md:size-5" />
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {stats.views} {t("threads.views")}
            </span>
          </div>
          {/* <div
            className="flex items-center gap-1.5 sm:gap-2 text-secondary cursor-pointer"
            onClick={handleShareClick}
          >
            <IconShare className="size-3.5 sm:size-4 md:size-5" />
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {currentShares} {t("threads.share")}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 text-secondary cursor-pointer",
              isFlagged && "text-primary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFlagDialog(true);
            }}
          >
            <IconFlag
              className={cn(
                "size-3.5 sm:size-4 md:size-5",
                isFlagged && "text-secondary"
              )}
            />
            <span className="text-xs sm:text-sm md:text-base font-medium">
              {isFlagged ? t("threads.flagged") : t("threads.flag")}
            </span>
          </div> */}
        </div>
      </CardContent>

      <Dialog open={openFlagDialog} onOpenChange={setOpenFlagDialog}>
        <DialogContent className="sm:max-w-xl text-center bg-white">
          <DialogTitle className="sr-only">
            {t("threads.flagTitle") || "Flag This Content"}
          </DialogTitle>
          <SectionHeading className="m-0 text-center">
            {t("threads.flagTitle") || "Flag This Content"}
          </SectionHeading>
          <p className="text-primary-color text-base text-center">
            {t("threads.flagModeratorNotify") || "This Will Notify Moderators"}
          </p>
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenFlagDialog(false)}
              className="w-40"
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              className="w-40"
              onClick={(e) => {
                e.stopPropagation();
                onFlag?.();
                setOpenFlagDialog(false);
              }}
            >
              {t("threads.confirmFlag") || "Confirm Flag"}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openReadMoreDialog} onOpenChange={setOpenReadMoreDialog}>
        <DialogContent className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-hidden bg-white">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <ThreadDetailPage
            title={title}
            description={description}
            createdBy={createdBy}
            stats={{ ...stats, shares: currentShares }}
            lastReply={lastReply}
            thread={thread}
            onShare={onShare}
            onClose={() => setOpenReadMoreDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
    // </ThreadDetailPage>
  );
}
