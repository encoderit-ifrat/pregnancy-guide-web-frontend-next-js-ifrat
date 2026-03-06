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
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

interface MyThreadCardProps {
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
  const [openFlagDialog, setOpenFlagDialog] = React.useState(false);
  const [openReadMoreDialog, setOpenReadMoreDialog] = React.useState(false);

  const isLiked = thread?.likes?.includes(user?._id || "") || false;
  const isFlagged = thread?.flags?.includes(user?._id || "") || false;

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
        "border border-[#F3F4F6]  rounded-2xl overflow-hidden bg-white mb-6 cursor-pointer hover:shadow-md transition-shadow shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)]",
        className
      )}
    >
      <CardContent className="px-8 py-7">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-primary-color">
              {title}
            </h3>
            <Badge
              variant="outline"
              className="bg-[#EEE4FD] text-primary-color px-3 py-0.5 rounded-full text-sm font-medium border-none whitespace-nowrap"
            >
              {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
            </Badge>
          </div>
          <button className="text-primary-color h-fit w-fit bg-[#F6F0FF] px-2 rounded-full transition-colors">
            <MoreHorizontal className="h-fit w-fit" />
          </button>
        </div>

        <div className="mb-6 ">
          <p className="text-primary-color text-base">
            {description}{" "}
            <span className="text-[#9679E1] text-base cursor-pointer hover:underline">
              {t("articles.readMore")}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-[#F3F4F6] sm:gap-10">
          <div
            className={cn(
              "flex items-center gap-2 text-secondary",
              isLiked ? "text-primary" : "text-secondary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <IconLove
              className={cn(
                "size-4 sm:size-5",
                isLiked ? "text-primary" : "text-secondary"
              )}
            />
            <span className="text-sm sm:text-base font-medium">
              {stats.likes} {t("threads.like")}
            </span>
          </div>
          <div className={cn("flex items-center gap-2 text-secondary")}>
            <IconReply className="size-4 sm:size-5" />
            <span className="text-sm sm:text-base font-medium">
              {stats.replies} {t("threads.replies")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <IconEye className="size-4 sm:size-5" />
            <span className="text-sm sm:text-base font-medium">
              {stats.views} {t("threads.views")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-secondary cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
          >
            <IconShare className="size-4 sm:size-5" />
            <span className="text-sm sm:text-base font-medium">
              {stats.shares} {t("threads.share")}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 text-secondary cursor-pointer",
              isFlagged && "text-primary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFlagDialog(true);
            }}
          >
            <IconFlag
              className={cn("size-4 sm:size-5", isFlagged && "text-secondary")}
            />
            <span className="text-sm sm:text-base font-medium">
              {isFlagged ? t("threads.flagged") : t("threads.flag")}
            </span>
          </div>
        </div>
      </CardContent>

      <Dialog open={openFlagDialog} onOpenChange={setOpenFlagDialog}>
        <DialogContent className="sm:max-w-xl text-center bg-white">
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
          <ThreadDetailPage
            title={title}
            description={description}
            createdBy={createdBy}
            stats={stats}
            lastReply={lastReply}
            thread={thread}
          />
        </DialogContent>
      </Dialog>
    </Card>
    // </ThreadDetailPage>
  );
}
