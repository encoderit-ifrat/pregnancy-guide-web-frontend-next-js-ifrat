import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ListVoteAction = "like" | "love";

export interface ListVoteResponse {
  success: boolean;
  message: string;
  data: {
    name_id: string;
    liked_count: number;
    loved_count: number;
    my_action: ListVoteAction | null;
  };
}

/**
 * Cast (or toggle off) a like/love vote on a name within a *shared* matched
 * list. Scoped to the list via `listOwnerId`, so votes only affect this list —
 * not global name counts or any other couple's list.
 */
export const useMutationVoteListName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
      listOwnerId,
      guestId,
    }: {
      id: string;
      action: ListVoteAction;
      listOwnerId: string;
      guestId?: string | null;
    }) => {
      const res = await api.post<ListVoteResponse>(
        `/tinder-names/${id}/list-vote`,
        {
          action,
          list_owner_id: listOwnerId,
          guest_id: guestId,
        }
      );
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tinder-names-matching"] });
    },
  });
};
