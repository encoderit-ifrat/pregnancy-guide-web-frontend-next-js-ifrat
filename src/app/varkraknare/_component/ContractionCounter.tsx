"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();
  const { data: summary } = useQueryContractionSummary();
  const startContraction = useStartContraction();
  const stopContraction = useStopContraction();
  const endSession = useEndContractionSession();

  const running = useMemo(
    () => session.contractions.find((c) => !c.end_time) ?? null,
    [session.contractions]
  );

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
        { onError: () => toast.error(t("contractionCounter.counter.stopError")) }
      );
    } else {
      startContraction.mutate(session._id, {
        onError: () => toast.error(t("contractionCounter.counter.startError")),
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
            <Timer className="size-3.5" /> {t("contractionCounter.counter.active")}
          </span>
          <h2 className="mt-3 text-xl font-semibold text-primary-dark">
            {t("contractionCounter.counter.timerTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t("contractionCounter.counter.timerDesc")}
          </p>

          <div className="my-8">
            {running ? (
              <p className="font-mono text-5xl font-bold text-primary">
                {fmtClock(elapsed)}
              </p>
            ) : (
              <p className="text-sm text-text-secondary">
                {t("contractionCounter.counter.readyNext")}
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
            {running
              ? t("contractionCounter.counter.stop")
              : t("contractionCounter.counter.start")}
          </Button>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6">
            <Stat
              label={t("contractionCounter.counter.totalCount")}
              value={String(session.total_count)}
            />
            <Stat
              label={t("contractionCounter.counter.avgInterval")}
              value={fmtDuration(
                summary?.avg_interval_sec ?? session.avg_interval_sec
              )}
            />
            <Stat
              label={t("contractionCounter.counter.avgDuration")}
              value={fmtDuration(
                summary?.avg_duration_sec ?? session.avg_duration_sec
              )}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-primary-dark">
            {t("contractionCounter.counter.timeline")}
          </h3>
          <div className="space-y-2">
            {completed.length === 0 && (
              <p className="py-6 text-center text-sm text-text-secondary">
                {t("contractionCounter.counter.noContractions")}
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
          <h3 className="mb-3 font-semibold text-primary-dark">
            {t("contractionCounter.counter.quickActions")}
          </h3>
          <div className="space-y-2">
            <Button
              variant="purple"
              onClick={onViewStats}
              className="w-full justify-center"
            >
              <BarChart3 className="size-4" />{" "}
              {t("contractionCounter.counter.viewStatistics")}
            </Button>
            <Button
              variant="outline"
              onClick={onViewHistory}
              className="w-full justify-center"
            >
              <History className="size-4" />{" "}
              {t("contractionCounter.counter.viewHistory")}
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full justify-center border-destructive text-destructive"
            >
              <a href="tel:112">
                <Phone className="size-4" />{" "}
                {t("contractionCounter.counter.emergencyContact")}
              </a>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-primary-light/40">
          <h3 className="font-semibold text-primary-dark">
            {t("contractionCounter.counter.trackingTips")}
          </h3>
          <ul className="mt-2 space-y-2 text-sm text-text-secondary">
            <li>• {t("contractionCounter.counter.tip1")}</li>
            <li>• {t("contractionCounter.counter.tip2")}</li>
            <li>• {t("contractionCounter.counter.tip3")}</li>
          </ul>
        </Card>

        <Button
          variant="ghost"
          onClick={() =>
            endSession.mutate(session._id, {
              onSuccess: () =>
                toast.success(t("contractionCounter.counter.sessionEnded")),
            })
          }
          disabled={endSession.isPending}
          className="w-full justify-center"
        >
          {t("contractionCounter.counter.endSession")}
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
