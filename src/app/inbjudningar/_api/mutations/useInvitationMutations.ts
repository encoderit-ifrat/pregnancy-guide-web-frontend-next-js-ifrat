import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { omitEmpty } from "@/lib/utils";
import {
  CreateInvitationPayload,
  DeliveryOption,
  Recipient,
} from "../../_types/invitation_types";

export const useCreateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "create"],
    mutationFn: async (body: CreateInvitationPayload | FormData) => {
      if (body instanceof FormData) {
        const res = await api.post("/event-invitations", body);
        return res.data.data;
      }
      const res = await api.post("/event-invitations", omitEmpty(body));
      return res.data.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["event-invitations", "list"] }),
  });
};

export const useUpdateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "update"],
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<CreateInvitationPayload>;
    }) => api.patch(`/event-invitations/${id}`, omitEmpty(body)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-invitations"] }),
  });
};

export const useDeleteInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "delete"],
    mutationFn: (id: string) => api.delete(`/event-invitations/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["event-invitations", "list"] }),
  });
};

export const useDuplicateInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "duplicate"],
    mutationFn: (id: string) => api.post(`/event-invitations/${id}/duplicate`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["event-invitations", "list"] }),
  });
};

export const useAddRecipients = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "add-recipients"],
    mutationFn: ({ id, recipients }: { id: string; recipients: Recipient[] }) =>
      api.post(`/event-invitations/${id}/recipients`, { recipients }),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["event-invitations", "detail", v.id] }),
  });
};

export const useRemoveRecipient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "remove-recipient"],
    mutationFn: ({ id, guestId }: { id: string; guestId: string }) =>
      api.delete(`/event-invitations/${id}/recipients/${guestId}`),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["event-invitations", "detail", v.id] }),
  });
};

export const useSendInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "send"],
    mutationFn: ({
      id,
      schedule_at,
      delivery_options,
    }: {
      id: string;
      schedule_at?: string;
      delivery_options?: DeliveryOption[];
    }) =>
      api.post(
        `/event-invitations/${id}/send`,
        omitEmpty({ schedule_at, delivery_options })
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-invitations"] }),
  });
};

export const useRespondInvitation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["event-invitations", "respond"],
    mutationFn: ({
      token,
      status,
    }: {
      token: string;
      status: "accepted" | "declined";
    }) =>
      api.post(`/public/event-invitations/guest/${token}/respond`, { status }),
    onSuccess: (_d, v) =>
      qc.invalidateQueries({
        queryKey: ["event-invitations", "public", v.token],
      }),
  });
};
