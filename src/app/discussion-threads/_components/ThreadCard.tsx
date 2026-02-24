import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import ThreadDetailPage from './ThreadDetailPage';
import IconLove from '@/components/svg-icon/icon-love';
import IconReply from '@/components/svg-icon/icon-reply';
import IconEye from '@/components/svg-icon/icon-eye';
import IconShare from '@/components/svg-icon/icon-share';
import IconFlag from '@/components/svg-icon/icon-flag';


interface ThreadCardProps {
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

export default function ThreadCard({
    title,
    excerpt,
    createdBy,
    stats,
    lastReply,
    className
}: ThreadCardProps) {
    const { t } = useTranslation();
    return (
        <ThreadDetailPage
            title={title}
            excerpt={excerpt}
            createdBy={createdBy}
            stats={stats}
            lastReply={lastReply}
        >
            <Card className={cn(
                "w-315 h-61 border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all pt-8 pr-13 pb-10 pl-12",
                className
            )}>
                <div className="flex items-start gap-9">
                    {/* Left Side Content Area (930x164) */}
                    <div className="w-232 h-41 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h3 className="text-3xl font-semibold text-primary-color">
                                    {title}
                                </h3>
                                <Badge variant="outline" className="bg-[#EEE4FD] text-primary-color border-primary-light">
                                    {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
                                </Badge>
                            </div>

                            <p className="text-primary-color text-base ">
                                {excerpt} <span className="text-[#9679E1] text-base font-medium cursor-pointer hover:underline">{t("articles.readMore")}</span>
                            </p>
                        </div>

                        {/* Footer Stats Area */}
                        <div className="flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-2 text-primary-color">
                                <IconLove className="size-5 fill-[#3D3177]" />
                                <span className="text-base font-medium">{stats.likes} {t("threads.like")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary-color">
                                <IconReply className="size-5 fill-[#3D3177]" />
                                <span className="text-base font-medium">{stats.replies} {t("threads.replies")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary-color">
                                <IconEye className="size-5 " />
                                <span className="text-base font-medium">{stats.views} {t("threads.views")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary-color">
                                <IconShare className="size-5 fill-[#3D3177]" />
                                <span className="text-base font-medium">{stats.shares} {t("threads.share")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary-color">
                                <IconFlag className="size-5" />
                                <span className="text-base font-medium">{t("threads.flag")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Action Area (192x169) */}
                    <div className="w-48 h-42 pl-9 flex flex-col items-center justify-center gap-6">
                        {lastReply && (
                            <div className="text-center">
                                <p className="text-primary-color text-base font-medium">{t("threads.lastReply")}</p>
                                <p className="text-primary-color text-base">{lastReply.time} {t("threads.by")} {lastReply.user}</p>
                            </div>
                        )}
                        <div className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-colors w-full">
                            <span className="font-semibold text-sm">{t("threads.reply")}</span>
                            <ChevronRight className="size-5" />
                        </div>
                    </div>
                </div>
            </Card>
        </ThreadDetailPage>
    );
}