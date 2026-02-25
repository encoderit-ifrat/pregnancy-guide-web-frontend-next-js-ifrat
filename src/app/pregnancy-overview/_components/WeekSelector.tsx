"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  currentWeek?: number;
  onWeekChange?: (week: number) => void;
  minWeek?: number;
  maxWeek?: number;
}

export default function WeekSelector({
  currentWeek = 9,
  onWeekChange,
  minWeek = 0,
  maxWeek = 45,
}: WeekSelectorProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [visibleWeekCount, setVisibleWeekCount] = useState(7);

  useEffect(() => {
    function updateVisibleWeekCount() {
      if (typeof window !== "undefined" && window.innerWidth < 767) {
        setVisibleWeekCount(3);
      } else {
        setVisibleWeekCount(7);
      }
    }

    updateVisibleWeekCount();
    window.addEventListener("resize", updateVisibleWeekCount);
    return () => window.removeEventListener("resize", updateVisibleWeekCount);
  }, []);

  // Sync internal state when the prop changes (e.g. URL query param updated)
  useEffect(() => {
    setSelectedWeek(currentWeek);
  }, [currentWeek]);

  // Ensure minWeek and maxWeek are defined numbers
  const min = minWeek ?? 0;
  const max = maxWeek ?? 45;

  // Calculate visible weeks (current week +/- 2 on each side)
  const halfVisible = Math.floor(visibleWeekCount / 2);
  const startWeek = Math.max(min, selectedWeek - halfVisible);
  const endWeek = Math.min(max, startWeek + visibleWeekCount - 1);
  const adjustedStartWeek = Math.max(min, endWeek - visibleWeekCount + 1);

  const visibleWeeks = Array.from(
    { length: endWeek - adjustedStartWeek + 1 },
    (_, i) => adjustedStartWeek + i
  );

  const handleWeekClick = (week: number) => {
    if (currentWeek === week) return;
    setSelectedWeek(week);
    onWeekChange?.(week);
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
    <div className="flex items-center justify-center gap-3 py-6 px-4 md:px-6 md:pt-12">
      <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-6 md:px-8 py-3 shadow-2xl shadow-primary/40 border border-gray-100">
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
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Week Buttons */}
        {visibleWeeks.map((week) => (
          <button
            key={week}
            onClick={() => handleWeekClick(week)}
            className={cn(
              "flex flex-col items-center justify-center rounded-full text-base font-medium font-outfit cursor-pointer",
              selectedWeek === week
                ? "bg-primary text-white shadow-md"
                : "bg-primary-light text-primary-dark",
              selectedWeek == week ? "w-[45px] h-[65px] md:w-[55px] md:h-[72px]" : "w-[41px] h-[59px] md:w-[46px] md:h-[60px]"
            )}
          >
            <span className="font-bold text-xs md:text-lg">{week < 10 ? `0${week}` : week}</span>
            {selectedWeek == week ? <span className="text-xs md:text-[15px]">Week</span> : null}
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
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
