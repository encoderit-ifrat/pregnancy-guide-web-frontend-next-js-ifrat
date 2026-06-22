import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KickType } from "../../_types/kick_types";

export const useStartKickSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["kick-counter", "start-session"],
    mutationFn: async () => {
      const res = await api.post("/kick-counter/sessions");
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kick-counter"] });
    },
  });
};

export const useStopKickSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["kick-counter", "stop-session"],
    mutationFn: async (id: string) => {
      const res = await api.patch(`/kick-counter/sessions/${id}/stop`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kick-counter"] });
    },
  });
};

export const useAddKick = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["kick-counter", "add-kick"],
    mutationFn: async ({ sessionId, type }: { sessionId: string; type: KickType }) => {
      const res = await api.post(`/kick-counter/sessions/${sessionId}/kicks`, {
        type,
      });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kick-counter", "active"] });
      qc.invalidateQueries({ queryKey: ["kick-counter", "summary-today"] });
    },
  });
};

export const useDeleteKickSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["kick-counter", "delete-session"],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kick-counter/sessions/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kick-counter"] });
    },
  });
};
