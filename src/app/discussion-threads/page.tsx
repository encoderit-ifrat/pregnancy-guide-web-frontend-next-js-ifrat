"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/Button";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import IconQuestion from "@/components/svg-icon/icon-question";
import CreateThreadModal from "./_components/CreateThreadModal";
import ThreadCard from "./_components/ThreadCard";
import ShareModal from "./_components/ShareModal";
import { usePusherThreadsSubscription } from "./_hooks/usePusherSubscription";
import { useMutationShareThread } from "./_api/mutations/useThreadMutations";
import { ThreadSortOption } from "./_types/thread_types";
import { formatDistanceToNow, isValid } from "date-fns";
import Loading from "../loading";
import api from "@/lib/axios";
import { omitEmpty } from "@/lib/utils";
import { toast } from "sonner";

const PAGE_LIMIT = 4;

const fetchThreads = async ({
  pageParam = 1,
  sort,
}: {
  pageParam?: number;
  sort: ThreadSortOption;
}) => {
  const res = await api.get("/threads", {
    params: omitEmpty({
      sort,
      page: pageParam,
      limit: PAGE_LIMIT,
    }),
  });
  return res.data;
};

export default function Page() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const currentSort =
    (searchParams.get("sort") as ThreadSortOption) || "newest";
  const [activeTab, setActiveTab] = useState<ThreadSortOption>(currentSort);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareThreadId, setShareThreadId] = useState("");
  const [shareThreadTitle, setShareThreadTitle] = useState("");
  const queryClient = useQueryClient();

  const shareMutation = useMutationShareThread();

  const handleShare = async (threadId: string, title: string) => {
    setShareThreadId(threadId);
    setShareThreadTitle(title);
    setShareModalOpen(true);
  };

  const onShareSuccess = async () => {
    if (!shareThreadId) return;
    try {
      await shareMutation.mutateAsync(shareThreadId);
      // We might want to refetch or update local state if needed,
      // but usually the mutation handles it or we rely on the next refresh.
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
    } catch (error) {
      console.error("Failed to track share:", error);
    }
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-threads", activeTab],
    queryFn: ({ pageParam = 1 }) =>
      fetchThreads({ pageParam, sort: activeTab }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.data?.pagination) return undefined;
      const { current_page, last_page } = lastPage.data.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
  });

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNewThread = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleThreadDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

  usePusherThreadsSubscription({
    onNewThread: handleNewThread,
    onThreadDeleted: handleThreadDeleted,
  });

  const likeMutation = useMutation({
    mutationFn: (threadId: string) => api.post(`/threads/${threadId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-threads"] });
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

  const allThreads =
    data?.pages?.flatMap((page: any) => page?.data?.data || page?.data || []) ||
    [];

  const formattedThreads = allThreads.map((thread: any) => {
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
        shares: thread.shares_count || 0,
      },
      lastReply: undefined,
      last_reply_user: thread.last_reply_user,
      thread: thread,
    };
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as ThreadSortOption);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <div className="flex flex-col items-center  min-h-screen">
        <div className="thread-header mb-16 flex flex-col items-center text-center">
          {/* Section Label */}
          <IconHeading
            text={t("threads.label")}
            icon={<IconQuestion />}
            className="text-primary justify-center"
          />

          <SectionHeading className="m-0 text-center">
            {t("threads.title")}
          </SectionHeading>

          <p className="text-base mt-3 text-primary-color text-center mb-6 max-w-3xl mx-auto">
            {t("threads.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto px-6">
            <CreateThreadModal onSuccess={() => refetch()}>
              <Button className="w-full sm:w-fit sm:min-w-61.25 font-semibold ">
                {t("threads.startThread")}
                <ChevronRight className="size-4" />
              </Button>
            </CreateThreadModal>
            <Link href="/published-threads" className="w-full sm:w-fit">
              <Button
                className="w-full sm:min-w-61.25 font-semibold "
                variant="outline"
              >
                {t("threads.myPublished")}
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-327  pb-20 mx-auto px-4 sm:px-0">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-4 sm:px-9 pt-8 pb-8 shadow-sm">
            <Tabs
              defaultValue="newest"
              className="w-full"
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <div className="flex flex-col lg:flex-row justify-between items-center mb-6 md:mb-10 gap-4 border-b border-[#F0F0F0] pb-6">
                <SectionHeading className="text-[28px] md:text-[32px] lg:text-[42px] text-center lg:text-left">
                  {t("threads.communityThreads")}
                </SectionHeading>

                <TabsList
                  variant="pill"
                  className="bg-white shadow-sm border border-white text-primary-color w-full sm:w-fit grid grid-cols-3 sm:flex h-auto sm:h-11 p-1"
                >
                  <TabsTrigger
                    value="most_liked"
                    variant="pill"
                    className="px-2 sm:px-6 text-xs sm:text-sm"
                  >
                    {t("threads.mostLiked")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="most_viewed"
                    variant="pill"
                    className="px-2 sm:px-6 text-xs sm:text-sm"
                  >
                    {t("threads.mostViewed")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="newest"
                    variant="pill"
                    className="px-2 sm:px-6 text-xs sm:text-sm"
                  >
                    {t("threads.newest")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="m-0 flex flex-col gap-6">
                {formattedThreads.length === 0 ? (
                  <p className="text-center text-primary-color opacity-60 py-8">
                    {t("threads.noThreadsYet")}
                  </p>
                ) : (
                  formattedThreads.map((thread: any) => (
                    <ThreadCard
                      key={thread.id}
                      id={thread.id}
                      title={thread.title}
                      description={thread.description}
                      createdBy={thread.createdBy}
                      stats={thread.stats}
                      lastReply={thread.lastReply}
                      lastReplyUser={thread.last_reply_user}
                      thread={thread.thread}
                      onLike={() => handleLike(thread.id)}
                      onFlag={() => handleFlag(thread.id)}
                      onShare={() => handleShare(thread.id, thread.title)}
                    />
                  ))
                )}
              </div>

              <div
                ref={loadMoreRef}
                className="w-full flex justify-center py-4"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-primary-color">
                    <Loading />
                    {/* <span>{t("common.loading")}</span> */}
                  </div>
                )}
                {!hasNextPage && formattedThreads.length > 0 && (
                  <p className="text-primary-color opacity-60">
                    {t("threads.noMoreThreads")}
                  </p>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          title={shareThreadTitle}
          threadId={shareThreadId}
          onShare={onShareSuccess}
        />
      </div>
    </PageContainer>
  );
}
