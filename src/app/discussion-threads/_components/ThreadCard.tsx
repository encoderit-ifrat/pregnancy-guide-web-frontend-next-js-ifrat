import React, { useEffect, useState } from "react";
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
import { useMutationShareThread } from "../_api/mutations/useThreadMutations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, isValid } from "date-fns";
import { enUS, sv as svLocale } from "date-fns/locale";

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
  lastReplyUser?: {
    replied_at: string;
    name: string;
  };
  thread?: Thread;
  className?: string;
  onLike?: () => void;
  onReply?: () => void;
  onFlag?: () => void;
  onShare?: () => void;
  onDialogClose?: () => void;
}

export default function ThreadCard({
  id,
  title,
  description,
  createdBy,
  stats,
  lastReply,
  lastReplyUser,
  thread,
  className,
  onLike,
  onReply,
  onFlag,
  onShare,
  onDialogClose,
}: ThreadCardProps) {
  console.log("👉 ~ ThreadCard ~ lastReplyUser:", lastReplyUser);
  const { t, locale } = useTranslation();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [openReadMoreDialog, setOpenReadMoreDialog] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);
  const [currentShares, setCurrentShares] = useState(stats.shares);

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

  const isFlagged = thread?.flags?.includes(user?._id) || false;
  const isLiked = thread?.likes?.includes(user?._id || "") || false;

  const [liked, setLiked] = useState(isLiked);
  const [flagged, setFlagged] = useState(isFlagged);

  useEffect(() => {
    setLiked(isLiked);
    setFlagged(isFlagged);
  }, [isLiked, isFlagged]);

  const handleAuthAction = (action?: () => void) => {
    if (!user) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    action?.();
  };

  const excerpt =
    description && description.length > 200
      ? description.substring(0, 200) + "..."
      : description || "";

  return (
    <Card
      className={cn(
        "w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-4 sm:p-6 md:pt-8 md:pr-13 md:pb-10 md:pl-12",
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-9">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 sm:mb-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
                {title}
              </h3>
              <Badge
                variant="outline"
                className="bg-[#EEE4FD] text-primary-color border-primary-light text-[10px] sm:text-xs truncate  w-fit"
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-10">
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors hover:text-primary",
                liked ? "text-primary" : "text-secondary"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleAuthAction(() => {
                  setCurrentStats((prev) => ({
                    ...prev,
                    likes: Number(prev.likes) + (liked ? -1 : 1),
                  }));
                  setLiked((prev) => !prev);
                  onLike?.();
                });
              }}
            >
              <IconLove className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {currentStats.likes} {t("threads.like")}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 text-secondary"
              )}
            >
              <IconReply className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {currentStats.replies} {t("threads.replies")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-secondary">
              <IconEye className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {currentStats.views} {t("threads.views")}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors hover:text-primary text-secondary"
              onClick={handleShareClick}
            >
              <IconShare className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {currentShares} {t("threads.share")}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors hover:text-primary",
                flagged ? "text-primary" : "text-secondary"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleAuthAction(() => setOpenFlagDialog(true));
              }}
            >
              <IconFlag className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {flagged ? t("threads.flagged") : t("threads.flag")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Action Area */}
        <div className="w-full max-w-xs flex flex-col items-center justify-center gap-3 sm:gap-6 sm:pl-9 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:min-w-37.5">
          {lastReplyUser?.name && (
            <div className="text-center sm:text-left w-full">
              <p className="text-primary-color text-center text-xs sm:text-sm font-medium">
                {t("threads.lastReply")}
              </p>
              <p className="text-primary-color text-center text-[10px] sm:text-xs">
                {`${formatDistanceToNow(new Date(lastReplyUser?.replied_at), {
                  addSuffix: true,
                  locale: locale === "sv" ? svLocale : enUS,
                })} ${t("threads.by")} `}
                {lastReplyUser.name}
              </p>
            </div>
          )}

          <div
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 sm:py-3 rounded-full flex items-center justify-center gap-2 transition-colors w-full sm:w-fit"
            onClick={() => setOpenReadMoreDialog(true)}
          >
            <span className="font-semibold text-xs sm:text-sm">
              {t("threads.reply")}
            </span>
            <ChevronRight className="size-4" />
          </div>
        </div>
      </div>
      <Dialog open={openFlagDialog} onOpenChange={setOpenFlagDialog}>
        <DialogContent className="sm:max-w-xl text-center bg-white">
          <DialogTitle className="sr-only">
            {t("threads.flagTitle")}
          </DialogTitle>
          <SectionHeading className="m-0 text-center">
            {t("threads.flagTitle")}
          </SectionHeading>
          <p className="text-primary-color text-base text-center">
            {t("threads.flagModeratorNotify")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenFlagDialog(false)}
              className="w-full sm:max-w-48"
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="w-full sm:max-w-48"
              onClick={(e) => {
                e.stopPropagation();
                setFlagged(true);
                onFlag?.();
                setOpenFlagDialog(false);
              }}
            >
              {t("threads.confirmFlag")}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openReadMoreDialog}
        onOpenChange={(open) => {
          setOpenReadMoreDialog(open);
          if (!open) {
            onDialogClose?.();
          }
        }}
      >
        <DialogContent className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-hidden bg-white">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <ThreadDetailPage
            title={title}
            description={description}
            createdBy={createdBy}
            stats={currentStats}
            lastReply={lastReply}
            thread={thread}
            onShare={onShare}
            isOpen={openReadMoreDialog}
            onClose={() => setOpenReadMoreDialog(false)}
            onStatsUpdate={(updated) => {
              setCurrentStats((prev) => ({
                ...prev,
                ...updated,
              }));
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
    // </ThreadDetailPage>
  );
}
