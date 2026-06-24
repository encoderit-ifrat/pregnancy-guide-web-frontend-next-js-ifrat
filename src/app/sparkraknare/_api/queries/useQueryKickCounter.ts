import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  ActiveKickSession,
  KickSessionListItem,
  KickStatistics,
  KickTodaySummary,
} from "../../_types/kick_types";
import { Paginated } from "@/types/pagination";

export const kickKeys = {
  active: ["kick-counter", "active"] as const,
  sessions: (page?: number) => ["kick-counter", "sessions", page] as const,
  summary: ["kick-counter", "summary-today"] as const,
  statistics: (range: string) => ["kick-counter", "statistics", range] as const,
};

export const useQueryActiveKickSession = (enabled = false) =>
  useQuery({
    queryKey: kickKeys.active,
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled,
    queryFn: async () => {
      const res = await api.get("/kick-counter/sessions/active");
      return res.data.data as ActiveKickSession | null;
    },
  });

export const useQueryKickSessions = (page = 1, limit = 10) =>
  useQuery({
    queryKey: kickKeys.sessions(page),
    queryFn: async () => {
      const res = await api.get("/kick-counter/sessions", {
        params: { page, limit },
      });
      return res.data.data as Paginated<KickSessionListItem>;
    },
  });

export const useQueryKickTodaySummary = () =>
  useQuery({
    queryKey: kickKeys.summary,
    queryFn: async () => {
      const res = await api.get("/kick-counter/summary/today");
      return res.data.data as KickTodaySummary;
    },
  });

export const useQueryKickStatistics = (range: "week" | "month" = "week") =>
  useQuery({
    queryKey: kickKeys.statistics(range),
    queryFn: async () => {
      const res = await api.get("/kick-counter/statistics", {
        params: { range },
      });
      return res.data.data as KickStatistics;
    },
  });
