import * as z from "zod";

import { FormType } from "@/types/global";

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "forgotPassword.validation.emailRequired")
    .email("forgotPassword.validation.emailInvalid"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export type ForgotPasswordFormType = FormType & {
  data: ForgotPasswordSchemaType;
};
