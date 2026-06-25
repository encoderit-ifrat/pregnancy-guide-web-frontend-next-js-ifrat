/** 75 -> "1m 15s" (compact, for averages/durations). */
export function fmtDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
}

/** 3600 -> "1h 00m", 243 -> "04m 03s" (for session durations). */
export function fmtFullDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
  return `${sec}s`;
}

/** 75 -> "01:15" (mm:ss, for the live timer). */
export function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}
