"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
  inputClassName,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  inputClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Controlled month state so parent re-renders don't reset the calendar view
  const [month, setMonth] = React.useState<Date>(value ?? new Date());

  // Sync displayed month when the selected value changes externally
  // (e.g. auto-calculated due date from last period date)
  React.useEffect(() => {
    if (value) {
      setMonth(value);
    }
  }, [value]);

  // Utility: convert date to local (strip UTC offset effect)
  const toLocalDate = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local;
  };

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={disabled ? () => {} : setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="tertiary"
          disabled={disabled}
          className={cn(
            "w-full justify-between rounded-full py-4 pl-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            inputClassName
          )}
        >
          {value ? (
            value.toLocaleDateString()
          ) : (
            <p className="text-[#445B6A]! font-normal! text-sm!">
              {placeholder}
            </p>
          )}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          fixedWeeks
          mode="single"
          selected={value}
          month={month}
          onMonthChange={setMonth}
          captionLayout="dropdown"
          startMonth={new Date(1980, 0)} // January 1980
          endMonth={new Date(2130, 11)} // December 2030
          onSelect={(date) => {
            if (date) {
              const localDate = toLocalDate(date);
              onChange(localDate);
            } else {
              onChange(undefined);
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
