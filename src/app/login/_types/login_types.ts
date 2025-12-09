import * as z from "zod";

import { FormType, OptionSchema } from "@/types/global";

// Login Schema Validation with acceptTerms optional
export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  acceptTerms: z.boolean(), // This allows both true and false values
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type LoginFormType = FormType & {
  data: LoginSchemaType;
};
