import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/checklists/clone-from-templates", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-template"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-my-checklists"] });
    },
  });
};
