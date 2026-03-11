import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type SwipeAction = "like" | "love" | "dislike";

export interface SwipeResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    gender: string;
    liked_count: number;
    loved_count: number;
    disliked_count: number;
    category_id: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const useMutationSwipeTinderName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
      guestId,
    }: {
      id: string;
      action: SwipeAction;
      guestId?: string | null;
    }) => {
      const res = await api.post<SwipeResponse>(
        `/tinder-names/${id}/swipe`,
        { action },
        {
          headers: guestId ? { "x-guest-id": guestId } : undefined,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate all tinder-names list queries so counts refresh
      queryClient.invalidateQueries({ queryKey: ["tinder-names"] });
      queryClient.invalidateQueries({ queryKey: ["tinder-names-matching"] });
    },
  });
};
