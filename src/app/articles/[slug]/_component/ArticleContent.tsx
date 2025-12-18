// app/articles/[slug]/_components/ArticleContent.tsx
"use client";

import { ViewReactTextEditor } from "@/app/pregnancy-overview/_components/ViewReactTextEditor";
import React from "react";

export default function ArticleContent({ content }: { content: string }) {
  return (
    // <article
    //   className={`prose w-full max-w-full!`}
    //   dangerouslySetInnerHTML={{ __html: content }}
    // />
    <ViewReactTextEditor content={content} />
  );
}
