import { ChecklistSchemaType } from "./checklist_types";

export type ChecklistItem = {
  _id: string;
  title: string;
  description: string;
  week?: number;
  is_completed?: boolean;
  order?: number;
  is_optional?: boolean;
};

export type ChecklistItemWithItems = {
  _id: string;
  title: string;
  description: string;
  category: string;
  items: ChecklistItem[];
  is_active: boolean;
  userId?: string;
};

export type CheckListItemProps = {
  checklistItems: ChecklistItemWithItems[];
  overview?: boolean;
  onDeleteAction?: (item: ChecklistItemWithItems) => void;
  onEditAction?: (item: ChecklistItemWithItems) => void;
};

export type ChecklistFormProps = {
  formData?: {
    type: "default" | "update" | "delete";
    id: string;
    data?: ChecklistSchemaType;
  };
  onSubmitForDialogAndRefetch: () => void;
};
