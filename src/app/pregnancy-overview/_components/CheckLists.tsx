"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import CheckListItem from "@/app/check-lists/_component/CheckListItem";

import { CheckListsProps } from "../_types/checklists_component_types";

export default function CheckLists({ checkLists, count }: CheckListsProps) {
  const { t } = useTranslation();
  return (
    <div className="px-4 sm:pt-12 lg:pt-15  space-y-2  lg:text-start max-w-4xl mx-auto pb-7 lg:pb-15">
      <div className="flex flex-col text-left text-text-mid  items-stretch gap-2 w-full">
        {checkLists && (
          <CheckListItem
            checklistItems={checkLists}
            overview={true}
            className="rounded mb-2"
          />
        )}
      </div>
      <div className="flex justify-center my-14">
        <Link href="/check-lists" className="w-full max-w-3xl">
          <Button className="w-full">
            {t("pregnancy.seeAll")}
            <ChevronRight className="size-4" />
            {/* <span className="px-2 py-0.5 text-[10px] lg:text-xs font-medium rounded-full bg-purple-100 text-purple-700"> */}
            {/* {count || 0} */}
            {/* </span> */}
          </Button>
        </Link>
      </div>
    </div>
  );
}
