import { Controller, Control, FieldErrors } from "react-hook-form";

import { Label } from "@/components/ui/Label";
import ErrorText from "../base/ErrorText";
import { CheckBox } from "../ui/Checkbox";

type FormCheckboxProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  disabled?: boolean;
};

export function FormCheckbox({
  name,
  control,
  errors,
  label,
  disabled,
}: FormCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CheckBox
            id={name}
            disabled={disabled}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Label
        htmlFor={name}
        className={`cursor-pointer ${errors[name] ? "text-destructive" : ""}`}
      >
        {label}
      </Label>

      {errors[name] && <ErrorText text={errors[name]?.message as string} />}
    </div>
  );
}
