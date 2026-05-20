import { ChecklistSchemaType } from "./checklist_types";

export type ChecklistFormData = {
  type: "default" | "update" | "delete" | "create";
  id: string;
  data?: ChecklistSchemaType;
};
