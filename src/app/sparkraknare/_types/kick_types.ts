export type KickType = "soft" | "hard" | "unsure";

export interface KickEvent {
  _id: string;
  session: string;
  type: KickType;
  occurred_at: string;
}

export interface KickSession {
  _id: string;
  user: string;
  status: "active" | "completed";
  started_at: string;
  ended_at: string | null;
  total_kicks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveKickSession extends KickSession {
  kicks: KickEvent[];
}

export interface KickSessionListItem extends KickSession {
  type_label: "soft" | "hard" | "mixed" | null;
}

export interface KickTodaySummary {
  total_kicks: number;
  sessions: number;
  avg_per_hour: number;
}

export interface KickStatistics {
  totals: {
    total_this_week: number;
    daily_average: number;
    peak_hour: string;
  };
  this_week_breakdown: { soft: number; hard: number; unsure: number };
  daily_trend: { date: string; count: number }[];
  hourly_pattern: { hour: number; avg: number }[];
  insights: string[];
  session_history: {
    id: string;
    count: number;
    label: "soft" | "hard" | "mixed" | null;
    started_at: string;
  }[];
}
