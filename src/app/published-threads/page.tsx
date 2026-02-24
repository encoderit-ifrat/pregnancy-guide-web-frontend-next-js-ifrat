"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MyThreadCard from '../discussion-threads/_component/MyThreadCard';
import IconHeading from '@/components/ui/text/IconHeading';
import IconQuestion from '@/components/svg-icon/icon-question';
import { SectionHeading } from '@/components/ui/text/SectionHeading';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTranslation } from '@/providers/I18nProvider';


const SAMPLE_MY_THREADS = [
    {
        id: 1,
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
            time: "2h ago",
            user: "Maria",
        }
    },
    {
        id: 2,
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
            shares: 5,
        },
        lastReply: {
            time: "1h ago",
            user: "Sathi",
        }
    },
    {
        id: 3,
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
            shares: 15,
        },
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
            shares: 8,
        },
    },
];

export default function PublishedThreadsPage() {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <PageContainer>
            <div className="flex flex-col items-center min-h-screen">
                <div className="thread-header mb-6">
                    {/* Section Label */}
                    <IconHeading
                        text={t("threads.label")}
                        icon={<IconQuestion />}
                        className="text-primary justify-center"
                    />

                    <SectionHeading className="m-0 text-center">{t("threads.myPublished")}</SectionHeading>

                    <p className="text-base text-primary-color max-w-3xl text-center">
                        {t("threads.subtitle")}
                    </p>


                </div>

                <div className="w-full max-w-6xl bg-white rounded-4xl shadow-sm overflow-hidden px-9 pt-10 pb-6">
                    {/* Header Area */}
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-5xl font-semibold text-[#3D3177]">{t("threads.myPublished")}</h1>
                        <Button
                            variant="outline"
                            className="rounded-full border-[#DED7F1] text-primary-color hover:bg-[#F6F0FF] px-7 h-11 border-2"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="size-5 mr-1 text-[#DED7F1]" />
                            <span className="font-semibold text-base">{t("common.back")}</span>
                        </Button>
                    </div>

                    {/* Threads List */}
                    <div className="flex flex-col">
                        {SAMPLE_MY_THREADS.map((thread) => (
                            <MyThreadCard
                                key={thread.id}
                                title={thread.title}
                                excerpt={thread.excerpt}
                                createdBy={thread.createdBy}
                                stats={thread.stats}
                                lastReply={thread.lastReply}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
