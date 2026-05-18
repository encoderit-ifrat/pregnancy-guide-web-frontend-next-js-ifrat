import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Spinner } from "@/components/ui/Spinner";

interface WeekSelectorProps {
  currentWeek?: number;
  onWeekChange?: (week: number) => void;
  minWeek?: number;
  maxWeek?: number;
  isLoading?: boolean;
}

export default function WeekSelector({
  currentWeek = 9,
  onWeekChange,
  minWeek = 3,
  maxWeek = 41,
  isLoading = false,
}: WeekSelectorProps) {
  const { t } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestedWeekRef = useRef(currentWeek);

  // Sync internal state when the prop changes (e.g. URL query param updated)
  useEffect(() => {
    if (currentWeek === lastRequestedWeekRef.current) {
      setSelectedWeek(currentWeek);
    }
  }, [currentWeek]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Ensure minWeek and maxWeek are defined numbers
  const min = minWeek ?? 3;
  const max = maxWeek ?? 41;

  // Calculate visible weeks dynamically for different breakpoints
  const getVisibleWeeks = (count: number) => {
    const halfVisible = Math.floor(count / 2);
    const startWeek = Math.max(min, selectedWeek - halfVisible);
    const endWeek = Math.min(max, startWeek + count - 1);
    const adjustedStartWeek = Math.max(min, endWeek - count + 1);

    return Array.from(
      { length: endWeek - adjustedStartWeek + 1 },
      (_, i) => adjustedStartWeek + i
    );
  };

  const handleWeekClick = (week: number) => {
    if (currentWeek === week) return;
    lastRequestedWeekRef.current = week;
    setSelectedWeek(week);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onWeekChange?.(week);
    }, 300);
  };

  const handlePrevious = () => {
    const newWeek = Math.max(min, selectedWeek - 1);
    handleWeekClick(newWeek);
  };

  const handleNext = () => {
    const newWeek = Math.min(max, selectedWeek + 1);
    handleWeekClick(newWeek);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 md:px-6 md:pt-12">
      <div
        className={cn(
          "relative flex items-center gap-2 sm:gap-3 bg-white rounded-full px-6 md:px-8 py-3 shadow-2xl shadow-primary/40 border border-gray-100 transition-all duration-300 ease-out",
          isLoading && "scale-[1.02] ring-2 ring-primary/30 shadow-primary/70"
        )}
      >
        {/* week */}
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-white flex items-center justify-center rounded-t-[15px] w-[147px] h-[33px]">
          <p className="text-[#A97AEC]! font-semibold text-lg">Vecka</p>
        </div>
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={selectedWeek === min}
          className={cn(
            "flex items-center justify-center rounded-full w-10 h-10 transition-colors mr-2 md:mr-3 cursor-pointer",
            selectedWeek === min
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "border border-primary text-primary hover:bg-primary hover:text-white"
          )}
          aria-label={t("pregnancy.previousWeek")}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Mobile Week Buttons */}
        {getVisibleWeeks(3).map((week) => (
          <button
            key={`mobile-${week}`}
            onClick={() => handleWeekClick(week)}
            className={cn(
              "md:hidden flex flex-col items-center justify-center rounded-full text-base font-medium font-outfit cursor-pointer",
              selectedWeek === week
                ? "bg-primary text-white shadow-md"
                : "bg-purple-soft text-primary-dark",
              "w-[50px] h-[50px]"
            )}
          >
            <span className="font-bold text-xs">
              {week === 41 ? "41+" : week < 10 ? `0${week}` : week}
            </span>
          </button>
        ))}

        {/* Desktop Week Buttons */}
        {getVisibleWeeks(7).map((week) => (
          <button
            key={`desktop-${week}`}
            onClick={() => handleWeekClick(week)}
            className={cn(
              "hidden md:flex flex-col items-center justify-center rounded-full text-base font-medium font-outfit cursor-pointer",
              selectedWeek === week
                ? "bg-primary text-white shadow-md"
                : "bg-purple-soft text-primary-dark",
              selectedWeek === week
                ? "w-[72px] h-[72px]"
                : "w-[60px] h-[60px]"
            )}
          >
            <span className="font-bold text-lg">
              {week === 41 ? "41+" : week < 10 ? `0${week}` : week}
            </span>
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selectedWeek === max}
          className={cn(
            "flex items-center justify-center rounded-full w-10 h-10 transition-colors ml-2 md:ml-3",
            selectedWeek === max
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "border border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
          )}
          aria-label={t("pregnancy.nextWeek")}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
