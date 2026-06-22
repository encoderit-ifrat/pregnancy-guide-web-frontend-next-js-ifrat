"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Activity,
  BarChart3,
  Clock,
  Footprints,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useQueryKickStatistics } from "../_api/queries/useQueryKickCounter";

interface Props {
  onStart: () => void;
  starting: boolean;
  onViewStats: () => void;
}

export default function KickLanding({ onStart, starting, onViewStats }: Props) {
  const { user } = useCurrentUser();
  const { data: stats } = useQueryKickStatistics("week");

  const week = user?.details?.current_pregnancy_data?.week;
  const dueDate = user?.details?.due_date
    ? new Date(user.details.due_date).toLocaleDateString("sv-SE")
    : "—";

  const breakdown = stats?.this_week_breakdown;
  const pct = (v?: number) => `${Math.round((v ?? 0) * 100)}%`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="relative min-h-[280px] overflow-hidden p-0">
          <Image
            src="/kick_counter_bg.png"
            alt=""
            fill
            priority
            className="object-cover object-left"
          />
          <div className="relative z-10 flex min-h-[280px] items-center justify-end p-5 sm:p-6">
            <div className="w-full max-w-md p-6 text-center sm:p-8">
              <h2 className="text-xl font-semibold text-primary-dark">
                Ready to Start Tracking
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Find a comfortable position and start a new kick-counting
                session. We&apos;ll help you track every movement.
              </p>
              <Button
                onClick={onStart}
                disabled={starting}
                size="lg"
                className="mt-6"
              >
                {starting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Activity className="size-5" />
                )}
                Start Kick Count
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Footprints className="size-5 text-primary" />}
            title="Track Kicks"
            desc="Record every movement"
          />
          <FeatureCard
            icon={<Clock className="size-5 text-primary" />}
            title="Monitor Time"
            desc="See patterns over time"
          />
          <FeatureCard
            icon={<BarChart3 className="size-5 text-primary" />}
            title="View Stats"
            desc="Track your progress"
            onClick={onViewStats}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-primary-dark">Pregnancy Info</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Current Week" value={week ? `Week ${week}` : "—"} />
            <Row label="Due Date" value={dueDate} />
          </div>
          <div className="mt-5 border-t pt-4">
            <p className="mb-3 text-sm font-medium text-primary-dark">
              This Week
            </p>
            <Row label="Soft Kicks" value={pct(breakdown?.soft)} />
            <Row label="Hard Kicks" value={pct(breakdown?.hard)} />
            <Row label="Unsure" value={pct(breakdown?.unsure)} />
          </div>
        </Card>

        <Card className="relative min-h-[190px] overflow-hidden p-0">
          <Image
            src="/kick_counter_tips_tracking_bg.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="relative z-10 max-w-[64%] p-6 pb-20">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              <h3 className="font-semibold text-primary-dark">Tracking Tip</h3>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              The best time to count kicks is after meals or when lying on your
              side. Aim to feel at least 10 movements within 2 hours.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "flex h-full flex-col items-center gap-2 p-5 text-center",
        onClick && "cursor-pointer transition-colors hover:border-primary"
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-primary-light">
        {icon}
      </div>
      <p className="font-medium text-primary-dark">{title}</p>
      <p className="text-xs text-text-secondary">{desc}</p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-primary-dark">{value}</span>
    </div>
  );
}
