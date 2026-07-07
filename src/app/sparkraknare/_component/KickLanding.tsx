"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Activity,
  BarChart3,
  Clock,
  Clock4,
  Footprints,
  Lightbulb,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useQueryKickStatistics } from "../_api/queries/useQueryKickCounter";
import { formatDate } from "date-fns";
import { sv } from "date-fns/locale";

interface Props {
  onStart: () => void;
  starting: boolean;
  onViewStats: () => void;
}

export default function KickLanding({ onStart, starting, onViewStats }: Props) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const { data: stats } = useQueryKickStatistics("week");

  const week = user?.details?.current_pregnancy_data?.running_week;
  const dueDate = user?.details?.due_date
    ? formatDate(user.details.due_date, "MMMM dd, yyyy", { locale: sv })
    : "—";

  const breakdown = stats?.this_week_breakdown;
  const pct = (v?: number) => `${Math.round((v ?? 0) * 100)}%`;

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6 bg-white h-fit border border-[#F3E8FF] rounded-2xl px-[9px] py-[11px]">
        <Card className="relative flex flex-col md:flex-row min-h-[280px] lg:min-h-[397px] rounded-[12px] overflow-hidden p-0">
          <Image
            src="/kick_counter_bg.png"
            alt=""
            width={700}
            height={700}
            priority
            className="h-[328px] md:h-[397px] md:w-full object-cover object-left order-2 md:order-1"
          />
          <div className="relative md:w-1/2 md:h-full md:absolute md:right-0 md:top-0 z-10 order-1 md:order-2 bg-[#F3E7F9] md:bg-transparent flex min-h-[280px] items-center justify-end p-5 sm:p-6">
            <div className="w-full text-center lg:text-left">
              <span className="bg-white text-primary px-2.5 py-1 rounded-full text-base! font-semibold!">
                {week ? t("kickCounter.landing.week", { week }) : "—"}
              </span>
              <h2 className="text-[25px]! font-semibold text-primary-dark font-poppins! mt-6">
                {t("kickCounter.landing.ready")}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-base! font-poppins! text-text-secondary">
                {t("kickCounter.landing.readyDesc")}
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
                <span>{t("kickCounter.landing.start")}</span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <FeatureCard
            icon={<Activity className="size-5 text-primary" />}
            title={t("kickCounter.landing.trackKicks")}
            desc={t("kickCounter.landing.trackKicksDesc")}
          />
          <FeatureCard
            icon={<Clock4 className="size-5 text-primary" />}
            title={t("kickCounter.landing.monitorTime")}
            desc={t("kickCounter.landing.monitorTimeDesc")}
          />
          <FeatureCard
            icon={<TrendingUp className="size-5 text-primary" />}
            title={t("kickCounter.landing.viewStats")}
            desc={t("kickCounter.landing.viewStatsDesc")}
            onClick={onViewStats}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-white border border-[#EEE4F9] shadow-none">
          <h3 className="font-semibold text-primary-dark">
            {t("kickCounter.landing.pregnancyInfo")}
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <Row
              label={t("kickCounter.landing.currentWeek")}
              value={week ? t("kickCounter.landing.week", { week }) : "—"}
            />
            <Row label={t("kickCounter.landing.dueDate")} value={dueDate} />
          </div>
          <div className="mt-5 border-t pt-4">
            <p className="mb-3 text-sm font-medium text-primary-dark">
              {t("kickCounter.landing.thisWeek")}
            </p>
            <div className="space-y-2">
              <Row
                label={t("kickCounter.landing.softKicks")}
                value={pct(breakdown?.soft)}
              />
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct(breakdown?.soft)}` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Row
                label={t("kickCounter.landing.hardKicks")}
                value={pct(breakdown?.hard)}
              />
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#FCE7F3]">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct(breakdown?.hard)}` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Row
                label={t("kickCounter.landing.unsure")}
                value={pct(breakdown?.unsure)}
              />
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                <div
                  className="h-full rounded-full bg-[#99A1AF]"
                  style={{ width: `${pct(breakdown?.unsure)}` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative min-h-[256px] md:min-h-[350px] lg:min-h-[256px] overflow-hidden p-0 shadow-none">
          <Image
            src="/kick_counter_tips_tracking_bg.png"
            alt=""
            fill
            className="object-cover object-bottom-right"
          />
          <div className="relative z-10 max-w-[70%] p-6 pb-20">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              <h3 className="font-semibold text-primary-dark">
                {t("kickCounter.landing.trackingTip")}
              </h3>
            </div>
            <p className="mt-2 text-sm text-text-secondary text-left">
              {t("kickCounter.landing.trackingTipText")}
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
        "bg-primary-light3 rounded-[10px] flex h-full flex-col items-center gap-2 p-5 text-center",
        onClick && "cursor-pointer transition-colors hover:border-primary"
      )}
    >
      <div className="flex size-[50px] items-center justify-center rounded-full bg-white">
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
