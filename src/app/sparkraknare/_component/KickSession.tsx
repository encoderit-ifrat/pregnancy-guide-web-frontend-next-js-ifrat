"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Activity, Heart, HelpCircle, Loader2, Square } from "lucide-react";
import { toast } from "sonner";
import {
  ActiveKickSession,
  KickType,
} from "../_types/kick_types";
import {
  useQueryKickTodaySummary,
} from "../_api/queries/useQueryKickCounter";
import { useAddKick, useStopKickSession } from "../_api/mutations/useKickMutations";

const KICK_BUTTONS: {
  type: KickType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: "soft", label: "Soft Kick", icon: <Activity className="size-7" /> },
  { type: "hard", label: "Hard Kick", icon: <Heart className="size-7" /> },
  { type: "unsure", label: "Unsure", icon: <HelpCircle className="size-7" /> },
];

const TYPE_ICON: Record<KickType, React.ReactNode> = {
  soft: <Activity className="size-4 text-primary" />,
  hard: <Heart className="size-4 text-primary" />,
  unsure: <HelpCircle className="size-4 text-primary" />,
};

export default function KickSession({
  session,
  onViewStats,
}: {
  session: ActiveKickSession;
  onViewStats: () => void;
}) {
  const { data: summary } = useQueryKickTodaySummary();
  const addKick = useAddKick();
  const stop = useStopKickSession();

  const handleKick = (type: KickType) => {
    addKick.mutate(
      { sessionId: session._id, type },
      {
        onError: () => toast.error("Could not record the movement"),
      }
    );
  };

  const handleStop = () => {
    stop.mutate(session._id, {
      onSuccess: () => toast.success("Session saved"),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Session Active
            </span>
            <h2 className="mt-3 text-xl font-semibold text-primary-dark">
              Tracking Baby&apos;s Kicks
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Record each movement you feel
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {KICK_BUTTONS.map((b) => (
              <button
                key={b.type}
                onClick={() => handleKick(b.type)}
                disabled={addKick.isPending}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border-2 border-transparent bg-primary-light/50 py-6 transition-all",
                  "hover:border-primary hover:bg-primary-light disabled:opacity-60"
                )}
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-primary text-white">
                  {b.icon}
                </span>
                <span className="font-medium text-primary-dark">{b.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-primary-dark">Latest kicks</h3>
              <span className="text-sm text-text-secondary">
                {session.total_kicks} total
              </span>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {session.kicks.length === 0 && (
                <p className="py-8 text-center text-sm text-text-secondary">
                  No movements recorded yet. Tap a button above when you feel a
                  kick.
                </p>
              )}
              {session.kicks.map((k) => (
                <div
                  key={k._id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 odd:bg-primary-light/30"
                >
                  <span className="flex items-center gap-2 text-sm capitalize text-primary-dark">
                    {TYPE_ICON[k.type]}
                    {k.type} Kick
                  </span>
                  <span className="text-sm text-text-secondary">
                    {new Date(k.occurred_at).toLocaleString("sv-SE", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
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
            Stop &amp; Save Session
          </Button>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-primary-dark">Today&apos;s Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Total Kicks" value={summary?.total_kicks ?? 0} />
            <Row label="Sessions" value={summary?.sessions ?? 0} />
            <Row label="Avg per Hour" value={summary?.avg_per_hour ?? 0} />
          </div>
          <Button
            variant="ghost"
            onClick={onViewStats}
            className="mt-5 w-full justify-center"
          >
            View Full Stats
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
