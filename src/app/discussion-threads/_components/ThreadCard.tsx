import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ThreadDetailPage from "./ThreadDetailPage";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import IconShare from "@/components/svg-icon/icon-share";
import IconFlag from "@/components/svg-icon/icon-flag";
import { Thread } from "../_types/thread_types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
// import { Dialog, DialogContent } from "@/components/ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ThreadCardProps {
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
  onReply?: () => void;
  onFlag?: () => void;
  onShare?: () => void;
}

export default function ThreadCard({
  id,
  title,
  description,
  createdBy,
  stats,
  lastReply,
  thread,
  className,
  onLike,
  onReply,
  onFlag,
  onShare,
}: ThreadCardProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [openReadMoreDialog, setOpenReadMoreDialog] = useState(false);

  const isFlagged = thread?.flags?.includes(user?._id) || false;
  const isLiked = thread?.likes?.includes(user?._id || "") || false;

  const excerpt =
    description && description.length > 200
      ? description.substring(0, 200) + "..."
      : description || "";

  return (
    <Card
      className={cn(
        "w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-9">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
                {title}
              </h3>
              <Badge
                variant="outline"
                className="bg-[#EEE4FD] text-primary-color border-primary-light text-xs sm:text-sm whitespace-nowrap"
              >
                {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
              </Badge>
            </div>

            <p
              className="text-primary-color text-sm sm:text-base mb-4"
              onClick={() => setOpenReadMoreDialog(true)}
            >
              {excerpt}{" "}
              <span className="text-[#9679E1] font-medium cursor-pointer hover:underline">
                {t("articles.readMore")}
              </span>
            </p>
          </div>

          {/* Footer Stats Area */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-10">
            <div
              className={cn(
                "flex items-center gap-2 text-secondary",
                isLiked ? "text-primary" : "text-secondary"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
            >
              <IconLove
                className={cn(
                  "size-4 sm:size-5"
                  // isLiked ? "text-secondary" : "text-transparent"
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
              className="flex items-center gap-2 text-secondary"
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
                "flex items-center gap-2 text-secondary",
                isFlagged && "text-primary"
              )}
              onClick={() => setOpenFlagDialog(true)}
            >
              <IconFlag
                className={cn(
                  "size-4 sm:size-5",
                  isFlagged && "text-secondary"
                )}
              />
              <span className="text-sm sm:text-base font-medium">
                {isFlagged ? t("threads.flagged") : t("threads.flag")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Action Area */}
        <div className="w-full sm:w-auto flex flex-col items-center justify-center gap-4 sm:gap-6 sm:pl-9 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:min-w-37.5">
          {lastReply && (
            <div className="text-center sm:text-left w-full">
              <p className="text-primary-color text-sm sm:text-base font-medium">
                {t("threads.lastReply")}
              </p>
              <p className="text-primary-color text-xs sm:text-sm">
                {lastReply.time} {t("threads.by")} {lastReply.user}
              </p>
            </div>
          )}
          <div
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-2 transition-colors w-full sm:w-fit"
            onClick={() => setOpenReadMoreDialog(true)}
          >
            <span className="font-semibold text-sm">{t("threads.reply")}</span>
            <ChevronRight className="size-4 sm:size-5" />
          </div>
        </div>
      </div>
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
