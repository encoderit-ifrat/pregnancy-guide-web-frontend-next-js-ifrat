"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import IconEye from "@/components/svg-icon/icon-eye";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThreadDetailPage from './ThreadDetailPage';


interface MyThreadCardProps {
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
    className?: string;
}

export default function MyThreadCard({
    title,
    excerpt,
    createdBy,
    stats,
    lastReply,
    className
}: MyThreadCardProps) {
    return (
        <ThreadDetailPage
            title={title}
            excerpt={excerpt}
            createdBy={createdBy}
            stats={stats}
            lastReply={lastReply}
        >
            <Card className={cn(
                "border border-[#F3F4F6]  rounded-2xl overflow-hidden bg-white mb-6 cursor-pointer hover:shadow-md transition-shadow shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)]",
                className
            )}>
                <CardContent className="px-8 py-7">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-semibold text-primary-color">
                                {title}
                            </h3>
                            <Badge variant="outline" className="bg-[#EEE4FD] text-primary-color px-3 py-0.5 rounded-full text-sm font-medium border-none whitespace-nowrap">
                                Created by {createdBy.name} · {createdBy.time}
                            </Badge>
                        </div>
                        <button className="text-primary-color hover:bg-[#F6F0FF] p-2 rounded-full transition-colors">
                            <MoreHorizontal className="size-6" />
                        </button>
                    </div>

                     <div className="mb-6 ">
                                <p className="text-primary-color text-base">
                                    {excerpt} <span className="text-[#9679E1] text-base cursor-pointer hover:underline">Read More</span>
                                </p>
                            </div>

                    <div className="flex flex-wrap items-center gap-7">
                        <div className="flex items-center gap-2 text-primary-color">
                            <IconLove className="size-5 fill-[#3D3177]" />
                            <span className="text-base font-medium">{stats.likes} Like</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-color">
                            <IconReply className="size-5 fill-[#3D3177]" />
                            <span className="text-base font-medium">{stats.replies} Replies</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-color">
                            <IconEye className="size-5 " />
                            <span className="text-base font-medium">{stats.views} Views</span>
                        </div>
                        
                    </div>
                </CardContent>
            </Card>
        </ThreadDetailPage>
    );
}
