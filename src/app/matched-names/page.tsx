"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Copy, InfoIcon, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import IconLove from "@/components/svg-icon/icon-love";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Button, buttonVariants } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import IconDelete from "@/components/svg-icon/icon-delete";
import Link from "next/link";
import {
  useQueryGetMatchingNames,
  MatchingNameItem,
} from "./_api/useQueryGetMatchingNames";

function NameCard({ item }: { item: MatchingNameItem }) {
  const { t } = useTranslation();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Dialog open={openInfoDialog} onOpenChange={setOpenInfoDialog}>
      <Card className="w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
          {/* Left: name + meta */}
          <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
              {item.name}
            </h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-primary-color text-sm sm:text-base">
              <span className="capitalize rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium">
                {item.gender}
              </span>
              <span className="text-muted-foreground text-xs">
                {item.category_id?.name}
              </span>
              <div className="flex items-center gap-2">
                <IconLove className="size-4 sm:size-5 fill-[#3D3177]" />
                <span className="font-medium">
                  {item.loved_count} {t("threads.like")}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <div className="flex items-center gap-4">
              <DialogTrigger asChild>
                <InfoIcon className="size-5 cursor-pointer text-primary-color hover:text-primary transition-colors" />
              </DialogTrigger>

              {/* Delete dialog */}
              <Dialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <DialogTrigger asChild>
                  <IconDelete className="size-5 cursor-pointer text-gray-500 hover:text-red-500 transition-colors" />
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
                        // TODO: call delete mutation here
                        setOpenDeleteDialog(false);
                      }}
                    >
                      Remove
                      <ChevronRight className="size-5" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>

      {/* Info dialog content */}
      <DialogContent className="sm:max-w-xl bg-white p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary-color mb-2 border-b border-b-gray-200">
            {item.name}
          </h2>
          <div className="space-y-4">
            <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                Category
              </h4>
              <p className="leading-relaxed">{item.category_id?.name}</p>
            </section>
            <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                Gender
              </h4>
              <p className="capitalize leading-relaxed">{item.gender}</p>
            </section>
            <section>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                Stats
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Loved: {item.loved_count}</li>
                <li>Liked: {item.liked_count}</li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MatchedName() {
  const { data, isLoading, isError } = useQueryGetMatchingNames("all");
  const items = data?.items ?? [];

  return (
    <div className="w-full max-w-327 pb-20 mx-auto px-4 sm:px-0 mt-16">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl px-9 pt-8 pl-6 pb-8 shadow-sm">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
            <h2 className="text-[32px] md:text-[42px] font-semibold text-primary-color tracking-tight">
              Matched Names
            </h2>
            <Link
              href="/for-name-tinder"
              className={cn("w-fit", buttonVariants({ variant: "outline" }))}
            >
              <ChevronLeft className="size-4" />
              Back
            </Link>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-primary text-primary bg-primary/10 w-full max-w-xl px-3 py-2">
            <Link2 />
            https://www.familj.se/matched-names
            <Copy className="ml-auto cursor-pointer hover:opacity-70 transition-opacity" />
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <p className="text-center text-primary-color py-4">
            Loading matched names…
          </p>
        )}
        {isError && (
          <p className="text-center text-red-500 py-4">
            Failed to load matched names. Please try again.
          </p>
        )}
        {!isLoading && !isError && items.length === 0 && (
          <p className="text-center text-primary-color py-4">
            No matched names yet. Start swiping!
          </p>
        )}

        {/* Name cards */}
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <NameCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
