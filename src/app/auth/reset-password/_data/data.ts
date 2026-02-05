import { FORM_DATA } from "@/data/global_data";
import { ResetPasswordFormType } from "../_types/change_password_types";

export const INITIAL_Reset_Password_FORM_DATA: ResetPasswordFormType = {
  ...FORM_DATA,
  data: {
    password: "",
    confirmPassword: "",
  },
};
