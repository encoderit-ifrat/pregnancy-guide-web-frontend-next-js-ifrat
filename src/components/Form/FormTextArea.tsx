import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";

type FormTextAreaProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
};

export function FormTextArea({
  name,
  control,
  errors,
  label,
  placeholder = "",
  disabled,
  rows = 4,
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
          <textarea
            id={name}
            rows={rows}
            disabled={disabled}
            placeholder={placeholder}
            className={`peer rounded-full px-8 py-2 w-full border resize-none 
              text-left placeholder:text-left
              ${errors[name] ? "border-destructive" : "border-input"} 
              focus:outline-none focus:ring-2 focus:ring-ring`}
            aria-invalid={errors[name] ? "true" : "false"}
            {...field}
          />
        )}
      />

      {errors[name] && (
        <ErrorText text={errors[name]?.message as string} />
      )}
    </div>
  );
}
