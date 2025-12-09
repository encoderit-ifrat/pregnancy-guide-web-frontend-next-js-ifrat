import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ChecklistSchemaType } from "../../_types/checklist_types";
import { omitEmpty } from "@/lib/utils";

export const useMutationCreateChecklist = () => {
  return useMutation({
    mutationKey: ["create-checklist"],
    mutationFn: (body: ChecklistSchemaType) =>
      api.post("/checklists", omitEmpty(body)),
  });
};
