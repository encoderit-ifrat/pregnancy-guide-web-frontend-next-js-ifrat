import * as z from "zod";

import { FormType } from "@/types/global";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "signUp.validation.nameRequired")
      .min(2, "signUp.validation.nameMin")
      .max(50, "signUp.validation.nameMax")
      .regex(/^[a-zA-Z\s]+$/, "signUp.validation.nameLettersSpaces"),
    email: z
      .string()
      .min(1, "signUp.validation.emailRequired")
      .email("signUp.validation.emailInvalid")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "signUp.validation.passwordMin")
      .regex(/[A-Z]/, "signUp.validation.passwordUppercase")
      .regex(/[a-z]/, "signUp.validation.passwordLowercase")
      .regex(/[0-9]/, "signUp.validation.passwordNumber")
      .regex(
        /[^A-Za-z0-9]/,
        "signUp.validation.passwordSpecial"
      ),
    confirmPassword: z.string().min(1, "signUp.validation.confirmPasswordRequired"),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "signUp.validation.acceptTermsRequired",
      path: ["acceptTerms"],
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "signUp.validation.passwordsMatch",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export type RegisterFormType = FormType & {
  data: RegisterSchemaType;
};
