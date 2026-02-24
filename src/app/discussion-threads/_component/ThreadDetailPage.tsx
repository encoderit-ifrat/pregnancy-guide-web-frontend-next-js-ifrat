"use client";

import React from 'react';
import { useTranslation } from "@/providers/I18nProvider";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import IconEye from "@/components/svg-icon/icon-eye";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import IconShare from "@/components/svg-icon/icon-share";
import IconFlag from "@/components/svg-icon/icon-flag";
import { ChevronRight } from 'lucide-react';
import IconReplyWhite from '@/components/svg-icon/icon-reply-white';


interface Reply {
    id: number;
    user: string;
    date: string;
    content: string;
    likes: number | string;
}

interface ThreadDetailPageProps {
    title: string;
    excerpt: string;
    createdBy: {
        name: string;
        time: string;
    };
    stats: {
        likes: number | string;
        replies: number | string;
        views: number | string;
        shares: number | string;
    };
    lastReply?: {
        time: string;
        user: string;
    };
    children: React.ReactNode;
}

const SAMPLE_REPLIES: Reply[] = [
    {
        id: 1,
        user: "Nowshin",
        date: "12/8/2025",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        likes: 15,
    },
    {
        id: 2,
        user: "Nowshin",
        date: "12/8/2025",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        likes: 15,
    },
    {
        id: 3,
        user: "Nowshin",
        date: "12/8/2025",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        likes: 15,
    },
    {
        id: 4,
        user: "Nowshin",
        date: "12/8/2025",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        likes: 15,
    },
    {
        id: 5,
        user: "Nowshin",
        date: "12/8/2025",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        likes: 15,
    },
];

function ReplyCard({ reply }: { reply: Reply }) {
    const { t } = useTranslation();
    return (
        <div className="w-281 h-31 bg-white rounded-lg overflow-hidden shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] mx-auto">
            <div className="px-7 h-full flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-xl text-primary-color">{reply.user}</span>
                        <Badge variant="outline" className="bg-[#EEE4FD] text-primary-color px-2.5 py-0.5 rounded-full text-[11px] font-medium border-none">
                            {reply.date}
                        </Badge>
                    </div>
                    <p className="text-primary-color text-base max-w-4xl">
                        {reply.content}
                    </p>
                </div>
                <div className="flex items-center gap-10 shrink-0">
                    <div className="flex items-center gap-1.5 text-primary-color cursor-pointer hover:opacity-80 transition-opacity">
                        <IconReplyWhite className="size-5" />
                        <span className="text-sm font-bold">{t("threads.reply")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-color cursor-pointer hover:opacity-80 transition-opacity">
                        <IconLove className="size-5" />
                        <span className="text-sm font-bold">{reply.likes} {t("threads.like")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-color cursor-pointer hover:opacity-80 transition-opacity">
                        <IconFlag className="size-5 " />
                        <span className="text-sm font-bold">{t("threads.flag")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ThreadDetailPage({
    title,
    excerpt,
    createdBy,
    stats,
    lastReply,
    children,
}: ThreadDetailPageProps) {
    const { t } = useTranslation();
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-hidden bg-white"
                showCloseButton={false}
            >
                <DialogTitle className="sr-only">{title}</DialogTitle>

                {/* Custom Close Button */}
                <DialogPrimitive.Close className="absolute top-6 right-6 size-10 bg-white rounded-full border-4 border-[#3D3177] flex items-center justify-center text-primary-color hover:bg-[#F6F0FF] transition-colors z-15 shadow-sm">
                    <span className="text-2xl leading-none font-bold">x</span>
                </DialogPrimitive.Close>

                <div className="shrink-0 px-8 pt-20 pb-6 flex justify-center">
                    {/* Thread Header (1146x257) */}
                    <div className="w-287 h-64 flex items-start gap-6">
                        {/* Left Side (930x257) */}
                        <div className="w-232 h-full  rounded-lg p-7 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <h2 className="text-3xl font-semibold text-primary-color tracking-tight">
                                        {title}
                                    </h2>
                                    <Badge variant="outline" className="bg-[#EEE4FD] text-primary-color px-3 py-1 rounded-full text-[11px] font-medium border-none">
                                        {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
                                    </Badge>
                                </div>

                                <div className="mb-6">
                                    <p className="text-primary-color text-base leading-relaxed">
                                        {excerpt} <span className="text-[#9679E1] text-base cursor-pointer hover:underline">{t("articles.readMore")}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Integrated Stats Area */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-[#F3F4F6]">
                                <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                                    <IconLove className="size-5 fill-[#3D3177]" />
                                    <span className="text-base font-medium">{stats.likes} {t("threads.like")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                                    <IconReply className="size-5 fill-[#3D3177]" />
                                    <span className="text-base font-medium">{stats.replies} {t("threads.replies")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                                    <IconEye className="size-5" />
                                    <span className="text-base font-medium">{stats.views} {t("threads.views")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                                    <IconShare className="size-5 fill-[#3D3177]" />
                                    <span className="text-base font-medium">{stats.shares} {t("threads.share")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary-color cursor-pointer transition-opacity hover:opacity-70">
                                    <IconFlag className="size-5" />
                                    <span className="text-base font-medium">{t("threads.flag")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side (192x169) */}
                        <div className="w-48 h-42 rounded-lg p-5 flex flex-col items-center justify-center gap-6">
                            {lastReply && (
                                <div className="text-center">
                                    <p className="text-primary-color text-sm font-medium">{t("threads.lastReply")}</p>
                                    <p className="text-primary-color text-sm font-medium opacity-80">{t("threads.agoBy", { time: lastReply.time, user: lastReply.user })}</p>
                                </div>
                            )}
                            <button className="bg-[#9A79F1] hover:bg-[#8B6AE0] text-white px-8 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors w-full shadow-sm">
                                <span className="font-semibold text-sm">{t("threads.reply")}</span>
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Replies List */}
                <div className="flex-1 overflow-y-auto px-8 pb-10 min-h-0">
                    <div className="flex flex-col gap-5 pt-4">
                        {SAMPLE_REPLIES.map((reply) => (
                            <ReplyCard key={reply.id} reply={reply} />
                        ))}
                    </div>
                </div>


            </DialogContent>
        </Dialog>
    );
}
