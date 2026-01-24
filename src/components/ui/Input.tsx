import * as React from "react";

import { cn } from "@/lib/utils";

export type InputVariant = "default" | "rounded-full" | "square";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  hasIcon?: boolean;
}

function Input({
  className,
  type,
  variant = "rounded-full",
  size = "md",
  hasIcon = false,
  ...props
}: InputProps) {
  const baseStyles = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-light border-input flex min-w-0 w-full max-w-[563px] border bg-input text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantStyles = {
    default: "rounded-2xl",
    "rounded-full": "rounded-full",
    square: "rounded-none",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-17 px-4 py-2 text-base md:text-xl sm:text-base",
    lg: "h-20 px-6 py-3 text-lg md:text-2xl",
  };

  const iconPadding = hasIcon ? "pl-10" : "";

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        iconPadding,
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
