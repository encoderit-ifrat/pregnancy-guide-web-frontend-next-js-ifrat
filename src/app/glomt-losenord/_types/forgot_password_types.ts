import * as z from "zod";

import { FormType } from "@/types/global";

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export type ForgotPasswordFormType = FormType & {
  data: ForgotPasswordSchemaType;
};
