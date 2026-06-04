"use client";

import { ViewReactTextEditor } from "@/app/pregnancy-overview/_components/ViewReactTextEditor";

export default function BenefitContent({ content }: { content: string }) {
  return (
    <div className="article-editorial">
      <ViewReactTextEditor content={content} />
    </div>
  );
}
