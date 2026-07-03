import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  EventInvitationDetail,
  EventInvitationListItem,
  InvitationTemplateMeta,
  PublicInvitationView,
} from "../../_types/invitation_types";
import { Paginated } from "@/types/pagination";

export const invitationKeys = {
  list: (status: string, page?: number) =>
    ["event-invitations", "list", status, page] as const,
  detail: (id: string) => ["event-invitations", "detail", id] as const,
  templates: ["event-invitations", "templates"] as const,
  public: (token: string) => ["event-invitations", "public", token] as const,
};

export const useQueryInvitations = (status = "all", page = 1, limit = 6) =>
  useQuery({
    queryKey: invitationKeys.list(status, page),
    queryFn: async () => {
      const res = await api.get("/event-invitations", {
        params: { status, page, limit },
      });
      return res.data.data as Paginated<EventInvitationListItem>;
    },
  });

export const useQueryInvitationDetail = (id: string) =>
  useQuery({
    queryKey: invitationKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/event-invitations/${id}`);
      return res.data.data as EventInvitationDetail;
    },
  });

export const useQueryInvitationTemplates = () =>
  useQuery({
    queryKey: invitationKeys.templates,
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get("/event-invitations/templates");
      return res.data.data as InvitationTemplateMeta[];
    },
  });

export const useQueryPublicInvitation = (token: string) =>
  useQuery({
    queryKey: invitationKeys.public(token),
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get(`/public/event-invitations/${token}`);
      return res.data.data as PublicInvitationView;
    },
  });
