import * as React from "react";
import {Eye, EyeOff} from "lucide-react";
import {cn} from "@/lib/utils";

export type InputVariant = "default" | "rounded-full" | "square";
export type InputSize = "sm" | "md" | "lg";

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
          label,
          className,
          variant = "default",
          size = "md",
          ...props
        },
        ref
    ) => {
      const [showPassword, setShowPassword] = React.useState(false);

      const baseStyles =
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary" +
          " selection:text-primary-foreground focus:border-primary flex min-w-0 w-full " +
          "max-w-[563px] border-1 focus:bg-white bg-primary-light text-base shadow-xs transition-[color,box-shadow]" +
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

      const togglePassword = () => {
        setShowPassword(!showPassword);
      };

      return (
          <div className="mb-2">
            {label && (
                <div className="mb-1">
                  <label className="text-lg font-medium text-text-purple" htmlFor="password-input">
                    {label}
                  </label>
                </div>
            )}
            <div className="relative">
              <input
                  ref={ref}
                  type={showPassword ? "text" : "password"}
                  data-slot="input"
                  id="password-input"
                  className={cn(
                      baseStyles,
                      variantStyles[variant],
                      sizeStyles[size],
                      "pr-12", // Add padding for the eye icon
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      className,
                      "focus:text-primary"
                  )}
                  {...props}
              />
              <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-4 pb-2 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
              >
                {showPassword ? (
                    <Eye className={`w-5 h-5 pt-1 ${showPassword ? "text-primary" : "text-gray-400"}`}/>
                ) : (
                    <EyeOff className={`w-5 h-5 pt-1 text-gray-400`}/>
                )}
              </button>
            </div>
          </div>
      );
    }
);

PasswordInput.displayName = "PasswordInput";

export {PasswordInput};