"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-']):not(.spinner-icon)]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-md hover:opacity-90",
        outline:
          "border border-primary text-primary bg-white shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-dark dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline",
        purple: "bg-secondary text-white shadow-md hover:opacity-90",
        darkPurple: "bg-foreground text-white shadow-md hover:opacity-90",
        softPurple: "bg-primary text-white shadow-md hover:opacity-90",
        tertiary:
          "bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-dark dark:hover:bg-input/50",
      },

      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-sm",
        lg: "h-17 px-8 text-base",
        lgMax: "px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  disabled,
  children,
  asChild = false,
  isLoading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    children?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        "capitalize cursor-pointer"
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin spinner-icon" size={32} />
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
