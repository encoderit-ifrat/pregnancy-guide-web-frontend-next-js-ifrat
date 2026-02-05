import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaVariant = "default" | "rounded-full" | "square";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "size"
> {
  variant?: TextareaVariant;
  size?: TextareaSize;
}

function Textarea({
  className,
  variant = "default",
  size = "md",
  ...props
}: TextareaProps) {
  const baseStyles =
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex w-full min-w-0 border text-base shadow-xs transition-[color,box-shadow] outline-none resize-none text-left placeholder:text-left disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles = {
    default: "rounded-lg",
    "rounded-full": "rounded-full",
    square: "rounded-none",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-8 py-2 text-base md:text-xl sm:text-base",
    lg: "px-10 py-4 text-lg md:text-2xl",
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
