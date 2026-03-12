import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { InvitationsResponse } from "../../_types/invitation_types";

export const useQueryGetInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data } = await api.get<InvitationsResponse>("/invitations");
      return data?.data?.data ?? [];
    },
  });
};
