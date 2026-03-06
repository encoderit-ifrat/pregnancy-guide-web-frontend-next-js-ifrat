"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
// import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { ChevronLeft, ChevronRight, Copy, Link2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import CommunityCard from "./_components/CommunityCard";
import {
  useQueryGetRandomTinderName,
  TinderNameGender,
} from "./_api/queries/useQueryGetRandomTinderName";
import { useQueryGetTinderNameCategories } from "./_api/queries/useQueryGetTinderNameCategories";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import IconLike from "@/components/svg-icon/icon-like";
import IconLove from "@/components/svg-icon/icon-love";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SAMPLE_THREADS = [
  {
    id: 1,
    title: "How is Lorem Ipsum?",
    excerpt:
      "Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below...",
    createdBy: {
      name: "Anna",
      time: "2 days ago",
    },
    stats: {
      likes: 25,
      replies: 5,
      views: 320,
      shares: 10,
    },
    lastReply: {
      time: "2h ago",
      user: "Maria",
    },
  },
  {
    id: 2,
    title: "What is Lorem Ipsum?",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book...",
    createdBy: {
      name: "Ifrat Jahan",
      time: "1 day ago",
    },
    stats: {
      likes: 45,
      replies: 12,
      views: "1.2k",
      shares: 5,
    },
    lastReply: {
      time: "1h ago",
      user: "Sathi",
    },
  },
  {
    id: 3,
    title: "Tips for managers sickness",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book...",
    createdBy: {
      name: "Amena Begum",
      time: "3 days ago",
    },
    stats: {
      likes: 98,
      replies: 56,
      views: "2.5k",
      shares: 20,
    },
    lastReply: {
      time: "5h ago",
      user: "Fatema",
    },
  },
  {
    id: 4,
    title: "What is Lorem Ipsum?",
    excerpt:
      "Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below...",
    createdBy: {
      name: "Anna",
      time: "2 days ago",
    },
    stats: {
      likes: 25,
      replies: 5,
      views: 320,
      shares: 10,
    },
    lastReply: {
      time: "5h ago",
      user: "Maria",
    },
  },
];

export default function Page() {
  const { t } = useTranslation();
  const [isNext, setIsNext] = useState(true);
  const [openSwipeDialog, setOpenSwipeDialog] = useState(false);
  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  // stores the real _id of the selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categoriesData, isLoading: categoriesLoading } =
    useQueryGetTinderNameCategories();

  const apiCategories = categoriesData?.data?.data ?? [];

  // initialise selectedCategory once categories are loaded
  useEffect(() => {
    if (apiCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(apiCategories[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    refetch: refetchTinderNames,
  } = useQueryGetRandomTinderName({
    gender: selectedGender,
    category_id: selectedCategory,
    enabled: fetchEnabled,
  });

  // When data arrives open the match dialog
  useEffect(() => {
    if (fetchEnabled && tinderData) {
      setOpenMatchDialog(true);
      setFetchEnabled(false);
    }
  }, [tinderData, fetchEnabled]);
  return (
    <PageContainer>
      <div className="flex flex-col items-center  min-h-screen">
        <SectionHeading className="m-0 text-center text-3xl md:text-4xl lg:text-5xl">
          For Name Tinder
        </SectionHeading>

        <p className="text-base text-primary-color text-center mb-6 max-w-3xl mx-auto">
          {/* {t("threads.subtitle")} */}
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full max-w-2xl mx-auto px-6">
          <Button
            onClick={() => setOpenSwipeDialog(true)}
            // className="flex-1 font-semibold h-12 rounded-full"
            className="w-61.25"
          >
            {/* {t("threads.startThread")} */}
            Start Swiping
            <ChevronRight className="size-4" />
          </Button>

          {/* <Button
            // className="w-full font-semibold h-12 rounded-full"
            variant="outline"
            className="w-61.25"
            onClick={() => setOpenMatchDialog(true)}
          >
            View My Matched Name
            <ChevronRight className="size-4" />
          </Button> */}
          <Link
            href="/matched-names"
            className={cn("w-61.25", buttonVariants({ variant: "outline" }))}
          >
            View My Matched Name
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="w-full max-w-327 pb-20 mx-auto px-4 sm:px-0 mt-16">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-9 pt-8 pl-6 pb-8 shadow-sm">
            <Tabs defaultValue="liked" className="w-full">
              <div className=" space-y-3">
                <h2 className="text-[24px] sm:text-[32px] md:text-[42px] font-semibold text-primary-color tracking-tight">
                  {/* {t("threads.communityThreads")} */}
                  Start Swiping
                </h2>
                <RadioGroup
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg"
                  defaultValue="male"
                  onValueChange={(val) =>
                    setSelectedGender(val as TinderNameGender)
                  }
                >
                  {/* Boy → male */}
                  <div className="relative flex cursor-pointer gap-3 items-center rounded-md border border-input px-2 py-3 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-male"
                      value="male"
                    />

                    <div className="flex items-center size-12 justify-center rounded-md bg-primary/10 p-2">
                      <Image
                        src="/boy.png"
                        alt="boy"
                        width={50}
                        height={50}
                        className="object-cover object-center size-full"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-male"
                    >
                      Boy
                    </label>
                  </div>
                  {/* Girl → female */}
                  <div className="relative flex cursor-pointer gap-3 items-center rounded-md border border-input px-2 py-3 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-female"
                      value="female"
                    />

                    <div className="flex items-center size-12 justify-center rounded-md bg-primary/10 p-2">
                      <Image
                        src="/girl.png"
                        alt="girl"
                        width={50}
                        height={50}
                        className="object-cover object-center size-full"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-female"
                    >
                      Girl
                    </label>
                  </div>
                  {/* Genderless → unisex */}
                  <div className="relative flex cursor-pointer items-center gap-3 rounded-md border border-input px-2 py-3 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                    <RadioGroupItem
                      className="sr-only"
                      id="gender-unisex"
                      value="unisex"
                    />

                    <div className="flex items-center size-12 justify-center rounded-md bg-primary/10 p-2">
                      <Image
                        src="/genderless.png"
                        alt="genderless"
                        width={50}
                        height={50}
                        className="object-cover object-center size-full"
                      />
                    </div>
                    <label
                      className="cursor-pointer font-medium text-foreground leading-none after:absolute after:inset-0"
                      htmlFor="gender-unisex"
                    >
                      Genderless
                    </label>
                  </div>
                </RadioGroup>
                <Button
                  className="w-fit"
                  disabled={tinderLoading}
                  onClick={() => {
                    setFetchEnabled(true);
                    refetchTinderNames();
                    setIsNext(false);
                  }}
                >
                  {tinderLoading ? "Loading..." : "Next"}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-[#F0F0F0] pb-6 mb-6">
                <h2 className="text-[28px] md:text-[32px] lg:text-[42px] font-semibold text-primary-color tracking-tight">
                  Community Names
                </h2>

                <TabsList
                  variant="pill"
                  className="bg-white shadow-sm border border-white text-primary-color"
                  defaultValue="liked"
                >
                  <TabsTrigger value="liked" variant="pill">
                    {t("threads.mostLiked")}
                  </TabsTrigger>
                  <TabsTrigger value="viewed" variant="pill">
                    {t("threads.mostViewed")}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="liked" className="m-0 flex flex-col gap-6">
                {SAMPLE_THREADS.map((thread) => (
                  <CommunityCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
              <TabsContent value="viewed" className="m-0 flex flex-col gap-6">
                {SAMPLE_THREADS.map((thread) => (
                  <CommunityCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Dialog open={openSwipeDialog} onOpenChange={setOpenSwipeDialog}>
        <DialogContent className="w-[95vw] sm:max-w-xl bg-white max-h-[90vh] overflow-y-auto p-6 pt-12">
          <SectionHeading className="m-0 text-2xl sm:text-3xl">
            Start Swiping
          </SectionHeading>
          {categoriesLoading ? (
            <p className="text-center text-primary-color py-4">
              Loading categories…
            </p>
          ) : (
            <RadioGroup
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
            >
              {apiCategories.map((category) => (
                <div
                  key={category._id}
                  className="relative flex cursor-pointer items-center gap-3 rounded-md border border-input px-3 py-2 sm:py-3 shadow-xs outline-none transition-[color,box-shadow] has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                >
                  <RadioGroupItem
                    className="sr-only"
                    id={category._id}
                    value={category._id}
                  />
                  {category.image ? (
                    <div className="flex size-10 sm:size-12 items-center justify-center rounded-md bg-primary/10 p-1 shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="size-full object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="flex size-10 sm:size-12 items-center justify-center rounded-md bg-primary/10 shrink-0 text-primary font-bold text-lg">
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
            className="w-full mt-8"
            onClick={() => {
              setOpenSwipeDialog(false);
            }}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={openMatchDialog} onOpenChange={setOpenMatchDialog}>
        <DialogContent className="sm:max-w-xl bg-white">
          <SectionHeading className="m-0 text-center text-lg!">
            This Name Is Matched
          </SectionHeading>

          {tinderLoading && (
            <p className="text-center text-primary-color py-4">
              Loading names…
            </p>
          )}
          {tinderError && (
            <p className="text-center text-red-500 py-4">
              Failed to load names. Please try again.
            </p>
          )}
          {!tinderLoading && !tinderError && (
            <>
              {(tinderData?.data ?? []).length === 0 ? (
                <p className="text-center text-primary-color py-4">
                  No names found for the selected filters.
                </p>
              ) : (
                (tinderData?.data ?? []).map((nameItem) => (
                  <div key={nameItem.id} className="flex items-center gap-4">
                    <div className="flex size-12 border border-primary rounded-md items-center justify-center">
                      <IconLike />
                    </div>
                    <p className="text-primary-color text-center flex items-center justify-center text-base grow border h-12 border-primary rounded-md">
                      {nameItem.name}
                    </p>
                    <div className="flex size-12 border border-primary rounded-md items-center justify-center">
                      <IconLove />
                    </div>
                  </div>
                ))
              )}
              <Button className="w-99.5 mx-auto">
                Dislike All Names
                <ChevronRight />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
