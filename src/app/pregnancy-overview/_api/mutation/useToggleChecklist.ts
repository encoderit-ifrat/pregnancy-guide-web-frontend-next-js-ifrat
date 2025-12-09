import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
type TProps = {
  id: string | number;
};
export const useToggleChecklist = () =>
  useMutation({
    mutationKey: ["useToggleChecklist"],
    mutationFn: async ({ id }: TProps) => {
      return await api.post(`/my/checklists/${id}/toggle`);
    },
  });
