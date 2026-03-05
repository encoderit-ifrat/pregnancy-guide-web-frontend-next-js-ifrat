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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70",
          isLiked ? "text-primary" : "text-primary-color"
        )}
        onClick={handleLike}
      >
        <IconLove
          className={cn("size-5", isLiked ? "fill-current" : "fill-[#3D3177]")}
        />
        <span className="text-base font-medium">
          {likes} {t("threads.like")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
        <IconReply className="size-5 fill-[#3D3177]" />
        <span className="text-base font-medium">
          {replies} {t("threads.replies")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
        <IconEye className="size-5" />
        <span className="text-base font-medium">
          {views} {t("threads.views")}
        </span>
      </div>

      <div
        className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70"
        onClick={onShare}
      >
        <IconShare className="size-5 fill-[#3D3177]" />
        <span className="text-base font-medium">{t("threads.share")}</span>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70",
          isFlagged ? "text-primary" : "text-primary-color"
        )}
        onClick={handleFlag}
      >
        <IconFlag className={cn("size-5", isFlagged && "fill-current")} />
        <span className="text-base font-medium">
          {isFlagged ? t("threads.flagged") : t("threads.flag")}
        </span>
      </div>
    </div>
  );
}
