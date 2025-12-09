import { FORM_DATA } from "@/data/global_data";
import { ChangePasswordFormType } from "../_types/change_password_types";


export const INITIAL_Change_Password_FORM_DATA: ChangePasswordFormType = {
  ...FORM_DATA,
  data: {
    password: "",
    confirmPassword: "",

  },
};