"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import IconQuestion from "@/components/svg-icon/icon-question";
import ThreadDetailPage from "../_components/ThreadDetailPage";
import { useQueryGetThreadDetail } from "../_api/queries/useQueryGetThreads";
import Loading from "../../loading";
import { Thread } from "../_types/thread_types";
import { formatDistanceToNow, isValid } from "date-fns";
import { sv, enUS } from "date-fns/locale";
import ShareModal from "../_components/ShareModal";
import { useMutationShareThread } from "../_api/mutations/useThreadMutations";

export default function ThreadDetailClient({ threadId }: { threadId: string }) {
  const { t, locale } = useTranslation();
  const currentLocale = locale === "sv" ? sv : enUS;
  const router = useRouter();

  const { data, isLoading, error } = useQueryGetThreadDetail(threadId);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const shareMutation = useMutationShareThread();

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const onShareSuccess = async () => {
    try {
      await shareMutation.mutateAsync(threadId);
    } catch (error) {
      console.error("Failed to track share:", error);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loading />
        </div>
      </PageContainer>
    );
  }

  if (error || !data?.data) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <SectionHeading className="m-0 text-center">
            {t("threads.notFound")}
          </SectionHeading>
          <Button onClick={() => router.push("/discussion-threads")}>
            {t("common.back")}
          </Button>
        </div>
      </PageContainer>
    );
  }

  const thread = data.data;

  const createdAtDate = thread.createdAt
    ? new Date(thread.createdAt)
    : new Date();
  const timeAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true, locale: currentLocale })
    : "";

  const createdBy = {
    name: thread.author?.name || "Anonymous",
    time: timeAgo,
  };

  const stats = {
    likes: thread.likes_count || 0,
    replies: thread.replies_count || 0,
    views: thread.views_count || 0,
    shares: thread.shares_count || 0,
  };

  // We are not mocking lastReply here because it's not present in ThreadDetailResponse directly,
  // ThreadDetailPage handles its own reply fetching via useInfiniteQueryGetThreadReplies

  return (
    <PageContainer>
      <div className="flex flex-col items-center min-h-screen">
        {/* <div className="thread-header mb-6 flex flex-col items-center text-center">
          <IconHeading
            text={t("threads.label")}
            icon={<IconQuestion />}
            className="text-primary justify-center"
          />

          <SectionHeading className="m-0 text-center">
            {t("threads.detailTitle") || "Thread Detail"}
          </SectionHeading>
        </div> */}
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

        <div className="w-full max-w-7xl bg-white rounded-4xl shadow-sm overflow-hidden px-4 sm:px-9 pt-10 pb-6 mb-20 relative">
          {/* <Button
            variant="outline"
            className="absolute top-8 right-8 rounded-full border-[#DED7F1] text-primary-color hover:bg-[#F6F0FF] px-7 h-11 border-2 hidden md:flex"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-5 mr-1 text-[#DED7F1]" />
            <span className="font-semibold text-base">{t("common.back")}</span>
          </Button> */}

          <Button
            variant="ghost"
            className="md:hidden flex items-center mb-6 pl-0 hover:bg-transparent"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-5 mr-1 text-primary-color" />
            <span className="font-semibold text-base text-primary-color">
              {t("common.back")}
            </span>
          </Button>

          <ThreadDetailPage
            title={thread.title || ""}
            description={thread.description}
            createdBy={createdBy}
            stats={stats}
            thread={thread as Thread}
            onShare={handleShare}
          />
        </div>

        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          title={thread.title || ""}
          threadId={threadId}
          onShare={onShareSuccess}
        />
      </div>
    </PageContainer>
  );
}
