import { ChecklistSchemaType } from "./checklist_types";

export type ChecklistFormData = {
  type: "default" | "update" | "delete";
  id: string;
  data?: ChecklistSchemaType;
};
