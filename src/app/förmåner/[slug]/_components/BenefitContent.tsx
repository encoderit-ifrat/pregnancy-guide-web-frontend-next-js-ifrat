"use client";

import React from "react";
import dynamic from "next/dynamic";

const ViewReactTextEditor = dynamic(
  () =>
    import("@/app/_pregnancy-overview/_components/ViewReactTextEditor").then(
      (mod) => mod.ViewReactTextEditor,
    ),
  { ssr: false },
);

export default function BenefitContent({ content }: { content: string }) {
  return (
    <div className="article-editorial">
      <ViewReactTextEditor content={content} />
    </div>
  );
}
