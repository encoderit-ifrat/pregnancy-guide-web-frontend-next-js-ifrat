"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { ChevronRight, X, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
// import IconReplyWhite from "@/components/svg-icon/icon-reply-white";
import IconLove from "@/components/svg-icon/icon-love";
import IconFlag from "@/components/svg-icon/icon-flag";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import IconShare from "@/components/svg-icon/icon-share";
import { Thread, ThreadReply, ApiResponse } from "../_types/thread_types";
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
  useMutationFlagThread,
  useMutationShareThread,
} from "../_api/mutations/useThreadMutations";
import { usePusherThreadDetailSubscription } from "../_hooks/usePusherSubscription";
import { formatDistanceToNow, isValid } from "date-fns";
import { sv, enUS } from "date-fns/locale";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ShareModal from "./ShareModal";
import { cn } from "@/lib/utils";
import Loading from "../../loading";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useRouter } from "next/navigation";

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
  onClose?: () => void;
  isOpen?: boolean;
  onStatsUpdate?: (stats: {
    likes: number;
    replies: number;
    views: number;
    shares: number;
  }) => void;
}

import { useQueryGetNestedReplies } from "../_api/queries/useQueryGetThreads";
import Image from "next/image";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

function ReplyCard({
  reply,
  threadId,
  onReplyLike,
  onReplyFlag,
  isNested = false,
  parentId,
  depth = 0,
}: {
  reply: ThreadReply;
  threadId: string;
  onReplyLike?: (replyId: string, parentId?: string) => void;
  onReplyFlag?: (replyId: string, parentId?: string) => void;
  isNested?: boolean;
  parentId?: string;
  depth?: number;
}) {
  console.log("👉 ~ ReplyCard ~ reply:", reply);
  const { t, locale } = useTranslation();
  const { user } = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createReply = useMutationCreateReply();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const { data: nestedRepliesData, isLoading: isLoadingNested } =
    useQueryGetNestedReplies({
      threadId,
      replyId: reply._id,
      enabled: isExpanded,
    });

  const handleAuthAction = (action?: () => void) => {
    if (!user) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    action?.();
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(async () => {
      if (!replyContent.trim() || !threadId) return;

      setIsSubmittingReply(true);
      try {
        await createReply.mutateAsync({
          threadId: threadId,
          content: replyContent,
          parent_reply_id: reply._id,
        });
        setReplyContent("");
        setIsReplying(false);
        setIsExpanded(true); // Open nested replies to show the new one
        queryClient.invalidateQueries({
          queryKey: ["get-nested-replies", threadId, reply._id],
        });
        toast.success(t("threads.replyAdded") || "Reply posted successfully");
      } catch (error: any) {
        toast.error(error?.message || t("threads.errorReplying"));
      } finally {
        setIsSubmittingReply(false);
      }
    });
  };

  const createdAtDate = reply.createdAt
    ? new Date(reply.createdAt)
    : new Date();

  const currentLocale = locale === "sv" ? sv : enUS;

  const timeAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, {
        addSuffix: true,
        locale: currentLocale,
      })
    : "";

  const isLiked =
    reply.is_liked || reply.likes?.includes(user?._id || "") || false;
  const isFlagged =
    reply.is_flagged || reply.flags?.includes(user?._id || "") || false;

  const nestedReplies = Array.isArray(nestedRepliesData?.data)
    ? nestedRepliesData.data
    : (nestedRepliesData?.data as any)?.data || [];

  return (
    <div className={cn("flex flex-col w-full", !isNested && "mb-4")}>
      <div className="flex gap-4">
        {/* Avatar and vertical line */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className={cn(
              "rounded-full border-2 border-[#A179F2] p-0.5 overflow-hidden transition-all duration-300",
              depth === 0 ? "size-9" : depth === 1 ? "size-7.5" : "size-6"
            )}
          >
            <Image
              width={48}
              height={48}
              src={imageLinkGenerator(reply.author?.avatar)}
              alt={reply.author?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {(reply.nested_replies_count ||
            nestedReplies.length > 0 ||
            isExpanded) && (
            <div className="w-0.5 flex-1 bg-[#F3EAFF] mt-2 mb-2" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-base text-[#4D2C82]">
              {reply.author?.name || "Anonymous"}
            </span>
            <span className="bg-[#EEE4FD] text-[#A179F2] px-2 py-0.5 rounded text-[10px] font-semibold">
              {timeAgo}
            </span>
          </div>
          <p
            className={cn("text-[#5B5B5B] text-sm mb-4 leading-relaxed", {
              "bg-primary/5 py-2 px-3 rounded-xl": isNested && depth % 2 === 1,
              "bg-primary/10 py-2 px-3 rounded-xl": isNested && depth % 2 === 0,
            })}
          >
            {reply.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAuthAction(() => setIsReplying(!isReplying))}
              className="flex items-center gap-1.5 text-[#5B5B5B] hover:text-[#A179F2] transition-colors"
            >
              <IconReply className="size-4" />
              <span className="text-sm font-bold">{t("threads.reply")}</span>
            </button>

            <button
              onClick={() =>
                handleAuthAction(() => onReplyLike?.(reply._id, parentId))
              }
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isLiked ? "text-primary" : "text-[#5B5B5B] hover:text-[#A179F2]"
              )}
            >
              <IconLove className={cn("size-4", isLiked && "fill-current")} />
              <span className="text-sm font-bold">
                {reply.likes_count} {t("threads.like")}
              </span>
            </button>

            <button
              onClick={() =>
                handleAuthAction(() => onReplyFlag?.(reply._id, parentId))
              }
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isFlagged
                  ? "text-primary"
                  : "text-[#5B5B5B] hover:text-[#A179F2]"
              )}
            >
              <IconFlag className={cn("size-4", isFlagged && "fill-current")} />
              <span className="text-sm font-bold">
                {isFlagged ? t("threads.flagged") : t("threads.flag")}
              </span>
            </button>
          </div>

          {reply.nested_replies_count && !isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-4 text-[#A179F2] text-sm font-bold hover:underline"
            >
              {t("threads.viewMoreReplies", {
                count: reply.nested_replies_count,
              }) || `View ${reply.nested_replies_count} more replies`}
            </button>
          ) : null}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <div className="relative mb-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t("threads.writeReply") || "Write a reply..."}
                  className="w-full min-h-18 p-3 text-sm border-2 border-[#A179F2] rounded-xl focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6]/20 placeholder:text-[#A179F2]/40"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  className="border-2 border-[#A179F2] text-[#A179F2] hover:bg-[#FBF8FF] rounded-full px-4 h-9 text-xs font-bold"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white rounded-full px-4 h-9 text-xs font-bold min-w-28"
                >
                  {isSubmittingReply ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {t("threads.postReply") || "Post Reply"}
                </Button>
              </div>
            </form>
          )}
          {isExpanded && isLoadingNested && (
            <div className="mt-4">
              <Loader2 className="animate-spin size-4 text-[#A179F2]" />
            </div>
          )}
          {isExpanded && nestedReplies.length > 0 ? (
            <div
              className={cn(
                "mt-4 flex flex-col gap-4 relative",
                depth < 4 ? "ml-4" : "ml-2"
              )}
            >
              <div
                className={cn(
                  "absolute -top-6 bottom-0 border-l-2 border-[#F3EAFF] pointer-events-none",
                  depth === 0 ? "-left-8" : depth === 1 ? "-left-7" : "-left-6"
                )}
              />
              {nestedReplies.map((nestedReply: ThreadReply) => (
                <div key={nestedReply._id} className="relative">
                  <div
                    className={cn(
                      "absolute border-b-2 border-[#F3EAFF] rounded-bl-xl pointer-events-none",
                      depth === 0
                        ? "-left-8 w-8 top-6"
                        : depth === 1
                          ? "-left-7 w-7 top-5"
                          : "-left-6 w-6 top-4"
                    )}
                  />
                  <ReplyCard
                    reply={nestedReply}
                    threadId={threadId}
                    onReplyLike={onReplyLike}
                    onReplyFlag={onReplyFlag}
                    isNested={true}
                    parentId={reply._id}
                    depth={depth + 1}
                  />
                </div>
              ))}
            </div>
          ) : null}
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
  onClose,
  isOpen = false,
  onStatsUpdate,
}: ThreadDetailPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const [currentStats, setCurrentStats] = useState(stats);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);

  const { user } = useCurrentUser();
  const router = useRouter();

  const handleAuthAction = (action?: () => void) => {
    if (!user) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    action?.();
  };

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
  console.log(
    "👉 ~ ThreadDetailPage ~ repliesInfiniteData:",
    repliesInfiniteData
  );

  const effectiveThread = threadDetail?.data || thread;
  const isLiked =
    effectiveThread?.is_liked ||
    effectiveThread?.likes?.includes(user?._id || "") ||
    false;
  const isFlagged =
    effectiveThread?.is_flagged ||
    effectiveThread?.flags?.includes(user?._id || "") ||
    false;

  const fullDescription = thread?.description || description || "";

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (threadDetail?.data) {
      const updatedStats = {
        likes: threadDetail.data.likes_count,
        replies: threadDetail.data.replies_count,
        views: threadDetail.data.views_count,
        shares: threadDetail.data.shares_count || 0,
      };

      setCurrentStats(updatedStats);
      onStatsUpdate?.(updatedStats);
    } else if (thread) {
      const fallbackStats = {
        likes: thread.likes_count,
        replies: thread.replies_count,
        views: thread.views_count,
        shares: thread.shares_count || 0,
      };

      setCurrentStats(fallbackStats);
      onStatsUpdate?.(fallbackStats);
    }
  }, [threadDetail, thread]);

  const toggleLike = useMutationToggleThreadLike();
  const createReply = useMutationCreateReply();
  const toggleReplyLike = useMutationToggleReplyLike();
  const flagReplyMutation = useMutationFlagReply();
  const flagThreadMutation = useMutationFlagThread();
  const shareThreadMutation = useMutationShareThread();

  const handleReplyLike = async (replyId: string, parentId?: string) => {
    if (!threadId || !user) return;

    try {
      await toggleReplyLike.mutateAsync({ threadId, replyId });
      // Final sync - refetch to ensure server-side consistency
      refetchReplies();
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["get-nested-replies", threadId, parentId],
        });
      }
    } catch (error: any) {
      // Rollback on error (invalidate to restore correct state)
      refetchReplies();
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["get-nested-replies", threadId, parentId],
        });
      }
      toast.error(error?.message || t("threads.errorLiking"));
    }
  };

  const handleReplyFlag = async (replyId: string, parentId?: string) => {
    if (!threadId) return;
    try {
      await flagReplyMutation.mutateAsync({ threadId, replyId });
      toast.success(t("threads.replyFlagSuccess"));
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["get-nested-replies", threadId, parentId],
        });
      }
      refetchReplies();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("threads.errorFlagging"));
    }
  };

  const handleThreadFlag = async () => {
    if (!threadId) return;
    try {
      await flagThreadMutation.mutateAsync(threadId);
      toast.success(t("threads.flagSuccess"));
      setOpenFlagDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["get-thread-detail", threadId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
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

        // If it's a nested reply, invalidate the nested replies query for the parent
        if (event.reply.parent_reply) {
          const parentId =
            typeof event.reply.parent_reply === "string"
              ? event.reply.parent_reply
              : event.reply.parent_reply._id;

          queryClient.invalidateQueries({
            queryKey: ["get-nested-replies", threadId, parentId],
          });
        }
      }
    },
    onReplyLiked: (event) => {
      // Update top-level replies state
      setReplies((prev = []) =>
        prev.map((r) =>
          r._id === event.reply_id
            ? { ...r, likes_count: event.likes_count }
            : r
        )
      );

      // We don't know the parentId from the event usually,
      // so we might need to search all nested queries or just invalidate.
      // But we can try to find if it exists in any active nested query.
      // For now, simple approach: find the parent if possible or just invalidate.
      // Given the event doesn't have parentId, we'll search the cache keys.
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({
        queryKey: ["get-nested-replies", threadId],
      });

      queries.forEach((query) => {
        const data = query.state.data as ApiResponse<ThreadReply[]> | undefined;
        if (!data) return;

        const repliesArray = Array.isArray(data.data)
          ? data.data
          : ((data.data as any)?.data as ThreadReply[]) || [];

        if (!repliesArray.some((r) => r._id === event.reply_id)) {
          return;
        }

        const updatedReplies = repliesArray.map((r) =>
          r._id === event.reply_id
            ? { ...r, likes_count: event.likes_count }
            : r
        );

        queryClient.setQueryData<ApiResponse<ThreadReply[]>>(query.queryKey, {
          ...data,
          data: Array.isArray(data.data)
            ? (updatedReplies as any)
            : {
                ...(data.data as any),
                data: updatedReplies,
              },
        });
      });
    },
    onReplyDeleted: (event) => {
      setReplies((prev = []) => prev.filter((r) => r._id !== event.reply_id));
    },
  });

  const handleLike = async () => {
    if (!threadId || !user) return;

    try {
      const result = await toggleLike.mutateAsync(threadId);
      // Ensure we have the final correct count
      setCurrentStats((prev) => {
        const updated = {
          ...prev,
          likes: result.data.likes_count,
        };

        onStatsUpdate?.({
          likes: Number(updated.likes),
          replies: Number(updated.replies),
          views: Number(updated.views),
          shares: Number(updated.shares),
        });

        return updated;
      });
      queryClient.invalidateQueries({
        queryKey: ["get-thread-detail", threadId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
    } catch (error: any) {
      // Rollback
      queryClient.invalidateQueries({
        queryKey: ["get-thread-detail", threadId],
      });
      toast.error(error?.message || t("threads.errorLiking"));
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(async () => {
      if (!replyContent.trim() || !thread) return;

      setIsSubmittingReply(true);
      try {
        await createReply.mutateAsync({
          threadId: thread._id,
          content: replyContent,
        });
        setReplyContent("");
        await refetchReplies();
        await refetchThreadDetail();
        toast.success(t("threads.replyAdded"));
      } catch (error: any) {
        toast.error(error?.message || t("threads.errorReplying"));
      } finally {
        setIsSubmittingReply(false);
      }
    });
  };

  return (
    <div className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-y-auto bg-white">
      {/* Thread Header */}
      <div className="px-7 pt-11 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-3xl font-bold text-[#4D2C82] tracking-tight">
                {title}
              </h2>
              <Badge className="bg-[#EEE4FD] text-[#A179F2] px-3 py-0.5 rounded-full text-xs font-semibold border-none">
                {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
              </Badge>
            </div>
            <p className="text-[#5B5B5B]  text-base leading-relaxed max-w-5xl">
              {fullDescription}{" "}
              {/* <span className="text-[#A179F2] font-semibold cursor-pointer hover:underline ml-1">
                {t("articles.readMore")}
              </span> */}
            </p>
          </div>

          <div className="flex flex-col items-end gap-6 shrink-0">
            {lastReply && (
              <div className="text-right">
                <p className="text-[#4D2C82] text-sm font-semibold mb-1">
                  {t("threads.lastReply")}:
                </p>
                <p className="text-[#4D2C82] text-sm opacity-80">
                  {t("threads.agoBy", {
                    time: lastReply.time,
                    user: lastReply.user,
                  })}
                </p>
              </div>
            )}
            {/* <Button
              onClick={() => {
                const replyForm = document.getElementById("reply-form");
                replyForm?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white rounded-full px-8 py-2 h-auto text-lg font-bold flex items-center gap-2"
            >
              {t("threads.reply")}
              <ChevronRight className="size-5" />
            </Button> */}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-7 pt-5 border-t border-[#F3EAFF]">
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-colors",
              isLiked ? "text-primary" : "text-[#5B5B5B] hover:text-[#A179F2]"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleAuthAction(handleLike);
            }}
          >
            <IconLove className={cn("size-4.5", isLiked && "fill-current")} />
            <span className="text-sm font-bold">
              {currentStats.likes} {t("threads.like")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5B5B5B]">
            <IconReply className="size-4.5" />
            <span className="text-sm font-bold">
              {currentStats.replies} {t("threads.replies")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5B5B5B]">
            <IconEye className="size-4.5" />
            <span className="text-sm font-bold">
              {currentStats.views} {t("threads.views")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-[#5B5B5B] cursor-pointer hover:text-[#A179F2] transition-colors"
            onClick={onShare}
          >
            <IconShare className="size-4.5" />
            <span className="text-sm font-bold">
              {currentStats.shares} {t("threads.share")}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-colors",
              isFlagged ? "text-primary" : "text-[#5B5B5B] hover:text-[#A179F2]"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleAuthAction(() => setOpenFlagDialog(true));
            }}
          >
            <IconFlag className={cn("size-4.5", isFlagged && "fill-current")} />
            <span className="text-sm font-bold">
              {isFlagged ? t("threads.flagged") : t("threads.flag")}
            </span>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <div id="reply-form" className="px-7 py-6 border-t border-[#F3EAFF]">
        {thread && (
          <form onSubmit={handleReplySubmit} className="max-w-7xl mx-auto">
            <div className="relative mb-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t("threads.writeReply") || "Reply Thread......"}
                className="w-full min-h-34 p-4 text-base border-2 border-[#A179F2] rounded-2xl focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6]/20 placeholder:text-[#A179F2]/40"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setReplyContent("");
                  onClose?.();
                }}
                className="border-2 border-[#A179F2] text-[#A179F2] hover:bg-[#FBF8FF] rounded-full px-7 h-9 text-base font-bold"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white rounded-full px-7 h-9 text-base font-bold min-w-36"
              >
                {isSubmittingReply ? (
                  <Loader2 className="size-5 animate-spin mr-2" />
                ) : null}
                {t("threads.postReply") || "Post Reply"}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Scrollable Replies List */}
      <div className="px-10 pb-10">
        <h3 className="text-2xl font-bold text-[#4D2C82] mb-8">
          {t("threads.repliesCount", { count: currentStats.replies }) ||
            `Replies (${currentStats.replies})`}
        </h3>
        <div className="flex flex-col gap-8">
          {replies.length > 0 &&
            replies
              .filter((r) => !r.parent_reply)
              .map((reply) => (
                <ReplyCard
                  key={reply._id}
                  reply={reply}
                  threadId={threadId}
                  onReplyLike={handleReplyLike}
                  onReplyFlag={handleReplyFlag}
                />
              ))}
          {replies.length === 0 && (
            <p className="text-center text-[#5B5B5B] opacity-60 py-12 text-lg">
              {t("threads.noReplies")}
            </p>
          )}

          <div ref={loadMoreRef} className="w-full flex justify-center py-6">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-primary">
                <Loading />
              </div>
            )}
            {!hasNextPage && replies.length > 0 && (
              <p className="text-[#5B5B5B] opacity-60 text-center font-semibold">
                {t("threads.noMoreThreads")}
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={openFlagDialog} onOpenChange={setOpenFlagDialog}>
        <DialogContent
          className="sm:max-w-xl text-center bg-white border-none"
          onClick={(e) => e.stopPropagation()}
        >
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
              onClick={(e) => {
                e.stopPropagation();
                setOpenFlagDialog(false);
              }}
              className="w-44"
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="w-44"
              onClick={(e) => {
                e.stopPropagation();
                handleThreadFlag();
              }}
            >
              {t("threads.confirmFlag")}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
