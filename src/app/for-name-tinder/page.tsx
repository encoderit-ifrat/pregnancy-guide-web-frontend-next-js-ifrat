"use client";

import { Button } from "@/components/ui/Button";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import IconQuestion from "@/components/svg-icon/icon-question";
import CreateThreadModal from "./_components/CreateThreadModal";
import ThreadCard from "./_components/CommunityCard";
import CommunityCard from "./_components/CommunityCard";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import IconMuslim from "@/components/svg-icon/icon-muslim";
import IconJewish from "@/components/svg-icon/icon-jewish";
import IconWorld from "@/components/svg-icon/icon-world";
import IconSwedish from "@/components/svg-icon/icon-swedish";
import IconChristian from "@/components/svg-icon/icon-christian";
import IconHinduism from "@/components/svg-icon/icon-hinduism";
import IconBuddhism from "@/components/svg-icon/icon-buddhism";
import IconLike from "@/components/svg-icon/icon-like";
import IconLove from "@/components/svg-icon/icon-love";

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
const categories = [
  {
    icon: <IconWorld className="size-7" />,
    label: "South America",
  },
  {
    icon: <IconChristian className="size-7" />,
    label: "Christian",
  },
  {
    icon: <IconMuslim className="size-7" />,
    label: "Muslim",
  },
  {
    icon: <IconWorld className="size-7" />,
    label: "International",
  },
  {
    icon: <IconSwedish className="size-7" />,
    label: "Swedish",
  },
  {
    icon: <IconJewish className="size-7" />,
    label: "Jewish",
  },
  {
    icon: <IconHinduism className="size-7" />,
    label: "Hinduism",
  },
  {
    icon: <IconBuddhism className="size-7" />,
    label: "Buddhism",
  },
];
const items = [
  "Kristin Watson",
  "Marvin McKinney",
  "Leslie Alexander",
  "Kathryn Murphy",
  "Annette Black",
];
export default function Page() {
  const { t } = useTranslation();
  const [openSwipeDialog, setOpenSwipeDialog] = useState(false);
  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  return (
    <PageContainer>
      <div className="flex flex-col items-center  min-h-screen">
        <div className="thread-header mb-16 flex flex-col items-center text-center">
          {/* Section Label */}
          <IconHeading
            // text={t("threads.label")}
            text={"For Name Tinder"}
            icon={<IconQuestion />}
            className="text-primary justify-center"
          />

          <SectionHeading className="m-0 text-center">
            {/* {t("threads.title")} */}
            For Name Tinder
          </SectionHeading>

          <p className="text-base text-primary-color text-center mb-6 max-w-3xl mx-auto">
            {/* {t("threads.subtitle")} */}
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-2xl mx-auto px-6">
            <Button
              onClick={() => setOpenSwipeDialog(true)}
              // className="flex-1 font-semibold h-12 rounded-full"
              className="w-61.25"
            >
              {/* {t("threads.startThread")} */}
              Start Swiping
              <ChevronRight className="size-4" />
            </Button>

            <Button
              // className="w-full font-semibold h-12 rounded-full"
              variant="outline"
              className="w-61.25"
              onClick={() => setOpenMatchDialog(true)}
            >
              {/* {t("threads.myPublished")} */}
              View My Matched Name
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-327  pb-20 mx-auto">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-9 pt-8 pl-6 pb-8 shadow-sm">
            <Tabs defaultValue="newest" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-[#F0F0F0] pb-6">
                <h2 className="text-[32px] md:text-[42px] font-bold text-primary-color tracking-tight">
                  {/* {t("threads.communityThreads")} */}
                  Start Swiping
                </h2>
              </div>

              {/* {SAMPLE_THREADS.map((thread) => (
                <ThreadCard key={thread.id} {...thread} />
              ))} */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-[#F0F0F0] pb-6">
                <h2 className="text-[32px] md:text-[42px] font-bold text-primary-color tracking-tight">
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
                {[...SAMPLE_THREADS].reverse().map((thread) => (
                  <CommunityCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Dialog open={openSwipeDialog} onOpenChange={setOpenSwipeDialog}>
        <DialogContent className="sm:max-w-xl bg-white">
          <SectionHeading className="m-0">Start Swiping</SectionHeading>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.label}
                className="flex items-center gap-2 border border-primary rounded-md p-2"
              >
                <div className="flex size-15 bg-primary/10 items-center justify-center rounded-md p-2">
                  {category.icon}
                </div>
                <p className="text-primary-color text-base">{category.label}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openMatchDialog} onOpenChange={setOpenMatchDialog}>
        <DialogContent className="sm:max-w-xl bg-white">
          <SectionHeading className="m-0 text-center text-lg!">
            This Name Is Matched
          </SectionHeading>

          {items.map((item) => (
            <div key={item} className="flex items-center gap-4">
              <div className="flex size-12 border  border-primary rounded-md items-center justify-center">
                {/* {item} */}
                <IconLike />
              </div>
              <p className="text-primary-color text-center flex items-center justify-center text-base grow border h-12 border-primary rounded-md">
                {item}
              </p>
              <div className="flex size-12 border  border-primary rounded-md items-center justify-center">
                <IconLove />
              </div>
            </div>
          ))}
          <Button className="w-99.5 mx-auto">
            Dislike All Names
            <ChevronRight />
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
