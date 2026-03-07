import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface DislikeAllResponse {
  success: boolean;
  message: string;
}

export const useMutationDislikeAllTinderNames = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nameIds: string[]) => {
      const res = await api.post<DislikeAllResponse>(
        "/tinder-names/dislike-all",
        { name_ids: nameIds }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tinder-names"] });
    },
  });
};
