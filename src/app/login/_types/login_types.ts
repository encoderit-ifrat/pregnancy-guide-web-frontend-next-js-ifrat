import * as z from "zod";

import { FormType } from "@/types/global";

// Login Schema Validation with acceptTerms optional
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  acceptTerms: z.boolean().optional(), // This allows both true and false values
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type LoginFormType = FormType & {
  data: LoginSchemaType;
};
