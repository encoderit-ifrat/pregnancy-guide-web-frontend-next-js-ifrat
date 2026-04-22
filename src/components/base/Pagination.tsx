// components/base/Pagination.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
  [key: string]: unknown;
};

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  meta?: PaginationMeta;
  onClickPage?: (page: number) => void;
  onClickPrev?: (page: number) => void;
  onClickNext?: (page: number) => void;
};

export default function Pagination({
  currentPage: propCurrentPage,
  totalPages: propTotalPages,
  onPageChange,
  meta,
  onClickPage,
  onClickPrev,
  onClickNext,
}: PaginationProps) {
  const { t } = useTranslation();
  
  // Use metadata first, then props
  const currentPage = meta?.current_page || propCurrentPage || 1;
  const totalPages = meta?.last_page || propTotalPages || 1;
  
  const handlePageChange = (page: number) => {
    if (onPageChange) onPageChange(page);
    if (onClickPage) onClickPage(page);
  };

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

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center pt-8 pb-4">
      <nav className="flex items-center gap-1.5 p-1.5 bg-gray-50/50 rounded-full border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        {/* Previous Button */}
        <Button
          variant="ghost"
          onClick={() => {
            const newPage = Math.max(1, currentPage - 1);
            handlePageChange(newPage);
            if (onClickPrev) onClickPrev(newPage);
          }}
          disabled={currentPage === 1}
          className={cn(
            "h-11 px-4 rounded-full flex items-center gap-2 border border-transparent transition-all duration-200 font-outfit font-medium text-base",
            currentPage === 1 
              ? "text-gray-300 opacity-50 cursor-not-allowed" 
              : "text-primary hover:bg-white hover:border-gray-200 hover:text-primary-dark hover:shadow-sm active:scale-95"
          )}
        >
          <div className={cn(
            "size-7 rounded-full flex items-center justify-center transition-colors",
            currentPage === 1 ? "bg-gray-100/50" : "bg-primary/10 text-primary group-hover:bg-primary/20"
          )}>
            <ChevronLeft className="size-4" />
          </div>
          <span className="hidden sm:inline">{t("common.previous")}</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            const isNumber = typeof page === "number";
            const isActive = page === currentPage;
            
            return (
              <Button
                key={`${page}-${index}`}
                variant="ghost"
                onClick={() => isNumber && handlePageChange(page)}
                disabled={!isNumber}
                className={cn(
                  "size-11 p-0 rounded-full flex items-center justify-center font-outfit text-base font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:scale-105" 
                    : isNumber 
                      ? "text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm" 
                      : "text-gray-400 cursor-default px-1"
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          onClick={() => {
            const newPage = Math.min(totalPages, currentPage + 1);
            handlePageChange(newPage);
            if (onClickNext) onClickNext(newPage);
          }}
          disabled={currentPage === totalPages}
          className={cn(
            "h-11 px-4 rounded-full flex items-center gap-2 border border-transparent transition-all duration-200 font-outfit font-medium text-base",
            currentPage === totalPages 
              ? "text-gray-300 opacity-50 cursor-not-allowed" 
              : "text-primary hover:bg-white hover:border-gray-200 hover:text-primary-dark hover:shadow-sm active:scale-95"
          )}
        >
          <span className="hidden sm:inline">{t("common.next")}</span>
          <div className={cn(
            "size-7 rounded-full flex items-center justify-center transition-colors",
            currentPage === totalPages ? "bg-gray-100/50" : "bg-primary/10 text-primary group-hover:bg-primary/20"
          )}>
            <ChevronRight className="size-4" />
          </div>
        </Button>
      </nav>
    </div>
  );
}
