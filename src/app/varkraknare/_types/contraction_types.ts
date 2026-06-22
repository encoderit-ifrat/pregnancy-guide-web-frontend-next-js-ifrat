export interface Contraction {
  _id: string;
  session: string;
  start_time: string;
  end_time: string | null;
  duration_sec: number | null;
  interval_sec: number | null;
}

export interface ContractionSession {
  _id: string;
  user: string;
  status: "active" | "completed";
  started_at: string;
  ended_at: string | null;
  total_count: number;
  avg_duration_sec: number;
  avg_interval_sec: number;
  createdAt?: string;
}

export interface ActiveContractionSession extends ContractionSession {
  contractions: Contraction[];
}

export interface ContractionSummary {
  total_count: number;
  avg_interval_sec: number;
  avg_duration_sec: number;
}

export type LaborProgress = "early" | "active" | "transition";
export type LaborLevel = "info" | "warning" | "urgent";

export interface ContractionStatistics {
  totals: {
    total_this_week: number;
    avg_duration_sec: number;
    avg_interval_sec: number;
  };
  labor_progress: LaborProgress;
  daily_counts: { date: string; count: number }[];
  series: { view: string; points: { t: string; value: number }[] };
  pattern_analysis: string[];
  call_to_action: {
    level: LaborLevel;
    message: string;
    show_call_hospital: boolean;
  };
  recent_sessions: {
    id: string;
    count: number;
    avg_duration_sec: number;
    avg_interval_sec: number;
  }[];
}
