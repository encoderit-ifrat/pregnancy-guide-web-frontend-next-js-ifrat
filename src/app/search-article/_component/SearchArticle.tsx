// app/search/_component/SearchArticle.tsx
"use client";

import ArticleStats from "@/components/base/ArticleStats";
import BaseSearchBar from "@/components/base/BaseSearchBar";
import ContentCard from "@/components/base/ContentCard";
import SearchResultHeader from "@/components/base/SearchResultHeader";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/base/Pagination";

type Meta = {
  total: number;
  current_page: number;
  last_page: number;
  // limit: number;
  // totalPages: number;
};

type Article = {
  _id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  slug: string;
};

export default function SearchArticle({
  initialQuery,
  initialData,
  meta,
}: {
  initialQuery: string;
  initialData: Article[];
  meta: Meta | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    // Reset to page 1 on new search
    params.set("page", "1");

    router.push(`/search-article?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/search-article?${params.toString()}`);
  };

  return (
    <div className="px-4 w-full flex flex-col items-center gap-6">
      {/* Centered Search Bar */}
      {/* <div className="w-full max-w-lg mx-auto">
        <BaseSearchBar
          placeholder="Search by content or baby name"
          onSearch={handleSearch}
          defaultValue={initialQuery}
        />
      </div> */}

      <div className="w-full max-w-[1000px] flex flex-col gap-6">
        {/* <ArticleStats /> */}
        {initialQuery && (
          <SearchResultHeader query={initialQuery} category="Articles" />
        )}
      </div>

      {/* Article Cards */}
      <div className="w-full max-w-[1000px] flex flex-col gap-6">
        {initialData.length > 0 ? (
          initialData.map((article) => (
            <ContentCard key={article._id} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            No articles found. Try a different search term.
          </p>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="w-full max-w-[1000px] mt-8">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page} // ← Changed from meta.total to meta.last_page
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
