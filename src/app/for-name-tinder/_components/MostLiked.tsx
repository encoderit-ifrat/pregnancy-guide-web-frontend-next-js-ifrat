import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, InfoIcon, X } from "lucide-react";
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
import IconDelete from "@/components/svg-icon/icon-delete";

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

export default function MostLiked({
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
        "w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
        <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
            {title}
          </h3>

          {/* Footer Stats Area */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-primary-color">
              <IconLove className="size-4 sm:size-5 fill-[#3D3177]" />
              <span className="text-sm sm:text-base font-medium">
                {stats.likes} {t("threads.like")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Action Area */}
        <div className="w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <Button variant={"outline"} className="w-full sm:w-auto px-8">
            <span className="font-semibold text-sm">View</span>
            <ChevronRight className="size-4 sm:size-5" />
          </Button>
        </div>
      </div>
    </Card>
    // </ThreadDetailPage>
  );
}
