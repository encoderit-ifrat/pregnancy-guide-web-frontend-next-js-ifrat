import * as z from "zod";

export const ProfileFormSchema = z.object({
  babyName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "Baby name must be at least 2 characters"
    )
    .refine(
      (val) => !val || val.length <= 50,
      "Baby name must be less than 50 characters"
    ),
  gender: z.enum(["male", "female", "other"]).optional(),
  dueDate: z.string().optional(),
  dob: z.string().optional(),
  lastPeriodDate: z.string().optional(),
  weight: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?$/.test(val),
      "Weight must be a valid number"
    )
    .refine(
      (val) => !val || parseFloat(val) > 0,
      "Weight must be greater than 0"
    )
    .refine(
      (val) => !val || parseFloat(val) <= 20,
      "Weight must be less than 20 kg"
    ),
  height: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?$/.test(val),
      "Height must be a valid number"
    )
    .refine(
      (val) => !val || parseFloat(val) > 0,
      "Height must be greater than 0"
    )
    .refine(
      (val) => !val || parseFloat(val) <= 200,
      "Height must be less than 200 cm"
    ),
}).refine(
  (data) => data.lastPeriodDate || data.dueDate,
  {
    message: "Either last period date or due date must be provided",
    path: ["lastPeriodDate"],
  }
);

export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>;
