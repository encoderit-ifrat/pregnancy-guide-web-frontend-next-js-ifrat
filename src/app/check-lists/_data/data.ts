import { FORM_DATA } from "@/data/global_data";
import { checklistFormType } from "../_types/checklist_types";

export const INITIAL_CHECKLIST_FORM_DATA: checklistFormType = {
  ...FORM_DATA,
  data: {
    title: "",
    description: "",
    category: "",
    is_active: true,
    items: [
      {
        title: "",
        description: "",
        // order: 1,
        // is_optional: false,
      },
    ],
  },
};
