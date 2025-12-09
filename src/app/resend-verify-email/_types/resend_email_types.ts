import * as z from "zod";

import { FormType, OptionSchema } from "@/types/global";

export const ResendVerifyEmailSchema = z.object({
  email: z.string().min(1, "Email is required"),
});

export type ResendVerifyEmailSchemaType = z.infer<
  typeof ResendVerifyEmailSchema
>;

export type ResendVerifyEmailFormType = FormType & {
  data: ResendVerifyEmailSchemaType;
};
