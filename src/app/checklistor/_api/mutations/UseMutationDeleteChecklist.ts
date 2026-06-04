import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type TProps = {
  id: string;
};
export const useMutationDeleteChecklist = () => {
  return useMutation({
    mutationKey: ["delete-checklist"],
    mutationFn: ({ id }: TProps) => api.delete(`/checklists/${id}`),
  });
};
