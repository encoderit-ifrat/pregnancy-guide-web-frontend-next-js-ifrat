"use client";

import React, { useState } from "react";
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

  // Ensure minWeek and maxWeek are defined numbers
  const min = minWeek ?? 0;
  const max = maxWeek ?? 45;

  // Calculate visible weeks (current week +/- 2 on each side)
  const visibleWeekCount = 5;
  const halfVisible = Math.floor(visibleWeekCount / 2);
  const startWeek = Math.max(min, selectedWeek - halfVisible);
  const endWeek = Math.min(max, startWeek + visibleWeekCount - 1);
  const adjustedStartWeek = Math.max(min, endWeek - visibleWeekCount + 1);

  const visibleWeeks = Array.from(
    { length: endWeek - adjustedStartWeek + 1 },
    (_, i) => adjustedStartWeek + i
  );

  const handleWeekClick = (week: number) => {
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
    <div className="flex items-center justify-center gap-3 py-6 px-4 md:px-6">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={selectedWeek === min}
        className={cn(
          "flex items-center justify-center rounded-full w-10 h-10 transition-colors",
          selectedWeek === min
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        )}
        aria-label="Previous week"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Week Buttons */}
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100">
        {visibleWeeks.map((week) => (
          <button
            key={week}
            onClick={() => handleWeekClick(week)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300",
              selectedWeek === week
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-600 hover:text-primary"
            )}
          >
            {week < 10 ? `0${week}` : week}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={selectedWeek === max}
        className={cn(
          "flex items-center justify-center rounded-full w-10 h-10 transition-colors",
          selectedWeek === max
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        )}
        aria-label="Next week"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
