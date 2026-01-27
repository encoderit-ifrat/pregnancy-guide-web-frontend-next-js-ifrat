import * as React from "react";

import {cn} from "@/lib/utils";

export type InputVariant = "default" | "rounded-full" | "square";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  hasIcon?: boolean;
  label?: string;
}

function Input({
                 label,
                 className,
                 type,
                 variant = "default",
                 size = "md",
                 hasIcon = false,
                 ...props
               }: InputProps) {
  const baseStyles = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary" +
      " selection:text-primary-foreground focus:border-primary flex min-w-0 w-full " +
      "max-w-[563px] border-1 focus:bg-white bg-input text-base shadow-xs transition-[color,box-shadow]" +
      " outline-none " +
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium " +
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles = {
    default: "rounded-sm",
    "rounded-full": "rounded-full",
    square: "rounded-none",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-12 px-4 py-2 text-base md:text-base sm:text-base",
    lg: "h-18 px-6 py-3 text-lg md:text-2xl",
  };

  const iconPadding = hasIcon ? "pl-10" : "";

  return (
      <div className="mb-2">
        {label &&
            <div className="mb-1">
              <label className="text-lg font-medium text-text-purple" htmlFor="input">
                {label}
              </label>
            </div>
        }
        <input
            type={type}
            data-slot="input"
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                iconPadding,
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className,
                "focus:text-primary",
            )}
            {...props}
        />
      </div>
  );
}

export {Input};
