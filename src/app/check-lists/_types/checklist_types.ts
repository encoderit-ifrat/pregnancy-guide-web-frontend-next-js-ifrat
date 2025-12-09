import { FormType } from "@/types/global";
import { z } from "zod";

export const ChecklistItemSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  // order: z.number().optional(),
  // is_optional: z.boolean(),
  week: z.number().optional(),
});

export const ChecklistSchema = z.object({
  _id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  items: z.array(ChecklistItemSchema),
  is_active: z.boolean(),
});

export type ChecklistSchemaType = z.infer<typeof ChecklistSchema>;

export type checklistFormType = FormType & {
  data: ChecklistSchemaType;
};
