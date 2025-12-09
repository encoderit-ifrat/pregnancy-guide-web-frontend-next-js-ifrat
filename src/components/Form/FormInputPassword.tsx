"use client";

import { useState, ReactElement } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, Control, FieldErrors } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";

type FormInputPasswordProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  placeholder?: string;
  iconComponent?: ReactElement;
};

export function FormInputPassword({
  name,
  control,
  errors,
  label,
  placeholder = "Password",
  iconComponent,
}: FormInputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div className="space-y-1.5 w-full max-w-[563px]">
      <Label htmlFor={name} className={errors[name] ? "text-destructive" : ""}>
        {label}
      </Label>

      <div className="relative flex items-center bg-[#EEEEEE] w-full rounded-full">
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              id={name}
              type={isVisible ? "text" : "password"}
              placeholder={placeholder}
              className={`rounded-full px-4 py-2 pe-9 w-[563px] ${iconComponent ? "pl-10 md:pl-10" : ""
                } ${errors[name] ? "border-destructive" : ""}`}
              aria-invalid={errors[name] ? "true" : "false"}
              {...field}
            />
          )}
        />

        {/* Left-side icon */}
        {iconComponent && (
          <div className="absolute left-3 flex items-center text-muted-foreground">
            {iconComponent}
          </div>
        )}

        {/* Right-side password toggle */}
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex h-full w-9 items-center
           justify-center text-muted-foreground/80 hover:text-foreground focus-visible:border-ring
           focus-visible:ring-ring/50 rounded-e-md transition-[color,box-shadow] outline-none focus:z-10
           focus-visible:ring-[3px]"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Error message */}
      {errors[name] && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
