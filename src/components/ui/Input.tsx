import * as React from "react";

import { cn } from "@/lib/utils";

export type InputVariant = "default" | "rounded-full" | "square";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  variant?: InputVariant;
  size?: InputSize;
  hasIcon?: boolean;
  label?: string;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}

function Input({
  label,
  className,
  type,
  variant = "default",
  size = "md",
  hasIcon = false,
  prepend,
  append,
  ...props
}: InputProps) {
  const baseStyles =
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary" +
    " selection:text-white border-[#F3EAFF] focus:border-primary flex min-w-0 w-full " +
    "border-2 focus:bg-white bg-[#FBF8FF] text-base shadow-xs transition-[color,box-shadow]" +
    " outline-none " +
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium " +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles = {
    default: "rounded",
    "rounded-full": "rounded-full",
    square: "rounded-none",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-12 px-4 py-2 text-base md:text-base sm:text-base",
    lg: "h-18 px-6 py-3 text-lg md:text-2xl",
  };

  const currentIconPadding = prepend ? "pl-10" : hasIcon ? "pl-10" : "";
  const appendPadding = append ? "pr-10" : "";

  return (
    <div className="mb-2">
      {label && (
        <div className="mb-1">
          <label
            className="text-lg font-medium text-text-purple"
            htmlFor="input"
          >
            {label}
          </label>
        </div>
      )}
      <div className="relative">
        {prepend && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prepend}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            currentIconPadding,
            appendPadding,
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
            "focus:text-primary",
              "disabled:cursor-not-allowed!"
          )}
          {...props}
        />
        {append && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {append}
          </div>
        )}
      </div>
    </div>
  );
}

export { Input };
