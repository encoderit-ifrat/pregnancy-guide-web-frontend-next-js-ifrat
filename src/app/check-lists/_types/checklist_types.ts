import { FormType } from "@/types/global";
import { z } from "zod";

export const ChecklistItemSchema = z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .min(1, "Item title is required")
    .min(2, "Item title must be at least 2 characters")
    .max(200, "Item title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Item description is required")
    .min(5, "Item description must be at least 5 characters")
    .max(500, "Item description must be less than 500 characters"),
  week: z
    .number()
    .int("Week must be a whole number")
    .min(0, "Week must be 0 or greater")
    .max(42, "Week must be 42 or less")
    .optional(),
});

export const ChecklistSchema = z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .min(1, "Checklist title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) =>
        ["general", "medical", "nutrition", "exercise", "preparation"].includes(
          val
        ),
      "Please select a valid category"
    )
    .optional(),
  items: z
    .array(ChecklistItemSchema)
    .min(1, "At least one checklist item is required"),
  is_active: z.boolean().default(true),
});

export type ChecklistSchemaType = z.infer<typeof ChecklistSchema>;

export type checklistFormType = FormType & {
  data: ChecklistSchemaType;
};
