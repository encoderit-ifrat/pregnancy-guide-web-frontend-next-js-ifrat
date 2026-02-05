import { FORM_DATA } from "@/data/global_data";
import { ContactFormType } from "../_types/contact_us_types";

export const INITIAL_CONTACT_FORM_DATA: ContactFormType = {
  ...FORM_DATA,
  data: {
    firstName: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  },
};
