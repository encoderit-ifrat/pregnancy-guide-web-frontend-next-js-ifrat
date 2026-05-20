import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ChecklistSchemaType } from "../../_types/checklist_types";

export const useMutationUpdateChecklist = () => {
  return useMutation({
    mutationKey: ["update-checklist"],
    mutationFn: (body: ChecklistSchemaType) => {
      const { _id, title, description, category, is_active, items } = body;
      return api.patch(`/checklists/${_id}`, {
        _id,
        title,
        description,
        category,
        is_active,
        items,
      });
    },
  });
};
