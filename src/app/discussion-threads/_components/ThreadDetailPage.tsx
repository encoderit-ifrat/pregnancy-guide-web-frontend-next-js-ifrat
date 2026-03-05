"use client";

import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ChevronRight, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import IconReplyWhite from "@/components/svg-icon/icon-reply-white";
import IconLove from "@/components/svg-icon/icon-love";
import IconFlag from "@/components/svg-icon/icon-flag";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import IconShare from "@/components/svg-icon/icon-share";
import { Thread, ThreadReply } from "../_types/thread_types";
import {
  useQueryGetThreadDetail,
  useInfiniteQueryGetThreadReplies,
} from "../_api/queries/useQueryGetThreads";
import { useInView } from "react-intersection-observer";
import {
  useMutationToggleThreadLike,
  useMutationCreateReply,
  useMutationToggleReplyLike,
  useMutationFlagReply,
} from "../_api/mutations/useThreadMutations";
import { usePusherThreadDetailSubscription } from "../_hooks/usePusherSubscription";
import { formatDistanceToNow, isValid } from "date-fns";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import Loading from "../../loading";

interface Reply {
  id: number;
  user: string;
  date: string;
  content: string;
  likes: number | string;
}

interface ThreadDetailPageProps {
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
  //children: React.ReactNode;
  onShare?: () => void;
  isOpen?: boolean;
}

function ReplyCard({
  reply,
  threadId,
  onReplyLike,
  onReplyFlag,
}: {
  reply: ThreadReply;
  threadId: string;
  onReplyLike?: (replyId: string) => void;
  onReplyFlag?: (replyId: string) => void;
}) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();

  const createdAtDate = reply.createdAt
    ? new Date(reply.createdAt)
    : new Date();
  const timeAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "";

  const isLiked = reply.likes?.includes(user?._id || "") || false;
  const isFlagged = reply.flags?.includes(user?._id || "") || false;

  return (
    <div className="w-full h-31 bg-white rounded-lg overflow-hidden shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] mx-auto">
      <div className="px-7 h-full flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-xl text-primary-color">
              {reply.author?.name || "Anonymous"}
            </span>
            <Badge
              variant="outline"
              className="bg-[#EEE4FD] text-primary-color px-2.5 py-0.5 rounded-full text-[11px] font-medium border-none"
            >
              {timeAgo}
            </Badge>
          </div>
          <p className="text-primary-color text-base max-w-4xl">
            {reply.content}
          </p>
        </div>
        <div className="flex items-center gap-10 shrink-0">
          <div className="flex items-center gap-1.5 text-primary-color cursor-pointer hover:opacity-80 transition-opacity">
            <IconReplyWhite className="size-5" />
            <span className="text-sm font-bold">{t("threads.reply")}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity ${
              isLiked ? "text-primary" : "text-primary-color"
            }`}
            onClick={() => onReplyLike?.(reply._id)}
          >
            <IconLove className={`size-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-bold">
              {reply.likes_count} {t("threads.like")}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity ${
              isFlagged ? "text-primary" : "text-primary-color"
            }`}
            onClick={() => onReplyFlag?.(reply._id)}
          >
            <IconFlag className={`size-5 ${isFlagged ? "fill-current" : ""}`} />
            <span className="text-sm font-bold">
              {isFlagged ? t("threads.flagged") : t("threads.flag")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreadDetailPage({
  title,
  description,
  createdBy,
  stats,
  lastReply,
  thread,
  onShare,
  isOpen = true,
}: ThreadDetailPageProps) {
  const { t } = useTranslation();
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const [currentStats, setCurrentStats] = useState(stats);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);

  const fullDescription = thread?.description || description || "";

  const threadId = thread?._id || "";

  const { data: threadDetail, refetch: refetchThreadDetail } =
    useQueryGetThreadDetail(threadId, isOpen);

  const {
    data: repliesInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchReplies,
  } = useInfiniteQueryGetThreadReplies({
    threadId,
    params: { sort: "newest" },
    enabled: true,
  });

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isOpen && threadId) {
      refetchThreadDetail();
    }
  }, [isOpen, threadId, refetchThreadDetail]);

  useEffect(() => {
    if (threadDetail?.data) {
      setCurrentStats({
        likes: threadDetail.data.likes_count,
        replies: threadDetail.data.replies_count,
        views: threadDetail.data.views_count,
        shares: 0,
      });
    } else if (thread) {
      setCurrentStats({
        likes: thread.likes_count,
        replies: thread.replies_count,
        views: thread.views_count,
        shares: 0,
      });
    }
  }, [threadDetail, thread]);

  const toggleLike = useMutationToggleThreadLike();
  const createReply = useMutationCreateReply();
  const toggleReplyLike = useMutationToggleReplyLike();
  const flagReplyMutation = useMutationFlagReply();

  const handleReplyLike = async (replyId: string) => {
    if (!threadId) return;
    try {
      const result = await toggleReplyLike.mutateAsync({ threadId, replyId });
      setReplies((prev = []) =>
        prev.map((r) =>
          r._id === replyId ? { ...r, likes_count: result.data.likes_count } : r
        )
      );
    } catch (error: any) {
      toast.error(error?.message || t("threads.errorLiking"));
    }
  };

  const handleReplyFlag = async (replyId: string) => {
    if (!threadId) return;
    try {
      await flagReplyMutation.mutateAsync({ threadId, replyId });
      toast.success(t("threads.replyFlagSuccess"));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("threads.errorFlagging"));
    }
  };

  useEffect(() => {
    const allReplies =
      repliesInfiniteData?.pages?.flatMap(
        (page: any) => page?.data?.data || page?.data || []
      ) || [];
    setReplies(allReplies);
  }, [repliesInfiniteData]);

  usePusherThreadDetailSubscription({
    threadId,
    onThreadLiked: (event) => {
      if (thread && event.thread_id === thread._id) {
        setCurrentStats((prev) => ({
          ...prev,
          likes: event.likes_count,
        }));
      }
    },
    onNewReply: (event) => {
      if (event.reply && (!thread || event.reply.thread === thread._id)) {
        setReplies((prev = []) => [event.reply, ...prev]);
        setCurrentStats((prev) => ({
          ...prev,
          replies: event.replies_count,
        }));
      }
    },
    onReplyLiked: (event) => {
      setReplies((prev = []) =>
        prev.map((r) =>
          r._id === event.reply_id
            ? { ...r, likes_count: event.likes_count }
            : r
        )
      );
    },
    onReplyDeleted: (event) => {
      setReplies((prev = []) => prev.filter((r) => r._id !== event.reply_id));
    },
  });

  const handleLike = async () => {
    if (!thread) return;
    try {
      const result = await toggleLike.mutateAsync(thread._id);
      setCurrentStats((prev) => ({
        ...prev,
        likes: result.data.likes_count,
      }));
    } catch (error: any) {
      toast.error(error?.message || t("threads.errorLiking"));
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      await createReply.mutateAsync({
        threadId: thread._id,
        content: replyContent,
      });
      setReplyContent("");
      await refetchReplies();
      toast.success(t("threads.replyAdded"));
    } catch (error: any) {
      toast.error(error?.message || t("threads.errorReplying"));
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div
      className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-hidden bg-white"
      // showCloseButton={false}
    >
      <div className="shrink-0 px-8 pt-20 pb-6 flex justify-center">
        {/* Thread Header (1146x257) */}
        <div className="w-287 h-64 flex items-start gap-6">
          {/* Left Side (930x257) */}
          <div className="w-232 h-full  rounded-lg p-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-3xl font-semibold text-primary-color tracking-tight">
                  {title}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-[#EEE4FD] text-primary-color px-3 py-1 rounded-full text-[11px] font-medium border-none"
                >
                  {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
                </Badge>
              </div>

              <div className="mb-6">
                <p className="text-primary-color text-base leading-relaxed">
                  {fullDescription}{" "}
                  <span className="text-[#9679E1] text-base cursor-pointer hover:underline">
                    {t("articles.readMore")}
                  </span>
                </p>
              </div>
            </div>

            {/* Integrated Stats Area */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                <IconLove className="size-5 fill-[#3D3177]" />
                <span className="text-base font-medium">
                  {currentStats.likes} {t("threads.like")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                <IconReply className="size-5 fill-[#3D3177]" />
                <span className="text-base font-medium">
                  {currentStats.replies} {t("threads.replies")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                <IconEye className="size-5" />
                <span className="text-base font-medium">
                  {currentStats.views} {t("threads.views")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                <IconShare className="size-5 fill-[#3D3177]" />
                <span className="text-base font-medium">
                  {currentStats.shares} {t("threads.share")}
                </span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70",
                  thread?.is_flagged
                )}
              >
                <IconFlag className="size-5" />
                <span className="text-base font-medium">
                  {t("threads.flag")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side (192x169) */}
          <div className="w-48 h-42 rounded-lg p-5 flex flex-col items-center justify-center gap-6">
            {lastReply && (
              <div className="text-center">
                <p className="text-primary-color text-sm font-medium">
                  {t("threads.lastReply")}
                </p>
                <p className="text-primary-color text-sm font-medium opacity-80">
                  {t("threads.agoBy", {
                    time: lastReply.time,
                    user: lastReply.user,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Reply Form */}
      {thread && (
        <div className="px-8 py-4 border-t border-[#F0F0F0]">
          <form onSubmit={handleReplySubmit} className="flex gap-4">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t("threads.writeReply")}
              className="flex-1 min-h-[80px]"
            />
            <Button
              type="submit"
              disabled={isSubmittingReply || !replyContent.trim()}
              className="shrink-0"
            >
              {isSubmittingReply
                ? t("common.sending")
                : t("threads.submitReply")}
            </Button>
          </form>
        </div>
      )}

      {/* Scrollable Replies List */}
      <div className="flex-1 overflow-y-auto px-8 pb-10 min-h-0">
        <div className="flex flex-col gap-5 pt-4">
          {replies.length > 0 &&
            replies.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                threadId={threadId}
                onReplyLike={handleReplyLike}
                onReplyFlag={handleReplyFlag}
              />
            ))}
          {replies.length === 0 && (
            <p className="text-center text-primary-color opacity-60 py-8">
              {t("threads.noReplies")}
            </p>
          )}

          <div ref={loadMoreRef} className="w-full flex justify-center py-4">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-primary-color">
                <Loading />
              </div>
            )}
            {!hasNextPage && replies.length > 0 && (
              <p className="text-primary-color opacity-60 text-center">
                {t("threads.noMoreThreads")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
