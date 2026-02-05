import { Controller, Control, FieldErrors } from "react-hook-form";
import { ReactElement } from "react";
import { Input, InputVariant, InputSize } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";
import { cn } from "@/lib/utils";

type FormInputProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "email" | "number" | "password";
  iconComponent?: ReactElement;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
};

export function FormInput({
  name,
  control,
  errors,
  label,
  disabled,
  placeholder = "",
  type = "text",
  iconComponent,
  variant = "rounded-full",
  size = "md",
  className,
}: FormInputProps) {
  return (
    <div className="space-y-1.5 w-full relative">
      {label && (
        <Label
          htmlFor={name}
          className={`${errors[name] && "text-destructive"}`}
        >
          {label}
        </Label>
      )}

      <div className="relative flex items-center w-full max-w-[563px]">
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              id={name}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              variant={variant}
              size={size}
              hasIcon={!!iconComponent}
              className={cn(
                "w-full",
                errors[name] && "border-destructive",
                className
              )}
              aria-invalid={errors[name] ? "true" : "false"}
              {...field}
            />
          )}
        />

        {/* Icon wrapper */}
        {iconComponent && (
          <div className="absolute left-3 flex items-center text-muted-foreground w-[20px] h-[14px] pointer-events-none">
            {iconComponent}
          </div>
        )}
      </div>

      {errors[name] && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
