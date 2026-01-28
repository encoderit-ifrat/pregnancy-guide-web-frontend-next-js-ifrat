import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Textarea,
  TextareaVariant,
  TextareaSize,
} from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";
import { cn } from "@/lib/utils";

type FormTextAreaProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  variant?: TextareaVariant;
  size?: TextareaSize;
  className?: string;
};

export function FormTextArea({
  name,
  control,
  errors,
  label,
  placeholder = "",
  disabled,
  rows = 4,
  variant = "rounded-full",
  size = "md",
  className,
}: FormTextAreaProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <Label
          htmlFor={name}
          className={`${errors[name] ? "text-destructive" : ""}`}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Textarea
            id={name}
            rows={rows}
            disabled={disabled}
            placeholder={placeholder}
            variant={variant}
            size={size}
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

      {errors[name] && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
