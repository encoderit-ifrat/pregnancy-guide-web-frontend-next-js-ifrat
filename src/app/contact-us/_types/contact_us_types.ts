import * as z from "zod";

import { FormType } from "@/types/global";

export const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string().min(11, "Phone number must be at least 11 digits"),
  location: z.string().min(1, "Location is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactSchemaType = z.infer<typeof ContactSchema>;

export type ContactFormType = FormType & {
  data: ContactSchemaType;
};
