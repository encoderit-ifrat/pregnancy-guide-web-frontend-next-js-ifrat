"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
// import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { Link2, ThumbsDown, Loader2, ChevronRight, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import CommunityCard from "./_components/CommunityCard";
import {
  useQueryGetRandomTinderName,
  TinderNameGender,
  TinderName,
} from "./_api/queries/useQueryGetRandomTinderName";
import { useQueryGetTinderNameCategories } from "./_api/queries/useQueryGetTinderNameCategories";
import { useInfiniteQueryGetTinderNames } from "./_api/queries/useQueryGetTinderNames";
import { useMutationSwipeTinderName } from "./_api/mutations/useMutationSwipeTinderName";
import { useMutationDislikeAllTinderNames } from "./_api/mutations/useMutationDislikeAllTinderNames";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import IconLike from "@/components/svg-icon/icon-like";
import IconLove from "@/components/svg-icon/icon-love";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { cn } from "@/lib/utils";
import IconHeading from "@/components/ui/text/IconHeading";
import IconQuestion from "@/components/svg-icon/icon-question";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInView } from "react-intersection-observer";
import Loading from "../loading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { useResetInfiniteScrollOnFocus } from "@/hooks/useResetInfiniteScrollOnFocus";

function SkeletonCommunityCard() {
  return (
    <div className="w-full border border-border rounded-lg p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
        <div className="flex-1 space-y-3">
          <div className="h-7 w-48 rounded bg-primary/10" />
          <div className="flex gap-4">
            <div className="h-5 w-20 rounded bg-primary/10" />
            <div className="h-5 w-20 rounded bg-primary/10" />
          </div>
        </div>
        <div className="h-9 w-24 rounded-md bg-primary/10" />
      </div>
    </div>
  );
}

export default function Page() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("loved");
  const queryClient = useQueryClient();
  // Reset scroll + infinite community names when user returns.
  useResetInfiniteScrollOnFocus({
    queryKeyPrefix: ["tinder-names-infinite"],
    routePrefix: "/for-name-tinder",
  });

  const tabSortMap: Record<string, string> = {
    liked: "most_liked",
    loved: "most_loved",
  };

  const {
    data: namesInfiniteData,
    isLoading: namesLoading,
    isFetchingNextPage: isFetchingNextNames,
    hasNextPage: hasNextNames,
    fetchNextPage: fetchNextNames,
    isError: namesError,
  } = useInfiniteQueryGetTinderNames({ sort: tabSortMap[activeTab] });

  const communityNames =
    namesInfiniteData?.pages?.flatMap(
      (page) => page?.data?.data || page?.data || []
    ) || [];
  // console.log("👉 ~ Page ~ communityNames:", communityNames);

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextNames && !isFetchingNextNames) {
      fetchNextNames();
    }
  }, [inView, hasNextNames, isFetchingNextNames, fetchNextNames]);
  const [openSwipeDialog, setOpenSwipeDialog] = useState(false);
  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  // stores the real _id of the selected category
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFromStartSwiping, setIsFromStartSwiping] = useState(false);
  const [swipeStep, setSwipeStep] = useState<"categories" | "gender">(
    "categories"
  );

  const { data: categoriesData, isLoading: categoriesLoading } =
    useQueryGetTinderNameCategories();

  const apiCategories = categoriesData?.data?.data ?? [];

  // initialise selectedCategory once categories are loaded
  useEffect(() => {
    if (apiCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(apiCategories[0]._id);
    }
  }, [apiCategories]);
  // gender radio: "male" | "female" | "unisex"
  const [selectedGender, setSelectedGender] =
    useState<TinderNameGender>("male");
  // flip to true when user clicks Next in the gender section to fire the query
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const {
    data: tinderData,
    isLoading: tinderLoading,
    isError: tinderError,
    isSuccess: tinderSuccess,
    isFetching: tinderFetching,
    refetch: refetchTinderNames,
  } = useQueryGetRandomTinderName({
    gender: selectedGender,
    category_id: selectedCategory,
    enabled: fetchEnabled,
  });

  const [displayNames, setDisplayNames] = useState<TinderName[]>([]);
  const [matchedName, setMatchedName] = useState<string | null>(null);

  const { mutate: swipeName, isPending: swipePending } =
    useMutationSwipeTinderName();
  const { mutate: dislikeAll, isPending: dislikeAllPending } =
    useMutationDislikeAllTinderNames();

  // When data arrives open the match dialog
  useEffect(() => {
    if (fetchEnabled && tinderSuccess && !tinderFetching) {
      setDisplayNames(tinderData?.data || []);
      setOpenMatchDialog(true);
      setOpenSwipeDialog(false); // Close the category dialog after fetch is complete
      setFetchEnabled(false);
      setMatchedName(null);

      // Reset selections after fetch
      setSelectedGender("male");
      if (apiCategories.length > 0) {
        setSelectedCategory(apiCategories[0]._id);
      } else {
        setSelectedCategory("");
      }
    }
  }, [
    tinderSuccess,
    tinderFetching,
    fetchEnabled,
    apiCategories,
    tinderData,
    // refetchTinderNames,
  ]);
  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("forNameTinder.title")}
          icon={<IconQuestion />}
          className="text-primary justify-center"
        />

        <SectionHeading className="m-0 text-center text-[20px] md:text-[26px] lg:text-[32px]">
          {/* {t("threads.title")} */}
          {t("forNameTinder.title")}
        </SectionHeading>

        <p className="text-sm mt-1.5 text-primary-color text-center mb-4 max-w-3xl mx-auto">
          {t("forNameTinder.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto px-6">
          <Button
            onClick={() => {
              setIsFromStartSwiping(true);
              setSwipeStep("gender");
              setOpenSwipeDialog(true);
            }}
            className="w-full sm:w-fit sm:min-w-48 font-semibold h-10 text-sm"
          >
            {t("forNameTinder.startSwiping")}
            <ChevronRight className="size-4" />
          </Button>
          <Link
            href="/matched-names"
            className={cn(
              "w-full sm:w-fit sm:min-w-48 font-semibold h-10 text-sm",
              buttonVariants({ variant: "outline" })
            )}
          >
            {t("forNameTinder.viewMatchedName")}
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="w-full max-w-327 pb-20 mx-auto px-4 sm:px-0 mt-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-3 sm:px-6 pt-6 pb-6 shadow-sm">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className=" flex flex-col items-start justify-center space-y-2">
                <h2 className="text-[20px] sm:text-[28px] md:text-[36px] font-semibold text-primary-color tracking-tight">
                  {/* {t("threads.communityThreads")} */}
                  {t("forNameTinder.startSwiping")}
                </h2>
                <RadioGroup
                  className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-base"
                  value={selectedGender}
                  onValueChange={(val) =>
                    setSelectedGender(val as TinderNameGender)
                  }
                >
                  {/* Boy → male */}
                  <div className="relative flex flex-col sm:flex-row cursor-pointer gap-2 items-center rounded-md border border-input px-1.5 py-2 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-male"
                      value="male"
                    />

                    <div className="flex items-center w-full sm:w-fit justify-center rounded-md bg-primary/10 p-1.5">
                      <Image
                        src="/boy.png"
                        alt="boy"
                        width={40}
                        height={40}
                        className="object-cover object-center size-9"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-male"
                    >
                      {t("forNameTinder.boy")}
                    </label>
                  </div>
                  {/* Girl → female */}
                  <div className="relative flex flex-col sm:flex-row cursor-pointer gap-2 items-center rounded-md border border-input px-1.5 py-2 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-female"
                      value="female"
                    />

                    <div className="flex items-center w-full sm:w-fit justify-center rounded-md bg-primary/10 p-1.5">
                      <Image
                        src="/girl.png"
                        alt="girl"
                        width={40}
                        height={40}
                        className="object-cover object-center size-9"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-female"
                    >
                      {t("forNameTinder.girl")}
                    </label>
                  </div>
                  {/* Genderless → unisex */}
                  <div className="relative flex flex-col sm:flex-row cursor-pointer items-center gap-2 rounded-md border border-input px-1.5 py-2 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-unisex"
                      value="unisex"
                    />

                    <div className="flex items-center w-full sm:w-fit justify-center rounded-md bg-primary/10 p-1.5">
                      <Image
                        src="/genderless.png"
                        alt="genderless"
                        width={40}
                        height={40}
                        className="object-cover object-center size-7"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-unisex"
                    >
                      {t("forNameTinder.genderless")}
                    </label>
                  </div>
                </RadioGroup>
                <Button
                  className="w-full md:w-fit"
                  disabled={tinderLoading || tinderFetching}
                  onClick={() => {
                    setIsFromStartSwiping(false);
                    setSwipeStep("categories");
                    setOpenSwipeDialog(true);
                  }}
                >
                  {t("common.next")}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-3 border-b border-[#F0F0F0] pb-4 mb-4">
                <h2 className="text-[20px] sm:text-[28px] md:text-[36px] font-semibold text-primary-color tracking-tight">
                  {t("forNameTinder.communityNames")}
                </h2>

                <TabsList
                  variant="pill"
                  className="bg-white shadow-sm border border-white text-primary-color"
                >
                  <TabsTrigger value="loved" variant="pill">
                    {t("threads.mostLoved")}
                  </TabsTrigger>
                  <TabsTrigger value="liked" variant="pill">
                    {t("threads.mostLiked")}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="liked" className="m-0 flex flex-col gap-2">
                {namesLoading && (
                  <>
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                  </>
                )}
                {namesError && (
                  <p className="text-center text-red-500 py-4">
                    {t("forNameTinder.failedLoadNames")}
                  </p>
                )}
                {!namesLoading &&
                  !namesError &&
                  communityNames.length === 0 && (
                    <p className="text-center text-primary-color py-4">
                      {t("forNameTinder.noNamesFound")}
                    </p>
                  )}
                {communityNames.map((item) => (
                  <CommunityCard key={item._id} name={item} />
                ))}

                <div
                  ref={loadMoreRef}
                  className="w-full flex justify-center py-4"
                >
                  {isFetchingNextNames && (
                    <div className="flex items-center gap-2 text-primary-color">
                      <Loading />
                    </div>
                  )}
                  {!hasNextNames && communityNames.length > 0 && (
                    <p className="text-primary-color opacity-60">
                      {t("forNameTinder.noMoreNames")}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="loved" className="m-0 flex flex-col gap-2">
                {namesLoading && (
                  <>
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                  </>
                )}
                {namesError && (
                  <p className="text-center text-red-500 py-4">
                    {t("forNameTinder.failedLoadNames")}
                  </p>
                )}
                {!namesLoading &&
                  !namesError &&
                  communityNames.length === 0 && (
                    <p className="text-center text-primary-color py-4">
                      {t("forNameTinder.noNamesFound")}
                    </p>
                  )}
                {communityNames.map((item) => (
                  <CommunityCard key={item._id} name={item} />
                ))}

                <div
                  ref={loadMoreRef}
                  className="w-full flex justify-center py-4"
                >
                  {isFetchingNextNames && (
                    <div className="flex items-center gap-2 text-primary-color">
                      <Loading />
                    </div>
                  )}
                  {!hasNextNames && communityNames.length > 0 && (
                    <p className="text-primary-color opacity-60">
                      {t("forNameTinder.noMoreNames")}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Dialog open={openSwipeDialog} onOpenChange={setOpenSwipeDialog}>
        <DialogContent className="w-[95vw] sm:max-w-xl bg-white max-h-[90vh] overflow-y-auto p-5 pt-8">
          <DialogTitle className="sr-only">
            {t("forNameTinder.startSwiping")}
          </DialogTitle>
          <SectionHeading className="m-0 text-xl sm:text-2xl mb-4">
            {swipeStep === "categories"
              ? t("forNameTinder.selectCategory")
              : t("forNameTinder.selectGender")}
          </SectionHeading>

          {swipeStep === "categories" ? (
            <>
              {categoriesLoading ? (
                <p className="text-center text-primary-color py-4">
                  {t("forNameTinder.loadingCategories")}
                </p>
              ) : (
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                >
                  {apiCategories.map((category) => (
                    <div
                      key={category._id}
                      className="relative flex cursor-pointer items-center gap-3 rounded-md border border-input px-2 py-1.5 sm:py-2 shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                    >
                      <RadioGroupItem
                        className="sr-only"
                        id={category._id}
                        value={category._id}
                      />
                      {category.image ? (
                        <div className="flex size-8 sm:size-9 items-center justify-center rounded-md bg-primary/10 p-1 shrink-0">
                          <Image
                            src={imageLinkGenerator(category.image)}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="size-full object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex size-8 sm:size-9 items-center justify-center rounded-md bg-primary/10 shrink-0 text-primary font-bold text-base">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <label
                        className="grow cursor-pointer text-sm sm:text-base font-medium text-primary-color after:absolute after:inset-0"
                        htmlFor={category._id}
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              <Button
                className="w-full mt-6"
                disabled={tinderLoading || tinderFetching}
                onClick={() => {
                  setFetchEnabled(true);
                  refetchTinderNames();
                }}
              >
                {tinderLoading || tinderFetching ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.next")
                )}
                {!(tinderLoading || tinderFetching) && (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Gender Selection Step */}
              <RadioGroup
                className="grid grid-cols-1 gap-3 text-base mt-2"
                value={selectedGender}
                onValueChange={(val) =>
                  setSelectedGender(val as TinderNameGender)
                }
              >
                {/* Boy */}
                <div className="relative flex cursor-pointer gap-3 items-center rounded-md border border-input px-3 py-3 shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                  <RadioGroupItem
                    className="sr-only"
                    id="dialog-gender-male"
                    value="male"
                  />
                  <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 shrink-0">
                    <Image
                      src="/boy.png"
                      alt="boy"
                      width={32}
                      height={32}
                      className="object-cover size-8"
                    />
                  </div>
                  <label
                    className="cursor-pointer font-medium text-foreground leading-none flex-1 py-1 after:absolute after:inset-0"
                    htmlFor="dialog-gender-male"
                  >
                    {t("forNameTinder.boy")}
                  </label>
                </div>
                {/* Girl */}
                <div className="relative flex cursor-pointer gap-3 items-center rounded-md border border-input px-3 py-3 shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                  <RadioGroupItem
                    className="sr-only"
                    id="dialog-gender-female"
                    value="female"
                  />
                  <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 shrink-0">
                    <Image
                      src="/girl.png"
                      alt="girl"
                      width={32}
                      height={32}
                      className="object-cover size-8"
                    />
                  </div>
                  <label
                    className="cursor-pointer font-medium text-foreground leading-none flex-1 py-1 after:absolute after:inset-0"
                    htmlFor="dialog-gender-female"
                  >
                    {t("forNameTinder.girl")}
                  </label>
                </div>
                {/* Genderless */}
                <div className="relative flex cursor-pointer gap-3 items-center rounded-md border border-input px-3 py-3 shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                  <RadioGroupItem
                    className="sr-only"
                    id="dialog-gender-unisex"
                    value="unisex"
                  />
                  <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 shrink-0">
                    <Image
                      src="/genderless.png"
                      alt="genderless"
                      width={32}
                      height={32}
                      className="object-cover size-8"
                    />
                  </div>
                  <label
                    className="cursor-pointer font-medium text-foreground leading-none flex-1 py-1 after:absolute after:inset-0"
                    htmlFor="dialog-gender-unisex"
                  >
                    {t("forNameTinder.genderless")}
                  </label>
                </div>
              </RadioGroup>

              <Button
                className="w-full mt-8"
                disabled={tinderLoading || tinderFetching}
                onClick={() => {
                  if (isFromStartSwiping) {
                    setSwipeStep("categories");
                  } else {
                    setFetchEnabled(true);
                    refetchTinderNames();
                  }
                }}
              >
                {tinderLoading || tinderFetching ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.next")
                )}
                {!(tinderLoading || tinderFetching) && (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openMatchDialog} onOpenChange={setOpenMatchDialog}>
        <DialogContent className="sm:max-w-xl bg-white p-5">
          <DialogTitle className="sr-only">
            {t("forNameTinder.thisNameIsMatched")}
          </DialogTitle>
          {matchedName ? (
            <SectionHeading className="m-0 text-center text-base! flex items-center justify-center gap-2">
              <Image src="/check.png" alt="check" width={18} height={18} />
              {matchedName} {t("forNameTinder.thisNameIsMatched")}
            </SectionHeading>
          ) : (
            <div className="h-5"></div>
          )}

          {tinderLoading && (
            <p className="text-center text-primary-color py-4">
              {t("forNameTinder.loadingNames")}
            </p>
          )}
          {tinderError && (
            <p className="text-center text-red-500 py-4">
              {t("forNameTinder.failedLoadNamesTryAgain")}
            </p>
          )}
          {!tinderLoading && !tinderError && (
            <>
              {displayNames.length === 0 ? (
                <p className="text-center text-primary-color py-4">
                  {t("forNameTinder.noNamesFoundFilters")}
                </p>
              ) : (
                displayNames.map((nameItem, index) => {
                  // console.log("👉 ~ Page ~ nameItem:", nameItem);
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <ToggleGroup
                        type="single"
                        onValueChange={(value) => {
                          if (value)
                            swipeName(
                              {
                                id: String(nameItem._id),
                                action: value as "love" | "dislike",
                              },
                              {
                                onSuccess: (res: any) => {
                                  if (res?.data?.partner_liked) {
                                    setMatchedName(nameItem.name);
                                  } else {
                                    setMatchedName(null);
                                  }
                                },
                              }
                            );
                        }}
                        disabled={swipePending}
                        className="flex items-center gap-4 w-full"
                      >
                        <ToggleGroupItem
                          value="dislike"
                          aria-label="Toggle dislike"
                          variant="default"
                          size="sm"
                          className="flex size-12 border border-primary rounded-md items-center justify-center hover:bg-primary/10 transition-colors data-[state=on]:bg-primary/20"
                        >
                          <ThumbsDown className="size-full group-data-[state=on]/toggle-group-item:fill-primary group-data-[state=on]/toggle-group-item:stroke-primary" />
                        </ToggleGroupItem>

                        <p className="text-primary-color text-center flex items-center justify-center text-sm grow border h-12 border-primary rounded-md">
                          {nameItem.name}
                        </p>

                        <ToggleGroupItem
                          value="love"
                          aria-label="Toggle love"
                          variant="default"
                          size="sm"
                          className="flex size-12 border border-primary rounded-md items-center justify-center hover:bg-primary/10 transition-colors data-[state=on]:bg-primary/20"
                        >
                          <Heart className="size-full group-data-[state=on]/toggle-group-item:fill-rose-500 group-data-[state=on]/toggle-group-item:stroke-rose-500" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  );
                })
              )}
              {displayNames.length > 0 && (
                <Button
                  className="w-full sm:w-80 mx-auto h-10 text-sm"
                  disabled={dislikeAllPending}
                  onClick={() => {
                    const ids = displayNames.map((n) => String(n._id || n.id));
                    dislikeAll(ids, {
                      onSuccess: () => {
                        // setOpenMatchDialog(false);
                        setFetchEnabled(true);
                        refetchTinderNames();
                      },
                    });
                  }}
                >
                  {dislikeAllPending
                    ? t("forNameTinder.disliking")
                    : t("forNameTinder.dislikeAll")}
                  <ChevronRight />
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
