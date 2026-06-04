// app/articles/[slug]/_components/ArticleContent.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically load ViewReactTextEditor with SSR disabled
const ViewReactTextEditor = dynamic(
  () =>
    import("@/app/_pregnancy-overview/_components/ViewReactTextEditor").then(
      (mod) => mod.ViewReactTextEditor
    ),
  { ssr: false }
);

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="article-editorial">
      <ViewReactTextEditor content={content} />
    </div>
  );
}
