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

export default function MatchedName() {
  const { t } = useTranslation();
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <Dialog open={openInfoDialog} onOpenChange={setOpenInfoDialog}>
      <Card
        className={cn(
          "w-full border border-border shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)] rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all p-5 sm:pt-8 sm:pr-13 sm:pb-10 sm:pl-12"
          //   className
        )}
      >
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
            <h2 className="text-[32px] md:text-[42px] font-semibold text-primary-color tracking-tight">
              Matched Names
            </h2>
            <Link
              href={"/for-name-tinder"}
              className={cn(
                "w-fit",
                buttonVariants({
                  variant: "outline",
                })
              )}
              //   onClick={() => setIsNext(true)}
            >
              <ChevronLeft className="size-4" />
              Back
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-primary text-primary bg-primary/10 w-full max-w-xl px-3 py-2">
            <Link2 />
            https://www.familj.se/matched-names/5a6789
            <Copy className="ml-auto" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9">
          <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-color leading-tight">
              {/* {title} */}
              Name
            </h3>

            {/* Footer Stats Area */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2 text-primary-color">
                <IconLove className="size-4 sm:size-5 fill-[#3D3177]" />
                <span className="text-sm sm:text-base font-medium">
                  1M {t("threads.like")}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <div className="flex items-center gap-4">
              <DialogTrigger asChild>
                <InfoIcon className="size-5 cursor-pointer text-primary-color hover:text-primary transition-colors" />
              </DialogTrigger>
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
            </div>
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
