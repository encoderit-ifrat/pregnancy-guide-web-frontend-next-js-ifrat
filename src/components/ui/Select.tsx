"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-12 w-full items-center justify-between gap-1 rounded-[5px] border-2 border-[#F3EAFF] bg-[#FBF8FF] px-4 text-base text-primary-dark outline-none transition-all focus:border-primary focus:bg-white data-[placeholder]:text-text-secondary data-[state=open]:border-primary data-[state=open]:bg-white cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="size-4 text-gray-400 shrink-0 hidden" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("font-outfit text-base", className)}
      {...props}
    />
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[8px] border border-[#F3EAFF] bg-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        position={position}
        sideOffset={4}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white text-primary-dark">
          <ChevronDownIcon className="size-3 rotate-180" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white text-primary-dark">
          <ChevronDownIcon className="size-3" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex h-10 w-full cursor-pointer select-none items-center rounded-[5px] px-3 py-2 text-sm text-primary-dark outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-[#F3EAFF] data-[highlighted]:text-primary-dark",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="font-outfit">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
