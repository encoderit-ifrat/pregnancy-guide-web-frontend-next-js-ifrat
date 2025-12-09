import * as z from "zod";

import { FormType} from "@/types/global";

export const ChangePasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;


export type ChangePasswordFormType = FormType & {
  data: ChangePasswordSchemaType;
};


