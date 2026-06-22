"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  BarChart3,
  History,
  Loader2,
  Phone,
  Play,
  Square,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { ActiveContractionSession } from "../_types/contraction_types";
import { useQueryContractionSummary } from "../_api/queries/useQueryContraction";
import {
  useEndContractionSession,
  useStartContraction,
  useStopContraction,
} from "../_api/mutations/useContractionMutations";
import { fmtDuration, fmtClock } from "../_lib/format";

interface Props {
  session: ActiveContractionSession;
  onViewStats: () => void;
  onViewHistory: () => void;
}

export default function ContractionCounter({
  session,
  onViewStats,
  onViewHistory,
}: Props) {
  const { data: summary } = useQueryContractionSummary();
  const startContraction = useStartContraction();
  const stopContraction = useStopContraction();
  const endSession = useEndContractionSession();

  const running = useMemo(
    () => session.contractions.find((c) => !c.end_time) ?? null,
    [session.contractions]
  );

  // Live ticking timer while a contraction is in progress.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) {
      setElapsed(0);
      return;
    }
    const startedAt = new Date(running.start_time).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleToggle = () => {
    if (running) {
      stopContraction.mutate(
        { sessionId: session._id, contractionId: running._id },
        { onError: () => toast.error("Could not stop contraction") }
      );
    } else {
      startContraction.mutate(session._id, {
        onError: () => toast.error("Could not start contraction"),
      });
    }
  };

  const completed = session.contractions
    .filter((c) => c.end_time)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

  const busy = startContraction.isPending || stopContraction.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="p-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
            <Timer className="size-3.5" /> Tracking Active
          </span>
          <h2 className="mt-3 text-xl font-semibold text-primary-dark">
            Contraction Timer
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Track your contractions to know when it&apos;s time for the hospital
          </p>

          <div className="my-8">
            {running ? (
              <p className="font-mono text-5xl font-bold text-primary">
                {fmtClock(elapsed)}
              </p>
            ) : (
              <p className="text-sm text-text-secondary">
                Ready to track next contraction?
              </p>
            )}
          </div>

          <Button
            onClick={handleToggle}
            disabled={busy}
            size="lg"
            variant={running ? "outline" : "default"}
            className="min-w-52 justify-center"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : running ? (
              <Square className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
            {running ? "Stop Contraction" : "Start Contraction"}
          </Button>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6">
            <Stat label="Total Count" value={String(session.total_count)} />
            <Stat
              label="Avg Interval"
              value={fmtDuration(summary?.avg_interval_sec ?? session.avg_interval_sec)}
            />
            <Stat
              label="Avg Duration"
              value={fmtDuration(summary?.avg_duration_sec ?? session.avg_duration_sec)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-primary-dark">
            Session Timeline
          </h3>
          <div className="space-y-2">
            {completed.length === 0 && (
              <p className="py-6 text-center text-sm text-text-secondary">
                No contractions recorded yet.
              </p>
            )}
            {completed.map((c, idx) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-lg bg-primary-light/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                    #{completed.length - idx}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {new Date(c.start_time).toLocaleTimeString("sv-SE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="text-sm font-medium text-primary-dark">
                  {fmtDuration(c.duration_sec ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="mb-3 font-semibold text-primary-dark">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="purple"
              onClick={onViewStats}
              className="w-full justify-center"
            >
              <BarChart3 className="size-4" /> View Statistics
            </Button>
            <Button
              variant="outline"
              onClick={onViewHistory}
              className="w-full justify-center"
            >
              <History className="size-4" /> View History
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full justify-center border-destructive text-destructive"
            >
              <a href="tel:112">
                <Phone className="size-4" /> Emergency Contact
              </a>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-primary-light/40">
          <h3 className="font-semibold text-primary-dark">Tracking Tips</h3>
          <ul className="mt-2 space-y-2 text-sm text-text-secondary">
            <li>• Track from the start of one contraction to the start of the next</li>
            <li>• Note the duration of each contraction</li>
            <li>• Rest between contractions</li>
          </ul>
        </Card>

        <Button
          variant="ghost"
          onClick={() =>
            endSession.mutate(session._id, {
              onSuccess: () => toast.success("Session ended"),
            })
          }
          disabled={endSession.isPending}
          className="w-full justify-center"
        >
          End Session
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-primary-dark">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
