// app/articles/[slug]/_components/ArticleContent.tsx
"use client";

import React from "react";

export default function ArticleContent({
  content,
  hasToC,
}: {
  content: string;
  hasToC: boolean;
}) {
  return (
    <article
      className={`${
        hasToC ? "w-full lg:w-2/3" : "w-full"
      } prose prose-lg max-w-none
        prose-headings:text-[#300043] prose-headings:font-bold
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-soft prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:shadow-md
        prose-strong:text-[#300043]
        prose-ul:list-disc prose-ol:list-decimal
        no-tailwind
        
      `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
