import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStartContractionSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["contraction-counter", "start-session"],
    mutationFn: async () => {
      const res = await api.post("/contraction-counter/sessions");
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contraction-counter"] }),
  });
};

export const useEndContractionSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["contraction-counter", "end-session"],
    mutationFn: async (id: string) => {
      const res = await api.patch(`/contraction-counter/sessions/${id}/end`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contraction-counter"] }),
  });
};

export const useStartContraction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["contraction-counter", "start-contraction"],
    mutationFn: async (sessionId: string) => {
      const res = await api.post(
        `/contraction-counter/sessions/${sessionId}/contractions/start`
      );
      return res.data.data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["contraction-counter", "active"] }),
  });
};

export const useStopContraction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["contraction-counter", "stop-contraction"],
    mutationFn: async ({
      sessionId,
      contractionId,
    }: {
      sessionId: string;
      contractionId: string;
    }) => {
      const res = await api.patch(
        `/contraction-counter/sessions/${sessionId}/contractions/${contractionId}/stop`
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contraction-counter", "active"] });
      qc.invalidateQueries({ queryKey: ["contraction-counter", "summary"] });
    },
  });
};

export const useDeleteContractionSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["contraction-counter", "delete-session"],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/contraction-counter/sessions/${id}`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contraction-counter"] }),
  });
};
