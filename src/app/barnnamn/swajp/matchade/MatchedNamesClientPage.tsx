"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  InfoIcon,
  Link2,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button, buttonVariants } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import IconDelete from "@/components/svg-icon/icon-delete";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useQueryGetMatchingNames,
  MatchingNameItem,
  MatchingType,
} from "./_api/useQueryGetMatchingNames";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import IconQuestion from "@/components/svg-icon/icon-question";
import { useMutationSwipeTinderName } from "../_api/mutations/useMutationSwipeTinderName";
import IconLike from "@/components/svg-icon/icon-like";
import { useMutationDeleteMatchingName } from "./_api/useMutationDeleteMatchingName";
import { useQueryClient } from "@tanstack/react-query";


function SkeletonCard() {
  return (
    <div className="w-full border border-border rounded-lg p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
        <div className="flex-1 space-y-3">
          <div className="h-7 w-40 rounded bg-primary/10" />
          <div className="flex gap-3">
            <div className="h-5 w-16 rounded-full bg-primary/10" />
            <div className="h-5 w-24 rounded bg-primary/10" />
            <div className="h-5 w-20 rounded bg-primary/10" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="size-5 rounded bg-primary/10" />
          <div className="size-5 rounded bg-primary/10" />
        </div>
      </div>
    </div>
  );
}

function NameCard({ item }: { item: MatchingType }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<"like" | "love" | null>(
    null
  );
  const { mutate: swipeTinderName, isPending: isSwiping } =
    useMutationSwipeTinderName();
  const { mutate: deleteMatch, isPending: isDeleting } =
    useMutationDeleteMatchingName();

  const handleToggle = (action: "like" | "love") => {
    if (!item._id) {
      toast.error(t("matchedNames.cannotSwipe"));
      return;
    }

    if (activeAction === action) {
      setActiveAction(null);
      return;
    }

    swipeTinderName(
      { id: item._id, action },
      {
        onSuccess: () => {
          setActiveAction(action);
          toast.success(t("matchedNames.swipeSuccess"));
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              t("matchedNames.failedUpdateStatus")
          );
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["tinder-names"] });
          queryClient.invalidateQueries({
            queryKey: ["tinder-names-matching"],
          });
        },
      }
    );
  };

  return (
    <Dialog open={openInfoDialog} onOpenChange={setOpenInfoDialog}>
      <Card className="w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-2 sm:p-2.5">
        <div className="flex flex-row items-center gap-2 sm:gap-3">
          {/* Left: name + meta */}
          <div className="flex-1 flex flex-col justify-between gap-0.5">
            <h3 className="text-sm sm:text-[15px] font-semibold text-primary-color leading-tight">
              {item.name}
            </h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-primary-color text-[11px] sm:text-xs">
              <div className="flex items-center gap-1">
                <Heart className="size-3 sm:size-3.5 fill-rose-500 text-rose-500" />
                <span className="font-medium">
                  {item.loved_count} {t("forNameTinder.love")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="size-3 sm:size-3.5 text-primary" />
                <span className="font-medium">
                  {item.liked_count} {t("threads.like")}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="shrink-0 flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <DialogTrigger asChild>
                <InfoIcon className="size-4 cursor-pointer text-primary-color hover:text-primary transition-colors" />
              </DialogTrigger>

              {/* Delete dialog */}
              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <DialogTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-red-50 transition-colors">
                      <IconDelete className="size-4 cursor-pointer text-gray-500 hover:text-red-500 transition-colors" />
                    </button>
                  </DialogTrigger>
                </div>
                <DialogContent className="w-[95vw] sm:max-w-xl text-center bg-white p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
                  <DialogTitle className="sr-only">
                    {t("matchedNames.removeThisName")}
                  </DialogTitle>
                  <SectionHeading className="m-0 text-center text-2xl!">
                    {t("matchedNames.removeThisName")}
                  </SectionHeading>
                  <p className="text-primary-color text-base text-center my-4">
                    {t("matchedNames.deletedForever")}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setOpenDeleteDialog(false)}
                      className="w-full sm:w-41.25"
                    >
                      {t("matchedNames.cancel")}
                    </Button>
                    <Button
                      className="w-full sm:w-41.25"
                      disabled={isDeleting}
                      onClick={() => {
                        if (item._id) {
                          deleteMatch(item._id, {
                            onSuccess: () => setOpenDeleteDialog(false),
                          });
                        }
                      }}
                    >
                      {isDeleting
                        ? t("matchedNames.removing")
                        : t("matchedNames.remove")}
                      <ChevronRight className="size-5" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <ToggleGroup
                type="single"
                value={activeAction || ""}
                onValueChange={(value) => {
                  if (value) handleToggle(value as "like" | "love");
                  else setActiveAction(null);
                }}
                disabled={isSwiping}
                className="gap-2 sm:gap-3"
              >
                <ToggleGroupItem
                  value="love"
                  aria-label="Toggle love"
                  variant="default"
                  size="sm"
                  className="p-0 hover:bg-transparent data-[state=on]:bg-transparent"
                >
                  <Heart
                    className={cn(
                      "size-4 transition-colors",
                      activeAction === "love"
                        ? "fill-rose-500 stroke-rose-500"
                        : "stroke-current"
                    )}
                  />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="like"
                  aria-label="Toggle like"
                  variant="default"
                  size="sm"
                  className="p-0 hover:bg-transparent data-[state=on]:bg-transparent"
                >
                  <ThumbsUp
                    className={cn(
                      "size-4 transition-colors",
                      activeAction === "like"
                        ? "fill-primary stroke-primary"
                        : "stroke-current"
                    )}
                  />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </Card>

      {/* Info dialog content */}
      <DialogContent className="w-[95vw] sm:max-w-xl bg-white p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{item.name}</DialogTitle>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary-color mb-2 border-b border-b-gray-200">
            {item.name}
          </h2>
          <div className="space-y-4">
            <section>
              <p
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: item?.description || t("matchedNames.na"),
                }}
              ></p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MatchedNamesClientPage() {
  const [activeTab, setActiveTab] = useState("liked");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser?.roles?.[0]?.name || "user";

  // Always fetch the full matched list; the tab only controls sort order.
  const { data, isLoading, isError } = useQueryGetMatchingNames(
    "all",
    role === "user" ? "" : storedUser.inviter_id
  );
  const items = data?.items ?? [];
  const firstItem = items[0];

  // Show ALL matched names regardless of tab. "Mest gillade" / "Mest älskade"
  // are only sort buttons, not filters.
  const listToRender = React.useMemo(() => {
    const map = new Map<string, MatchingType>();
    [...(firstItem?.loved ?? []), ...(firstItem?.liked ?? [])].forEach((n) => {
      if (n?._id && !map.has(n._id)) map.set(n._id, n);
    });
    const list = Array.from(map.values());
    return list.sort((a, b) =>
      activeTab === "loved"
        ? (b.loved_count ?? 0) - (a.loved_count ?? 0)
        : (b.liked_count ?? 0) - (a.liked_count ?? 0)
    );
  }, [firstItem, activeTab]);

  const [shareLink, setShareLink] = useState("");

  React.useEffect(() => {
    if (firstItem) {
      const link = `${window.location.origin}/barnnamn/swajp/delad/${firstItem.user_id}-${firstItem.partner_id}?filter=love`;
      setShareLink(link);
    } else {
      setShareLink("");
    }
  }, [firstItem]);

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    toast.success(t("matchedNames.linkCopied"));
  };
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="">
        <IconHeading
          text={t("matchedNames.title")}
          icon={<IconQuestion />}
          className="text-primary justify-center"
        />

        <SectionHeading className="m-0 text-center">
          {t("matchedNames.title")}
        </SectionHeading>

        <p className="text-base mt-3 text-primary-color text-center mb-6 max-w-3xl mx-auto">
          {t("threads.subtitle")}
        </p>
        <div className="w-full max-w-327 pb-20 mx-auto px-0 mt-16">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-4 sm:px-9 pt-8 pb-8 shadow-sm">
            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
                <h2 className="text-[28px] sm:text-[32px] md:text-[42px] font-semibold text-primary-color tracking-tight">
                  {t("matchedNames.title")}
                </h2>
                <Link
                  href="/barnnamn/swajp"
                  className={cn(
                    "w-fit",
                    buttonVariants({ variant: "outline" })
                  )}
                >
                  <ChevronLeft className="size-4" />
                  {t("matchedNames.back")}
                </Link>
              </div>

              {shareLink && (
                <div className="flex items-center gap-2 rounded-md border border-primary text-primary bg-primary/10 w-full max-w-xl px-3 py-2">
                  <Link2 className="shrink-0 size-5" />
                  <span className="truncate flex-1 text-sm sm:text-base">
                    {shareLink}
                  </span>
                  <Copy
                    onClick={handleCopy}
                    className="ml-auto cursor-pointer hover:opacity-70 transition-opacity shrink-0 size-5"
                  />
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-[#F0F0F0] pb-6 mb-6">
                <h2 className="text-[28px] md:text-[32px] lg:text-[42px] font-semibold text-primary-color tracking-tight">
                  {t("matchedNames.allNames")}
                </h2>
                <TabsList
                  variant="pill"
                  className="bg-white shadow-sm border border-white text-primary-color"
                >
                  <TabsTrigger value="liked" variant="pill">
                    {t("matchedNames.mostLiked")}
                  </TabsTrigger>
                  <TabsTrigger value="loved" variant="pill">
                    {t("matchedNames.mostLoved")}
                  </TabsTrigger>
                </TabsList>
              </div>

              {["liked", "loved"].map((tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="m-0 flex flex-col gap-2.5"
                >
                  {isLoading && (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  )}
                  {isError && (
                    <p className="text-center text-red-500 py-4">
                      {t("matchedNames.failedLoad")}
                    </p>
                  )}
                  {!isLoading &&
                    !isError &&
                    (!listToRender || listToRender.length === 0) && (
                      <p className="text-center text-primary-color py-4">
                        {t("matchedNames.noNamesYet")}
                      </p>
                    )}
                  {listToRender?.map((nameItem: MatchingType, idx: number) => (
                    <NameCard key={`${nameItem.name}-${idx}`} item={nameItem} />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
