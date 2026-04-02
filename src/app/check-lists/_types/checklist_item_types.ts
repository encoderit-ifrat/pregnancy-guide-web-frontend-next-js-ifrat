import { ChecklistSchemaType } from "./checklist_types";

export type ChecklistItem = {
  _id: string;
  title: string;
  description: string;
  week?: number;
  is_completed?: boolean;
  checked?: boolean;
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
  all_checked?: boolean;
  progress?: {
    percentage: number;
  };
};

export type CheckListItemProps = {
  checklistItems?: ChecklistItemWithItems[];
  overview?: boolean;
  onDeleteAction?: (item: ChecklistItemWithItems) => void;
  onEditAction?: (item: ChecklistItemWithItems) => void;
  className?: string;
  limit?: number;
  activeTab?: string;
  totalPages?: number;
  currentPage?: number;
};

export type ChecklistFormProps = {
  formData?: {
    type: "default" | "update" | "delete" | "create";
    id: string;
    data?: ChecklistSchemaType;
  };
  onSubmitForDialogAndRefetch: () => void;
};
