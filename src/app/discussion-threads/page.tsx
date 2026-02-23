"use client"

import IconQuestion from '@/components/svg-icon/icon-question'
import { Button } from '@/components/ui/Button'
import IconHeading from '@/components/ui/text/IconHeading'
import { SectionHeading } from '@/components/ui/text/SectionHeading'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThreadCard from './_component/ThreadCard'
import CreateThreadModal from './_component/CreateThreadModal'

const SAMPLE_THREADS = [
  {
    id: 1,
    title: "How is Lorem Ipsum?",
    excerpt: "Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below...",
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
    }
  },
  {
    id: 2,
    title: "What is Lorem Ipsum?",
    excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book...",
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
    }
  },
  {
    id: 3,
    title: "Tips for managers sickness",
    excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book...",
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
    }
  },
  {
    id: 4,
    title: "What is Lorem Ipsum?",
    excerpt: "Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below Share your thoughts and join the conversation below...",
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
    }
  }
];

import Link from 'next/link'
import { PageContainer } from '@/components/layout/PageContainer'

export default function Page() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center  min-h-screen">
        <div className="thread-header mb-16">
          {/* Section Label */}
          <IconHeading
            text="Discussions"
            icon={<IconQuestion />}
            className="text-primary justify-center"
          />

          <SectionHeading className="m-0 text-center">Start a New Thread</SectionHeading>

          <p className="text-base text-primary-color  text-center mb-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-2xl px-6">
            <CreateThreadModal>
              <Button className="flex-1 font-semibold h-12 rounded-full">
                Start a New Thread
                <ChevronRight className="size-4" />
              </Button>
            </CreateThreadModal>
            <Link href="/published-threads" className="flex-1">
              <Button className="w-full font-semibold h-12 rounded-full" variant="outline">
                My Published Threads
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-327  pb-20 mx-auto">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-9 pt-8 pl-6 pb-8 shadow-sm">
           
            <Tabs defaultValue="newest" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-[#F0F0F0] pb-6">
                <h2 className="text-[32px] md:text-[42px] font-bold text-primary-color tracking-tight">
                  Community Threads
                </h2>

                <TabsList variant="pill" className="bg-white shadow-sm border border-white text-primary-color">
                  <TabsTrigger value="liked" variant="pill">
                    Most Liked
                  </TabsTrigger>
                  <TabsTrigger value="viewed" variant="pill">
                    Most Viewed
                  </TabsTrigger>
                  <TabsTrigger value="newest" variant="pill">
                    Newest
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="liked" className="m-0 flex flex-col gap-6">
                {SAMPLE_THREADS.map(thread => (
                  <ThreadCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
              <TabsContent value="viewed" className="m-0 flex flex-col gap-6">
                {[...SAMPLE_THREADS].reverse().map(thread => (
                  <ThreadCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
              <TabsContent value="newest" className="m-0 flex flex-col gap-6">
                {SAMPLE_THREADS.map(thread => (
                  <ThreadCard key={thread.id} {...thread} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
