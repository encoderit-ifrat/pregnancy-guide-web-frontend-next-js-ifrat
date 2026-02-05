import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";

export type InputVariant = "default" | "rounded-full" | "square";
export type InputSize = "sm" | "md" | "lg";

export interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "size" | "type"
> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, className, variant = "default", size = "md", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="mb-2">
        {label && (
          <div className="mb-1">
            <label
              className="text-lg font-medium text-text-purple"
              htmlFor="password-input"
            >
              {label}
            </label>
          </div>
        )}
        <div className="relative">
          <Input
            ref={ref}
            label=""
            type={showPassword ? "text" : "password"}
            {...props}
          />

          {/* <input
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
          /> */}
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-4 pb-2 cursor-pointer focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye
                className={`w-5 h-5 pt-1 ${showPassword ? "text-primary" : "text-gray-400"}`}
              />
            ) : (
              <EyeOff className={`w-5 h-5 pt-1 text-gray-400`} />
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
