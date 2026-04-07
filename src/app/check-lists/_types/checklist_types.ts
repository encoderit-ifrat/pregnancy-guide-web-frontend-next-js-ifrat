import { FormType } from "@/types/global";
import { z } from "zod";

export const getChecklistItemSchema = (t: any) => z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .min(1, t("checklists.form.validation.itemTitleRequired"))
    .min(2, t("checklists.form.validation.itemTitleMin"))
    .max(200, t("checklists.form.validation.itemTitleMax")),
  description: z
    .string()
    .max(500, t("checklists.form.validation.itemDescriptionMax"))
    .optional(),
  week: z
    .number()
    .int(t("checklists.form.validation.weekWholeNumber"))
    .min(0, t("checklists.form.validation.weekMin"))
    .max(42, t("checklists.form.validation.weekMax"))
    .optional(),
});

export const getChecklistSchema = (t: any) => z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .min(1, t("checklists.form.validation.titleRequired"))
    .min(2, t("checklists.form.validation.titleMin"))
    .max(100, t("checklists.form.validation.titleMax"))
    .optional(),
  description: z
    .string()
    .max(500, t("checklists.form.validation.descriptionMax"))
    .optional(),
  category: z.string().optional(),
  // items: z
  //   .array(ChecklistItemSchema)
  //   .min(1, "At least one checklist item is required"),
  is_active: z.boolean(),
  items: z.any().optional(),
});

// For backward compatibility and type inference
export const ChecklistSchema = getChecklistSchema((key: string) => key);
export const ChecklistItemSchema = getChecklistItemSchema((key: string) => key);

export type ChecklistSchemaType = z.infer<typeof ChecklistSchema>;

export type checklistFormType = FormType & {
  data: ChecklistSchemaType;
};
