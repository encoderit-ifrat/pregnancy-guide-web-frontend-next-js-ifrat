// components/base/Pagination.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "../ui/Label";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center px-5 gap-3">
      <Button
        // variant="outline"
        // size="icon"
        variant="ghost"
        // size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-0"
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      {getPageNumbers().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "outline" : "link"}
          // size="icon"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page === "string"}
          className="size-7.5! p-0 rounded-sm"
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        // size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-0"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
