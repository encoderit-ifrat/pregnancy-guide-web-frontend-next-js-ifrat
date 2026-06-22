import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  ActiveContractionSession,
  ContractionSession,
  ContractionStatistics,
  ContractionSummary,
} from "../../_types/contraction_types";
import { Paginated } from "@/types/pagination";

export const contractionKeys = {
  active: ["contraction-counter", "active"] as const,
  sessions: (page?: number) =>
    ["contraction-counter", "sessions", page] as const,
  summary: ["contraction-counter", "summary"] as const,
  statistics: (range: string, view: string) =>
    ["contraction-counter", "statistics", range, view] as const,
};

export const useQueryActiveContractionSession = () =>
  useQuery({
    queryKey: contractionKeys.active,
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await api.get("/contraction-counter/sessions/active");
      return res.data.data as ActiveContractionSession | null;
    },
  });

export const useQueryContractionSessions = (page = 1, limit = 10) =>
  useQuery({
    queryKey: contractionKeys.sessions(page),
    queryFn: async () => {
      const res = await api.get("/contraction-counter/sessions", {
        params: { page, limit },
      });
      return res.data.data as Paginated<ContractionSession>;
    },
  });

export const useQueryContractionSummary = () =>
  useQuery({
    queryKey: contractionKeys.summary,
    queryFn: async () => {
      const res = await api.get("/contraction-counter/summary");
      return res.data.data as ContractionSummary;
    },
  });

export const useQueryContractionStatistics = (
  range: "week" | "month" = "week",
  view: "frequency" | "duration" | "interval" = "frequency"
) =>
  useQuery({
    queryKey: contractionKeys.statistics(range, view),
    queryFn: async () => {
      const res = await api.get("/contraction-counter/statistics", {
        params: { range, view },
      });
      return res.data.data as ContractionStatistics;
    },
  });
