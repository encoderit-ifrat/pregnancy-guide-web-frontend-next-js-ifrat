import * as z from "zod";

import { FormType } from "@/types/global";

// Login Schema Validation with acceptTerms optional
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "login.validation.emailRequired")
    .email("login.validation.emailInvalid"),
  password: z.string().min(1, "login.validation.passwordRequired"),
  acceptTerms: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type LoginFormType = FormType & {
  data: LoginSchemaType;
};
