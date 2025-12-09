import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type TProps = {
  id: string;
};

export const useMutationToggleChecklist = () => {
  return useMutation({
    mutationKey: ["toggle-checklist"],
    mutationFn: ({ id }: TProps) => api.patch(`checklist-items/${id}/toggle`),
  });
};
