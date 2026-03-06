"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import IconQuestion from "@/components/svg-icon/icon-question";
import MyThreadCard from "../discussion-threads/_components/MyThreadCard";
import { useInfiniteQueryGetMyThreads } from "../discussion-threads/_api/queries/useQueryGetThreads";
import { usePusherThreadsSubscription } from "../discussion-threads/_hooks/usePusherSubscription";
import { useInView } from "react-intersection-observer";
import { Thread } from "../discussion-threads/_types/thread_types";
import { formatDistanceToNow, isValid } from "date-fns";
import Loading from "../loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import ShareModal from "../discussion-threads/_components/ShareModal";

const formatThreadForCard = (thread: Thread) => {
  const createdAtDate = thread.createdAt
    ? new Date(thread.createdAt)
    : new Date();
  const timeAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "";

  return {
    id: thread._id,
    title: thread.title || "",
    description: thread.description || "",
    createdBy: {
      name: thread.author?.name || "Anonymous",
      time: timeAgo,
    },
    stats: {
      likes: thread.likes_count || 0,
      replies: thread.replies_count || 0,
      views: thread.views_count || 0,
      shares: 0,
    },
    lastReply: undefined,
    thread: thread,
  };
};

export default function PublishedThreadsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareThreadId, setShareThreadId] = useState("");
  const [shareThreadTitle, setShareThreadTitle] = useState("");

  const handleShare = (threadId: string, title: string) => {
    setShareThreadId(threadId);
    setShareThreadTitle(title);
    setShareModalOpen(true);
  };
  const {
    data: infiniteData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryGetMyThreads({
    params: {
      limit: 1,
    },
  });

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const allThreads =
      infiniteData?.pages?.flatMap(
        (page: any) => page?.data?.data || page?.data || []
      ) || [];
    setThreads(allThreads);
  }, [infiniteData]);

  const handleNewThread = useCallback((event: { thread: Thread }) => {
    setThreads((prev: Thread[]) => [event.thread, ...prev]);
  }, []);

  const handleThreadDeleted = useCallback((event: { thread_id: string }) => {
    setThreads((prev: Thread[]) =>
      prev.filter((t: Thread) => t._id !== event.thread_id)
    );
  }, []);

  usePusherThreadsSubscription({
    onNewThread: handleNewThread,
    onThreadDeleted: handleThreadDeleted,
  });

  const likeMutation = useMutation({
    mutationFn: (threadId: string) => api.post(`/threads/${threadId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-my-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("threads.errorLiking"));
    },
  });

  const flagMutation = useMutation({
    mutationFn: (threadId: string) => api.post(`/threads/${threadId}/flag`),
    onSuccess: () => {
      toast.success(t("threads.flagSuccess"));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("threads.errorFlagging"));
    },
  });

  const handleLike = (threadId: string) => {
    likeMutation.mutate(threadId);
  };

  const handleFlag = (threadId: string) => {
    flagMutation.mutate(threadId);
  };

  if (isLoading) {
    return <Loading />;
  }

  const formattedThreads = threads.map(formatThreadForCard);

  return (
    <PageContainer>
      <div className="flex flex-col items-center min-h-screen">
        <div className="thread-header mb-6 flex flex-col items-center text-center">
          <IconHeading
            text={t("threads.label")}
            icon={<IconQuestion />}
            className="text-primary justify-center"
          />

          <SectionHeading className="m-0 text-center">
            {t("threads.myPublished")}
          </SectionHeading>

          <p className="mb-10 text-base text-primary-color max-w-3xl text-center">
            {t("threads.subtitle")}
          </p>
        </div>

        <div className="w-full max-w-6xl bg-white rounded-4xl shadow-sm overflow-hidden px-9 pt-10 pb-6">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-5xl font-semibold text-[#3D3177]">
              {t("threads.myPublished")}
            </h1>
            <Button
              variant="outline"
              className="rounded-full border-[#DED7F1] text-primary-color hover:bg-[#F6F0FF] px-7 h-11 border-2"
              onClick={() => router.back()}
            >
              <ChevronLeft className="size-5 mr-1 text-[#DED7F1]" />
              <span className="font-semibold text-base">
                {t("common.back")}
              </span>
            </Button>
          </div>

          <div className="flex flex-col">
            {formattedThreads.map((thread) => (
              <MyThreadCard
                key={thread.id}
                title={thread.title}
                description={thread.description}
                createdBy={thread.createdBy}
                stats={thread.stats}
                lastReply={thread.lastReply}
                thread={thread.thread}
                onLike={() => handleLike(thread.id)}
                onFlag={() => handleFlag(thread.id)}
                onShare={() => handleShare(thread.id, thread.title)}
              />
            ))}
            {formattedThreads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-primary-color text-lg">
                  {t("threads.noThreads")}
                </p>
              </div>
            )}

            <div ref={loadMoreRef} className="w-full flex justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-primary-color">
                  <Loading />
                </div>
              )}
              {!hasNextPage && formattedThreads.length > 0 && (
                <p className="text-primary-color opacity-60">
                  {t("threads.noMoreThreads")}
                </p>
              )}
            </div>
          </div>
        </div>
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          title={shareThreadTitle}
          threadId={shareThreadId}
        />
      </div>
    </PageContainer>
  );
}
