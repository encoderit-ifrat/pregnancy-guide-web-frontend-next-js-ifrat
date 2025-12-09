import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";
import { ReactElement } from "react";

type FormInputProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "email" | "number" | "password";
  iconComponent?: ReactElement;
  iconSize?: number | string; // 
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

      <div className="relative flex items-center">
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
              className={`peer rounded-full px-4 py-2 pe-9 w-[563px] bg-[#EEEEEE] ${iconComponent ? "pl-10" : ""
                } ${errors[name] ? "border-destructive" : ""}`}
              aria-invalid={errors[name] ? "true" : "false"}
              {...field}
            />
          )}
        />

        {/* Icon wrapper */}
        {iconComponent && (
          <div className="absolute left-3  items-center text-muted-foreground w-[20px] h-[14px]">
            {iconComponent}
          </div>
        )}
      </div>

      {errors[name] && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
