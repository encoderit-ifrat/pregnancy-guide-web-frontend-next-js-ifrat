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
import { useQueryGetMyThreads } from "../discussion-threads/_api/queries/useQueryGetThreads";
import { usePusherThreadsSubscription } from "../discussion-threads/_hooks/usePusherSubscription";
import { Thread } from "../discussion-threads/_types/thread_types";
import { formatDistanceToNow, isValid } from "date-fns";
import Loading from "../loading";

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
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(page));

  const { data, isLoading, isFetching, refetch } = useQueryGetMyThreads({
    params: { page: currentPage.toString() },
  });

  useEffect(() => {
    if (data?.data) {
      setThreads(data.data);
    }
  }, [data]);

  const handleNewThread = useCallback((event: { thread: Thread }) => {
    setThreads((prev) => [event.thread, ...prev]);
  }, []);

  const handleThreadDeleted = useCallback((event: { thread_id: string }) => {
    setThreads((prev) => prev.filter((t) => t._id !== event.thread_id));
  }, []);

  usePusherThreadsSubscription({
    onNewThread: handleNewThread,
    onThreadDeleted: handleThreadDeleted,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/published-threads?${params.toString()}`);
  };

  if (isLoading || isFetching) {
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
              />
            ))}
            {formattedThreads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-primary-color text-lg">
                  {t("threads.noThreads")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
