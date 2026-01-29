"use client";

import React, { useState } from "react";
import CheckList from "@/components/base/CheckList";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckboxItem } from "@radix-ui/react-menu";
import CheckListItem from "@/app/check-lists/_component/CheckListItem";

// import { Button } from "@/components/ui/Button";

import { CheckListsProps } from "../_types/checklists_component_types";

export default function CheckLists({ checkLists, count }: CheckListsProps) {
  return (
    <div className="px-4 sm:pt-12 lg:pt-15  space-y-2  lg:text-start max-w-4xl mx-auto pb-7 lg:pb-15">
      {/*<div className="flex items-center justify-between">*/}
      {/*  <div className="flex items-center gap-3  size-full">*/}
      {/*    <div className="bg-purple-200 p-3 rounded-full">*/}
      {/*      <CheckCircle2 className="size-6 text-soft" />*/}
      {/*    </div>*/}
      {/*    <h2 className="text-2xl font-bold text-foreground">CHECKLISTS</h2>*/}
      {/*  </div>*/}
      {/*  <Button*/}
      {/*    asChild*/}
      {/*    variant="purple"*/}
      {/*    size="sm"*/}
      {/*    className="text-xs lg:text-sm gap-1 h-fit py-2"*/}
      {/*  >*/}
      {/*    <Link href="/check-lists" className="flex items-center gap-1">*/}
      {/*      See All*/}
      {/*      <span className="px-2 py-0.5 text-[10px] lg:text-xs font-medium rounded-full bg-purple-100 text-purple-700">*/}
      {/*        {count || 0}*/}
      {/*      </span>*/}
      {/*    </Link>*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <div className="flex flex-col text-left text-text-mid  items-stretch gap-2 w-full">
        {/*{checkLists?.map((item: any, index: number) => (*/}
        {/*  <CheckList*/}
        {/*    key={index}*/}
        {/*    data={item}*/}
        {/*    // id={item._id}*/}
        {/*    // title={item.title}*/}
        {/*    // description={item.description}*/}
        {/*  />*/}
        {/*))}*/}
        <CheckListItem checklistItems={checkLists} overview={true} />
      </div>
      <div className="flex justify-center my-10">
        <Button className="w-full max-w-3xl">
          <Link href="/check-lists" className="flex items-center gap-2">
            See All
          </Link>
        </Button>
      </div>
    </div>
  );
}
