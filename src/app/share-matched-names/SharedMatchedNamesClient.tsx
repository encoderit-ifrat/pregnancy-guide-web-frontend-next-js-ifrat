"use client";
import React, { useState } from "react";
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
} from "../matched-names/_api/useQueryGetMatchingNames";
import { useGuestId } from "@/hooks/useGuestId";
import { useMutationSwipeTinderName } from "../for-name-tinder/_api/mutations/useMutationSwipeTinderName";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

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
}: {
  item: MatchingType;
  guestId: string | null;
}) {
  const { t } = useTranslation();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<"like" | "love" | null>(
    null
  );
  const { mutate: swipe, isPending: isSwiping } = useMutationSwipeTinderName();

  // Toggle: clicking the same action again clears it; clicking a different action switches.
  const handleToggle = (action: "like" | "love") => {
    if (!item._id) return;

    if (activeAction === action) {
      // Deselect — optimistically clear the UI; backend may or may not support un-swipe
      setActiveAction(null);
      return;
    }

    swipe(
      { id: item._id, action, guestId },
      {
        onSuccess: () => {
          setActiveAction(action);
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
      <Card className="w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-4 sm:p-6 md:pt-8 md:pr-13 md:pb-10 md:pl-12">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-9">
          <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
              {item.name}
            </h3>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-primary-color text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Heart className="size-4 sm:size-5 fill-rose-500 text-rose-500" />
                <span className="font-medium">
                  {item.loved_count} {t("forNameTinder.love")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="size-4 sm:size-5 text-primary" />
                <span className="font-medium">
                  {item.liked_count} {t("threads.like")}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <div className="flex items-center gap-4">
              <DialogTrigger asChild>
                <InfoIcon className="size-5 cursor-pointer text-primary-color hover:text-primary transition-colors" />
              </DialogTrigger>

              <ToggleGroup
                type="single"
                value={activeAction || ""}
                onValueChange={(value) => {
                  if (value) handleToggle(value as "like" | "love");
                  else {
                    // ToggleGroup already deselected (value is empty string)
                    setActiveAction(null);
                  }
                }}
                disabled={isSwiping}
                className="gap-4"
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
                      "size-6 transition-colors",
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
                      "size-6 transition-colors",
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
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                {t("matchedNames.description")}
              </h4>
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
  initialData?: any;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialFilter);
  const guestId = useGuestId();

  const tabFilterMap: Record<string, "liked" | "loved" | "all"> = {
    liked: "liked",
    loved: "loved",
  };

  const { data, isLoading, isError } = useQueryGetMatchingNames(
    tabFilterMap[activeTab] ?? "all",
    user_id,
    partner_id,
    true,
    activeTab === initialFilter ? initialData : undefined
  );

  const items = data?.items ?? [];
  const firstItem = items[0];
  const listToRender =
    activeTab === "liked" ? firstItem?.liked : firstItem?.loved;

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
              className="m-0 flex flex-col gap-6"
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
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
