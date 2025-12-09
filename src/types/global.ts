import { ReactNode } from "react";
import * as z from "zod";
import { Control, FieldErrors } from "react-hook-form";

//ZOD
export const OptionSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
});
export type OptionSchemaType = z.infer<typeof OptionSchema>;
export type ActionsType = {
  type: string;
  label: string;
  show: boolean;
  icon: ReactNode;
  variant: "destructive" | "default";
  action: () => void;
};
export type ProductType = "General" | "Intermediate";
export type GlobalPropsType = {
  enabled?: boolean;
  refetchOnMount?: boolean;
};
export type FormType = {
  type:
    | "view"
    | "default"
    | "create"
    | "update"
    | "delete"
    | "permission"
    | "create_po"
    | "update_po"
    | "delete_po";
  title?: string;
  description?: string;
  buttonText: string;
};
export type ModalType = {
  open: boolean;
  onOpenChange: () => void;
};
export type URLParamsType = {
  page?: number;
  per_page?: number;
  role?: string;
  status?: string;
  search?: string;
};
export type ControlDropdownProps = {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
};
