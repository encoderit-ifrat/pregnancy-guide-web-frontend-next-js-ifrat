import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ThreadDetailPage from "./ThreadDetailPage";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import IconShare from "@/components/svg-icon/icon-share";
import IconFlag from "@/components/svg-icon/icon-flag";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
// import { Dialog, DialogContent } from "@/components/ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import IconLike from "@/components/svg-icon/icon-like";

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

export default function CommunityCard({
  title,
  excerpt,
  createdBy,
  stats,
  lastReply,
  className,
}: ThreadCardProps) {
  const { t } = useTranslation();
  // const [openSwipeDialog, setOpenSwipeDialog] = useState(false);
  // const [openMatchDialog, setOpenMatchDialog] = useState(false);
  return (
    // <ThreadDetailPage
    //   title={title}
    //   excerpt={excerpt}
    //   createdBy={createdBy}
    //   stats={stats}
    //   lastReply={lastReply}
    // >
    <Card
      className={cn(
        "  border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all pt-8 pr-13 pb-10 pl-12",
        className
      )}
    >
      <div className="flex items-start gap-9">
        <div className="w-full flex flex-col justify-between space-y-2">
          <h3 className="text-3xl font-semibold text-primary-color">{title}</h3>

          {/* Footer Stats Area */}
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-2 text-primary-color">
              <IconLove className="size-5 fill-[#3D3177]" />
              <span className="text-base font-medium">
                {stats.likes} {t("threads.like")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary-color">
              <IconLike className="size-5 fill-[#3D3177]" />
              <span className="text-base font-medium">
                {stats.likes} {t("threads.like")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Action Area (192x169) */}
        <Button variant={"outline"}>
          <span className="font-semibold text-sm">View</span>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </Card>
    // </ThreadDetailPage>
  );
}
