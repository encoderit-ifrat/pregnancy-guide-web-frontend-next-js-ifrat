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

export default function MostViewed({
  title,
  excerpt,
  createdBy,
  stats,
  lastReply,
  className,
}: ThreadCardProps) {
  const { t } = useTranslation();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <Dialog open={openInfoDialog} onOpenChange={setOpenInfoDialog}>
      <Card
        className={cn(
          "  border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all pt-8 pr-13 pb-10 pl-12",
          className
        )}
      >
        <div className="flex items-start gap-9">
          <div className="w-full flex flex-col justify-between space-y-2">
            <h3 className="text-3xl font-semibold -color">{title}</h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-2 -color">
                <IconLove className="size-5 fill-[#3D3177]" />
                <span className="text-base font-medium">
                  {stats.likes} {t("threads.like")}
                </span>
              </div>
              <div className="flex items-center gap-2 -color">
                <IconLike className="size-5 fill-[#3D3177]" />
                <span className="text-base font-medium">
                  {stats.likes} {t("threads.like")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <DialogTrigger asChild>
              <InfoIcon className="size-5 cursor-pointer hover: transition-colors" />
            </DialogTrigger>
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <DialogTrigger asChild>
                <IconDelete className="size-5 cursor-pointer hover:text-red-500 transition-colors" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl text-center bg-white p-8">
                <SectionHeading className="m-0 text-center text-2xl!">
                  Remove This Name
                </SectionHeading>
                <p className="text-primary-color text-base text-center my-4">
                  It Will Be deleted forever.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDeleteDialog(false)}
                    className="w-41.25"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-41.25"
                    onClick={() => {
                      // Handle delete logic here
                      setOpenDeleteDialog(false);
                    }}
                  >
                    Remove
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <IconLove className="size-5" />
            <IconLike className="size-5" />
          </div>
        </div>
      </Card>
      <DialogContent className="sm:max-w-xl bg-white p-8">
        <div className="space-y-6">
          {/* <div> */}
          <h2 className="text-3xl font-bold -color mb-2 border-b border-b-gray-200">
            Nowshin
          </h2>
          {/* </div> */}

          <div className="space-y-4">
            <section>
              <h4 className="text-sm font-bold  uppercase tracking-wider mb-1">
                Meaning
              </h4>
              <p className=" leading-relaxed">
                Sweet, pleasant, delightful, charming. The name is often
                associated with sweetness in nature or personality, something
                lovely and pleasing.
              </p>
            </section>
            <section>
              <h4 className="text-sm font-bold  uppercase tracking-wider mb-1">
                Origin
              </h4>
              <p className=" leading-relaxed">
                Persian (Iranian) - The word &ldquo;Nowshin&rdquo; comes from
                Persian, where &ldquo;shirin / shin&rdquo; relates to sweetness
                and pleasant taste or nature. It&rsquo;s commonly used in
                Persian-speaking regions and cultures influenced by Persian
                language.
              </p>
            </section>
            <section>
              <h4 className="text-sm font-bold  uppercase tracking-wider mb-1">
                Popularity
              </h4>
              <ul className="list-disc list-inside  space-y-1">
                <li>Moderately popular</li>
                <li>
                  Common in Iran, Afghanistan, and among Persian-speaking or
                  South Asian Muslim families
                </li>
                <li>
                  Less common globally, which makes it feel unique and elegant
                </li>
                <li>
                  Mostly used as a female name, though it can be considered
                  soft-gendered/unisex in modern naming trends
                </li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
