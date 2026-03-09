import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInvitationDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["invitation-delete"],
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/invitations/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
