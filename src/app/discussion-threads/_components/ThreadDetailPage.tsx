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
  useMutationFlagThread,
  useMutationShareThread,
} from "../_api/mutations/useThreadMutations";
import { usePusherThreadDetailSubscription } from "../_hooks/usePusherSubscription";
import { formatDistanceToNow, isValid } from "date-fns";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ShareModal from "./ShareModal";
import { cn } from "@/lib/utils";
import Loading from "../../loading";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
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
}: {
  reply: ThreadReply;
  threadId: string;
  onReplyLike?: (replyId: string, parentId?: string) => void;
  onReplyFlag?: (replyId: string, parentId?: string) => void;
  isNested?: boolean;
  parentId?: string;
}) {
  const { t } = useTranslation();
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
  const timeAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
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
          <div className="size-12 rounded-full border-2 border-[#A179F2] p-0.5 overflow-hidden">
            <Image
              width={48}
              height={48}
              src={imageLinkGenerator(reply.author?.avatar)}
              alt={reply.author?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* {(reply.nested_replies_count ||
            nestedReplies.length > 0 ||
            isExpanded) && (
            <div className="w-0.5 flex-1 bg-[#F3EAFF] mt-2 mb-2" />
          )} */}
        </div>

        {/* Content */}
        <div className="flex-1 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-lg text-[#4D2C82]">
              {reply.author?.name || "Anonymous"}
            </span>
            <span className="bg-[#EEE4FD] text-[#A179F2] px-2 py-0.5 rounded text-[10px] font-semibold">
              {timeAgo}
            </span>
          </div>

          <p
            className={cn("text-[#5B5B5B] text-base mb-4 leading-relaxed", {
              "bg-primary/10 py-1 px-2 rounded-md": isNested,
            })}
          >
            {reply.content}
          </p>

          <div className="flex items-center gap-6">
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
              View {reply.nested_replies_count} more replies
            </button>
          ) : null}

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <div className="relative mb-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t("threads.writeReply") || "Write a reply..."}
                  className="w-full min-h-25 p-4 text-sm border-2 border-[#A179F2] rounded-xl focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6]/20 placeholder:text-[#A179F2]/40"
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
                  className="border-2 border-[#A179F2] text-[#A179F2] hover:bg-[#FBF8FF] rounded-full px-6 h-10 text-sm font-bold"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white rounded-full px-6 h-10 text-sm font-bold min-w-32"
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
            <div className="mt-6 flex flex-col gap-6 relative">
              <div className="absolute -left-8 -top-6 bottom-0 w-8 border-l-2 border-b-2 border-[#F3EAFF] rounded-bl-xl pointer-events-none" />
              {nestedReplies.map((nestedReply: ThreadReply) => (
                <ReplyCard
                  key={nestedReply._id}
                  reply={nestedReply}
                  threadId={threadId}
                  onReplyLike={onReplyLike}
                  onReplyFlag={onReplyFlag}
                  isNested={true}
                  parentId={reply._id}
                />
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
  isOpen = true,
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
        shares: threadDetail.data.shares_count || 0,
      });
    } else if (thread) {
      setCurrentStats({
        likes: thread.likes_count,
        replies: thread.replies_count,
        views: thread.views_count,
        shares: thread.shares_count || 0,
      });
    }
  }, [threadDetail, thread]);

  const toggleLike = useMutationToggleThreadLike();
  const createReply = useMutationCreateReply();
  const toggleReplyLike = useMutationToggleReplyLike();
  const flagReplyMutation = useMutationFlagReply();
  const flagThreadMutation = useMutationFlagThread();
  const shareThreadMutation = useMutationShareThread();

  const handleReplyLike = async (replyId: string, parentId?: string) => {
    if (!threadId) return;
    try {
      await toggleReplyLike.mutateAsync({ threadId, replyId });
      // If it's a top-level reply, we can update the state for immediate UI feedback
      if (!parentId) {
        setReplies((prev = []) =>
          prev.map((r) =>
            r._id === replyId
              ? {
                  ...r,
                  likes_count:
                    (r.likes_count || 0) +
                    (r.likes?.includes(user?._id || "") ? -1 : 1),
                }
              : r
          )
        );
      } else {
        // If it's a nested reply, invalidate the specific nested query
        queryClient.invalidateQueries({
          queryKey: ["get-nested-replies", threadId, parentId],
        });
      }
      // Also refetch main replies to keep everything in sync
      refetchReplies();
    } catch (error: any) {
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
      queryClient.invalidateQueries({
        queryKey: ["get-thread-detail", thread._id],
      });
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
    } catch (error: any) {
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
      <div className="px-10 pt-16 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-4xl font-bold text-[#4D2C82] tracking-tight">
                {title}
              </h2>
              <Badge className="bg-[#EEE4FD] text-[#A179F2] px-4 py-1 rounded-full text-xs font-semibold border-none">
                {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
              </Badge>
            </div>
            <p className="text-[#5B5B5B]  text-lg leading-relaxed max-w-5xl">
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
        <div className="flex items-center gap-10 pt-6 border-t border-[#F3EAFF]">
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
            <IconLove className={cn("size-6", isLiked && "fill-current")} />
            <span className="text-base font-bold">
              {currentStats.likes} {t("threads.like")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5B5B5B]">
            <IconReply className="size-6" />
            <span className="text-base font-bold">
              {currentStats.replies} {t("threads.replies")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5B5B5B]">
            <IconEye className="size-6" />
            <span className="text-base font-bold">
              {currentStats.views} {t("threads.views")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-[#5B5B5B] cursor-pointer hover:text-[#A179F2] transition-colors"
            onClick={onShare}
          >
            <IconShare className="size-6" />
            <span className="text-base font-bold">
              {currentStats.shares} {t("threads.share")}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-colors",
              isFlagged ? "text-primary" : "text-[#5B5B5B] hover:text-[#A179F2]"
            )}
            onClick={() => handleAuthAction(() => setOpenFlagDialog(true))}
          >
            <IconFlag className={cn("size-6", isFlagged && "fill-current")} />
            <span className="text-base font-bold">
              {isFlagged ? t("threads.flagged") : t("threads.flag")}
            </span>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <div id="reply-form" className="px-10 py-8 border-t border-[#F3EAFF]">
        {thread && (
          <form onSubmit={handleReplySubmit} className="max-w-7xl mx-auto">
            <div className="relative mb-6">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t("threads.writeReply") || "Reply Thread......"}
                className="w-full min-h-48 p-6 text-lg border-2 border-[#A179F2] rounded-2xl focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6]/20 placeholder:text-[#A179F2]/40"
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
                className="border-2 border-[#A179F2] text-[#A179F2] hover:bg-[#FBF8FF] rounded-full px-10 h-12 text-lg font-bold"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white rounded-full px-10 h-12 text-lg font-bold min-w-40"
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
        <DialogContent className="sm:max-w-xl text-center bg-white border-none">
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
              {t("common.cancel")}
            </Button>
            <Button
              className="w-40"
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
