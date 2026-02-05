import { FORM_DATA } from "@/data/global_data";
import { ForgotPasswordFormType } from "../_types/forgot_password_types";

export const INITIAL_Forgot_Password_FORM_DATA: ForgotPasswordFormType = {
  ...FORM_DATA,
  data: {
    email: "",
  },
};
