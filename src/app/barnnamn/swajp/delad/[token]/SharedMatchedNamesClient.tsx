"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Heart, InfoIcon, ThumbsUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useQueryGetMatchingNames,
  MatchingType,
} from "../../matchade/_api/useQueryGetMatchingNames";
import { useGuestId } from "@/hooks/useGuestId";
import { useMutationVoteListName } from "../../_api/mutations/useMutationVoteListName";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

type NameCategory = {
  _id: string;
  name: string;
  slug: string;
};

type NameItem = {
  _id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  description?: string;
  liked_count: number;
  loved_count: number;
  disliked_count?: number;
  is_active?: boolean;
  category_id?: NameCategory;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type MatchedNamesData = {
  liked: NameItem[];
  loved: NameItem[];
  user_id: string;
  partner_id: string;
};

type MatchedNamesItem = {
  liked: NameItem[];
  loved: NameItem[];
};

type InitialData = {
  success: boolean;
  message: string;
  data: MatchedNamesData;
  items: MatchedNamesItem[];
};

function SkeletonCard() {
  return (
    <div className="w-full border border-border rounded-lg p-4 sm:p-6 md:pt-8 md:pr-13 md:pb-10 md:pl-12 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-9">
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

function NameCard({
  item,
  guestId,
  listOwnerId,
}: {
  item: MatchingType;
  guestId: string | null;
  listOwnerId?: string;
}) {
  const { t } = useTranslation();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<"like" | "love" | null>(
    item.my_action ?? null
  );
  const { mutate: vote, isPending: isVoting } = useMutationVoteListName();

  // Keep the selected state in sync with the server-echoed vote so a page reload
  // shows the visitor's existing vote (instead of resetting and letting a second
  // click silently toggle it off).
  useEffect(() => {
    setActiveAction(item.my_action ?? null);
  }, [item.my_action]);

  // Toggle a vote on this shared list. Sending the currently-active action again
  // removes it server-side; a different action switches. The server returns the
  // resulting vote as `my_action`, which we use as the source of truth.
  const submitVote = (action: "like" | "love") => {
    if (!item._id || !listOwnerId) return;

    vote(
      { id: item._id, action, listOwnerId, guestId },
      {
        onSuccess: (res) => {
          setActiveAction(res.data.my_action ?? null);
          toast.success(t("matchedNames.swipeSuccess"));
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || t("matchedNames.failedSwipe")
          );
        },
      }
    );
  };

  return (
    <Dialog open={openInfoDialog} onOpenChange={setOpenInfoDialog}>
      <Card className="w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-2 sm:p-2.5">
        <div className="flex flex-row items-center gap-2 sm:gap-3">
          <div className="flex-1 flex flex-col justify-between gap-0.5">
            <h3 className="text-sm sm:text-[15px] font-semibold text-primary-color leading-tight">
              {item.name}
            </h3>
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
          <div className="shrink-0 flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <DialogTrigger asChild>
                <InfoIcon className="size-4 cursor-pointer text-primary-color hover:text-primary transition-colors" />
              </DialogTrigger>

              <ToggleGroup
                type="single"
                value={activeAction || ""}
                onValueChange={(value) => {
                  if (value) submitVote(value as "like" | "love");
                  else if (activeAction) {
                    // Deselecting the active pill: re-send it so the server
                    // toggles the vote off (keeps counts in sync).
                    submitVote(activeAction);
                  }
                }}
                disabled={isVoting}
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
      <DialogContent className="sm:max-w-xl bg-white p-8">
        <DialogTitle className="sr-only">{item.name}</DialogTitle>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary-color mb-2 border-b border-b-gray-200">
            {item.name}
          </h2>
          <div className="space-y-4">
            {/* <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                {t("matchedNames.category")}
              </h4>
              <p className="leading-relaxed">{item.category_id?.name}</p>
            </section> */}
            <section>
              {/* <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                {t("matchedNames.description")}
              </h4> */}
              <p
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: item?.description || t("matchedNames.na"),
                }}
              ></p>
            </section>
            {/* <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                {t("matchedNames.gender")}
              </h4>
              <p className="capitalize leading-relaxed">{item.gender}</p>
            </section> */}
            {/* <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                {t("matchedNames.stats")}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("matchedNames.lovedCount")} {item.loved_count}</li>
                <li>{t("matchedNames.likedCount")} {item.liked_count}</li>
              </ul>
            </section> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SharedMatchedNamesClient({
  user_id,
  partner_id,
  initialFilter,
  initialData,
}: {
  user_id?: string;
  partner_id?: string;
  initialFilter: string;
  initialData?: InitialData;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialFilter);
  const guestId = useGuestId();

  // Always fetch the full matched list; the tab only controls sort order.
  // guestId is passed so the API can echo back this visitor's own vote.
  const { data, isLoading, isError } = useQueryGetMatchingNames(
    "all",
    user_id,
    partner_id,
    true,
    initialData,
    guestId
  );

  const items = data?.items ?? [];
  const firstItem = items[0];

  // Show ALL matched names regardless of tab. "Mest gillade" / "Mest älskade"
  // are only sort buttons, not filters.
  const listToRender = React.useMemo(() => {
    const map = new Map<string, MatchingType>();
    [...(firstItem?.loved ?? []), ...(firstItem?.liked ?? [])].forEach(
      (n: MatchingType) => {
        if (n?._id && !map.has(n._id)) map.set(n._id, n);
      }
    );
    const list = Array.from(map.values());
    return list.sort((a, b) =>
      activeTab === "loved"
        ? (b.loved_count ?? 0) - (a.loved_count ?? 0)
        : (b.liked_count ?? 0) - (a.liked_count ?? 0)
    );
  }, [firstItem, activeTab]);

  return (
    <div className="w-full max-w-327 pb-20 mx-auto px-4 sm:px-0 mt-16">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl px-4 sm:px-9 pt-8 pb-8 shadow-sm">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
            <h2 className="text-[32px] md:text-[42px] font-semibold text-primary-color tracking-tight">
              {t("matchedNames.title")}
            </h2>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-[#F0F0F0] pb-6 mb-6">
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
                    {t("matchedNames.noNamesYetShared")}
                  </p>
                )}
              {listToRender?.map((nameItem: MatchingType, idx: number) => (
                <NameCard
                  key={`${nameItem.name}-${idx}`}
                  item={nameItem}
                  guestId={guestId}
                  listOwnerId={user_id}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
