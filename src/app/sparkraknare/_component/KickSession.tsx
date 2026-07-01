"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Activity, Feather, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ActiveKickSession, KickType } from "../_types/kick_types";
import { useQueryKickTodaySummary } from "../_api/queries/useQueryKickCounter";
import {
  useAddKick,
  useStopKickSession,
} from "../_api/mutations/useKickMutations";
import Image from "next/image";
import { formatDate } from "date-fns";

const TYPE_ICON: Record<KickType, React.ReactNode> = {
  soft: <Feather className="size-4 text-primary" />,
  hard: <Activity className="size-4 text-primary" />,
  unsure: <Heart className="size-4 text-[#4A5565]" />,
};

const TYPE_KEY: Record<KickType, string> = {
  soft: "kickCounter.session.softKick",
  hard: "kickCounter.session.hardKick",
  unsure: "kickCounter.session.unsureKick",
};

export default function KickSession({
  session,
  onStop,
  onViewStats,
  onFirstKick,
}: {
  session: ActiveKickSession | null;
  onStop?: () => void;
  onViewStats: () => void;
  onFirstKick?: (type: KickType) => void;
}) {
  const { t } = useTranslation();
  const { data: summary } = useQueryKickTodaySummary();
  const addKick = useAddKick();
  const stop = useStopKickSession();
  const [pendingType, setPendingType] = useState<KickType | null>(null);

  const buttons: { type: KickType; image: string }[] = [
    { type: "soft", image: "/images/icons/soft-kick.png" },
    { type: "hard", image: "/images/icons/hard-kick.png" },
    { type: "unsure", image: "/images/icons/unsure-kick.png" },
  ];

  const handleKick = (type: KickType) => {
    if (!session) {
      setPendingType(type);
      onFirstKick?.(type);
      return;
    }
    addKick.mutate(
      { sessionId: session._id, type },
      { onError: () => toast.error(t("kickCounter.session.recordError")) }
    );
  };

  const handleStop = () => {
    if (!session?._id || session?.kicks.length === 0) return;
    stop.mutate(session._id, {
      onSuccess: () => {
        toast.success(t("kickCounter.session.saved"));
        onStop?.();
      },
    });
  };

  useEffect(() => {
    if (pendingType && session?._id) {
      addKick.mutate(
        { sessionId: session._id, type: pendingType },
        { onError: () => toast.error(t("kickCounter.session.recordError")) }
      );
      setPendingType(null);
    }
  }, [session?._id, pendingType]);

  const handleViewStatsClick = () => {
    if (!session?._id || session?.kicks.length === 0) return;
    stop.mutate(session._id, {
      onSuccess: () => {
        onViewStats();
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-8 border border-primary-light3">
          <div className="text-start">
            {/* <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              {t("kickCounter.session.active")}
            </span> */}
            <h2 className="mt-3 text-[25px] md:text-[30px] font-semibold text-primary-dark">
              {t("kickCounter.session.title")}
            </h2>
            <p className="mt-1 text-sm! font-normal! text-text-secondary">
              {t("kickCounter.session.desc")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {buttons.map((b) => (
              <button
                key={b.type}
                onClick={() => handleKick(b.type)}
                disabled={addKick.isPending || !!pendingType}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border-2 border-transparent  py-6 transition-all",
                  "hover:border-primary hover:bg-primary-light disabled:opacity-60 cursor-pointer"
                )}
              >
                <Image
                  src={b.image}
                  alt={b.type}
                  width={500}
                  height={500}
                  className="size-[70px] md:size-[150px] object-contain"
                />
                <span className="font-medium text-primary-dark">
                  {t(TYPE_KEY[b.type])}
                </span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-8 border border-primary-light3">
          <div className="">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[25px]! font-semibold! text-primary-dark!">
                {t("kickCounter.session.latestKicks")}
              </h3>
              <Button
                variant="outline"
                onClick={handleViewStatsClick}
                disabled={stop.isPending || (session?.kicks.length ?? 0) === 0}
                className="w-fit justify-center bg-[#F6F0FB]! border border-primary! text-lg! text-primary!"
              >
                {stop.isPending && <Loader2 className="size-4 animate-spin" />}
                {t("kickCounter.session.viewAll")}
              </Button>
              {/* <span className="text-sm text-text-secondary">
                {t("kickCounter.session.total", { count: session.total_kicks })}
              </span> */}
            </div>
            <div className="max-h-80 space-y-2.5 overflow-y-auto">
              {(session === null || session?.kicks.length === 0) && (
                <p className="py-8 text-center text-sm text-text-secondary">
                  {t("kickCounter.session.empty")}
                </p>
              )}
              {session?.kicks.map((k) => (
                <div
                  key={k._id}
                  className="flex items-center justify-between rounded-[15px] px-3 py-2 bg-[#FCFAFF]"
                >
                  <span className="flex items-center gap-2 text-lg! font-semibold! text-primary-dark">
                    {TYPE_ICON[k.type]}
                    {t(TYPE_KEY[k.type])}
                  </span>
                  <p className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-primary-dark">
                      {formatDate(k.occurred_at, "MMMM dd, yyyy")}
                    </span>
                    <span className="text-sm font-normal! text-primary-dark">
                      {formatDate(k.occurred_at, "p")}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* <Button
            variant="outline"
            onClick={handleStop}
            disabled={stop.isPending}
            className="mt-6 w-full justify-center"
          >
            {stop.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Square className="size-4" />
            )}
            <span>{t("kickCounter.session.stopSave")}</span>
          </Button> */}
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-primary-dark">
            {t("kickCounter.session.todaySummary")}
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <Row
              label={t("kickCounter.session.totalKicks")}
              value={summary?.total_kicks ?? 0}
            />
            <Row
              label={t("kickCounter.session.sessions")}
              value={summary?.sessions ?? 0}
            />
            <Row
              label={t("kickCounter.session.avgPerHour")}
              value={summary?.avg_per_hour ?? 0}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleViewStatsClick}
            disabled={stop.isPending || (session?.kicks.length ?? 0) === 0}
            className="mt-5 w-full justify-center bg-[#F6F0FB]! border border-primary! text-lg! text-primary!"
          >
            {stop.isPending && <Loader2 className="size-4 animate-spin" />}
            {t("kickCounter.session.viewFullStats")}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-lg font-semibold text-primary-dark">{value}</span>
    </div>
  );
}
