"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import IconLove from "@/components/svg-icon/icon-love";
import IconFlag from "@/components/svg-icon/icon-flag";
import IconShare from "@/components/svg-icon/icon-share";
import IconEye from "@/components/svg-icon/icon-eye";
import IconReply from "@/components/svg-icon/icon-reply";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ThreadStatsProps {
  threadId: string;
  likes: number;
  replies: number;
  views: number;
  shares?: number;
  likesArray?: string[];
  flagsArray?: string[];
  onShare?: () => void;
}

export default function ThreadStats({
  threadId,
  likes,
  replies,
  views,
  shares = 0,
  likesArray = [],
  flagsArray = [],
  onShare,
}: ThreadStatsProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const isLiked = likesArray.includes(user?._id || "");
  const isFlagged = flagsArray.includes(user?._id || "");

  const likeMutation = useMutation({
    mutationFn: (id: string) => api.post(`/threads/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("threads.errorLiking"));
    },
  });

  const flagMutation = useMutation({
    mutationFn: (id: string) => api.post(`/threads/${id}/flag`),
    onSuccess: () => {
      toast.success(t("threads.flagSuccess"));
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("threads.errorFlagging"));
    },
  });

  const handleLike = () => {
    likeMutation.mutate(threadId);
  };

  const handleFlag = () => {
    flagMutation.mutate(threadId);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-10">
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70",
          isLiked ? "text-primary" : "text-secondary"
        )}
        onClick={handleLike}
      >
        <IconLove
          className={cn(
            "size-4 sm:size-5",
            isLiked ? "text-secondary" : "text-transparent"
          )}
        />
        <span className="text-sm sm:text-base font-medium">
          {likes} {t("threads.like")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-secondary">
        <IconReply className="size-4 sm:size-5" />
        <span className="text-sm sm:text-base font-medium">
          {replies} {t("threads.replies")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-secondary">
        <IconEye className="size-4 sm:size-5" />
        <span className="text-sm sm:text-base font-medium">
          {views} {t("threads.views")}
        </span>
      </div>

      <div
        className="flex items-center gap-2 text-secondary cursor-pointer transition-opacity hover:opacity-70"
        onClick={onShare}
      >
        <IconShare className="size-4 sm:size-5" />
        <span className="text-sm sm:text-base font-medium">
          {shares} {t("threads.share")}
        </span>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70",
          isFlagged ? "text-primary" : "text-secondary"
        )}
        onClick={handleFlag}
      >
        <IconFlag
          className={cn("size-4 sm:size-5", isFlagged && "text-secondary")}
        />
        <span className="text-sm sm:text-base font-medium">
          {isFlagged ? t("threads.flagged") : t("threads.flag")}
        </span>
      </div>
    </div>
  );
}
