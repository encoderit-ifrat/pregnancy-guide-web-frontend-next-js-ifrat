import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InvitationCreateRequest,
  InvitationCreateResponse,
} from "../../_types/invitation_types";

export const useInvitationCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["invitation-create"],
    mutationFn: async (body: InvitationCreateRequest) => {
      const { data } = await api.post<InvitationCreateResponse>(
        "/invitations",
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
