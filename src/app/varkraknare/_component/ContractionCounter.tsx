"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BarChart3,
  Clock,
  History,
  Loader2,
  Phone,
  Play,
  Square,
  Timer,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { ActiveContractionSession } from "../_types/contraction_types";
import {
  useQueryContractionSettings,
  useQueryContractionSummary,
} from "../_api/queries/useQueryContraction";
import {
  useEndContractionSession,
  useStartContraction,
  useStartContractionSession,
  useStopContraction,
} from "../_api/mutations/useContractionMutations";
import { fmtDuration, fmtClock } from "../_lib/format";
import { cn } from "@/lib/utils";
import { getServerTimeOffset } from "@/lib/axios";
import { formatDate } from "date-fns";

interface Props {
  session: ActiveContractionSession | null;
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
  const { data: settings } = useQueryContractionSettings();
  const startContraction = useStartContraction();
  const stopContraction = useStopContraction();
  const startSession = useStartContractionSession();
  const endSession = useEndContractionSession();

  const running = useMemo(
    () => session?.contractions.find((c) => !c.end_time) ?? null,
    [session?.contractions]
  );

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) {
      setElapsed(0);
      return;
    }
    const startedAt = new Date(running.start_time).getTime();
    const serverTimeOffset = getServerTimeOffset();
    const initial = Math.max(
      0,
      Math.floor((Date.now() + serverTimeOffset - startedAt) / 1000)
    );
    setElapsed(initial);

    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleViewStats = () => {
    if (running) {
      stopContraction.mutate(
        { sessionId: session!._id, contractionId: running._id },
        {
          onSuccess: () => onViewStats(),
          onError: () => toast.error(t("contractionCounter.counter.stopError")),
        }
      );
    } else {
      onViewStats();
    }
  };

  const handleViewHistory = () => {
    if (running) {
      stopContraction.mutate(
        { sessionId: session!._id, contractionId: running._id },
        {
          onSuccess: () => onViewHistory(),
          onError: () => toast.error(t("contractionCounter.counter.stopError")),
        }
      );
    } else {
      onViewHistory();
    }
  };

  const handleToggle = () => {
    if (running) {
      stopContraction.mutate(
        { sessionId: session!._id, contractionId: running._id },
        {
          onError: () => toast.error(t("contractionCounter.counter.stopError")),
        }
      );
    } else if (session) {
      startContraction.mutate(session._id, {
        onError: () => toast.error(t("contractionCounter.counter.startError")),
      });
    } else {
      startSession.mutate(undefined, {
        onSuccess: (res) => {
          const newSession = res as { _id: string };
          startContraction.mutate(newSession._id, {
            onError: () =>
              toast.error(t("contractionCounter.counter.startError")),
          });
        },
        onError: () => toast.error(t("contractionCounter.counter.startError")),
      });
    }
  };

  const completed = (session?.contractions ?? [])
    .filter((c) => c.end_time)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

  const busy =
    startContraction.isPending ||
    stopContraction.isPending ||
    startSession.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="px-[9px] py-[25px] md:p-8 text-center shadow-none border border-[#EEE4F9]">
          <p className="mt-1 text-sm! text-primary-dark!">
            {t("contractionCounter.counter.readyNext")}
          </p>

          <div className="my-8">
            {running ? (
              <p className="font-poppins text-[50px]! font-bold! text-primary!">
                {fmtClock(elapsed)}
              </p>
            ) : busy && !running ? (
              <div className="flex justify-center items-center h-[75px]">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <span className="size-[88px] inline-flex items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary">
                <Clock className="size-8" />{" "}
              </span>
            )}
          </div>

          <Button
            onClick={handleToggle}
            disabled={busy}
            size="lg"
            variant={"default"}
            className="min-w-52 justify-center"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : running ? (
              <Square className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
            <span>
              {running
                ? t("contractionCounter.counter.stop")
                : t("contractionCounter.counter.start")}
            </span>
          </Button>

          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-y-[#EEE4F9] py-3">
            <Stat
              label={t("contractionCounter.counter.totalCount")}
              value={String(session?.total_count ?? 0)}
              className="border-r border-r-[#EEE4F9]"
            />
            <Stat
              label={t("contractionCounter.counter.avgInterval")}
              className="border-r border-r-[#EEE4F9]"
              value={fmtDuration(
                summary?.avg_interval_sec ?? session?.avg_interval_sec ?? 0
              )}
            />
            <Stat
              label={t("contractionCounter.counter.avgDuration")}
              value={fmtDuration(
                summary?.avg_duration_sec ?? session?.avg_duration_sec ?? 0
              )}
            />
          </div>
        </Card>

        <Card className="px-3 py-6 md:p-6 shadow-none border border-[#EEE4F9]">
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
                className="flex items-center justify-between rounded-lg bg-[#FCFAFF] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-primary">
                    <Timer size={18} />
                  </span>
                  <div>
                    <p className="text-lg! font-semibold! text-primary-dark!">
                      Contraction #{completed.length - idx}
                    </p>
                    <p className="text-base! font-normal! text-primary-dark!">
                      {formatDate(c.start_time, "pp")}
                    </p>
                  </div>
                </div>
                <span className="text-base! font-medium! text-primary-dark!">
                  {fmtDuration(c.duration_sec ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <Card className="p-6 bg-white border border-[#EEE4F9] shadow-none">
          <h3 className="mb-3 text-[25px]! font-semibold text-primary-dark">
            {t("contractionCounter.counter.quickActions")}
          </h3>
          <div className="space-y-2">
            <Button
              variant="default"
              onClick={handleViewStats}
              className="w-full justify-center"
            >
              <TrendingUp className="size-4" />{" "}
              {t("contractionCounter.counter.viewStatistics")}
            </Button>
            <Button
              variant="outline"
              onClick={handleViewHistory}
              className="w-full justify-center"
            >
              <Clock className="size-4" />{" "}
              {t("contractionCounter.counter.viewHistory")}
            </Button>
            {session && (
              <Button
                variant="ghost"
                onClick={() =>
                  endSession.mutate(session._id, {
                    onSuccess: () =>
                      toast.success(
                        t("contractionCounter.counter.sessionEnded")
                      ),
                  })
                }
                disabled={endSession.isPending}
                className="w-full justify-center"
              >
                {t("contractionCounter.counter.endSession")}
              </Button>
            )}
            {/* <Button
              variant="outline"
              asChild
              className="w-full justify-center border-destructive text-destructive"
            >
              <a href="tel:112">
                <Phone className="size-4" />{" "}
                {t("contractionCounter.counter.emergencyContact")}
              </a>
            </Button> */}
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#EEE4F9] shadow-none">
          <h3 className="font-semibold text-[25px]! text-[#E7000B]! flex items-center gap-2.5 mb-5!">
            <Phone /> {t("contractionCounter.counter.trackingTips")}
          </h3>
          <div
            className="mt-2 space-y-2 text-base! text-primary-dark!"
            dangerouslySetInnerHTML={{
              __html: settings?.contractionCounter?.whenToCallDescription,
            }}
          />

          <Button
            variant="default"
            className="w-full bg-[#E7000B]! text-white! justify-center mt-4"
          >
            <a
              href={`tel:${settings?.emergencyContactNumber}`}
              className="flex items-center gap-2"
            >
              <Phone className="size-4" />{" "}
              {t("contractionCounter.counter.emergencyContact")}
            </a>
          </Button>
        </Card>

        <Card className="p-6 bg-white border border-[#EEE4F9] shadow-none">
          <h3 className="font-semibold text-[25px]! text-primary-dark! mb-5!">
            💡 {t("contractionCounter.counter.trackingTips")}
          </h3>
          <div
            className="mt-2 space-y-2 text-base! text-primary-dark!"
            dangerouslySetInnerHTML={{
              __html: settings?.contractionCounter?.trackingTips,
            }}
          />
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("", className)}>
      <p className="text-xl font-bold text-primary-dark">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
