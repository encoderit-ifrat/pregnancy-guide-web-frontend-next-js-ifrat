"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowLeft,
  Clock,
  Hourglass,
  Phone,
  Timer,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQueryContractionStatistics } from "../_api/queries/useQueryContraction";
import { fmtDuration } from "../_lib/format";
import { LaborProgress } from "../_types/contraction_types";

export default function ContractionStatistics({
  onBack,
}: {
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [view, setView] = useState<"frequency" | "duration" | "interval">(
    "frequency"
  );
  const { data: stats, isLoading } = useQueryContractionStatistics("week", view);

  const progressSteps: { key: LaborProgress; label: string }[] = [
    { key: "early", label: t("contractionCounter.stats.earlyLabor") },
    { key: "active", label: t("contractionCounter.stats.activeLabor") },
    { key: "transition", label: t("contractionCounter.stats.transition") },
  ];

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const daily = stats.daily_counts.map((d) => ({
    label: new Date(d.date).toLocaleDateString("sv-SE", { weekday: "short" }),
    count: d.count,
  }));

  const cta = stats.call_to_action;
  const currentStep = progressSteps.findIndex(
    (s) => s.key === stats.labor_progress
  );

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> {t("contractionCounter.stats.back")}
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("contractionCounter.stats.title")}
            </h2>
            <p className="text-sm text-text-secondary">
              {t("contractionCounter.stats.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Timer className="size-5 text-primary" />}
              value={String(stats.totals.total_this_week)}
              label={t("contractionCounter.stats.totalThisWeek")}
            />
            <StatCard
              icon={<Hourglass className="size-5 text-primary" />}
              value={fmtDuration(stats.totals.avg_duration_sec)}
              label={t("contractionCounter.stats.avgDuration")}
            />
            <StatCard
              icon={<Clock className="size-5 text-primary" />}
              value={fmtDuration(stats.totals.avg_interval_sec)}
              label={t("contractionCounter.stats.avgInterval")}
            />
          </div>

          <Card className="p-6">
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
              <TabsList>
                <TabsTrigger value="frequency">
                  {t("contractionCounter.stats.frequencyTrend")}
                </TabsTrigger>
                <TabsTrigger value="duration">
                  {t("contractionCounter.stats.durationAnalysis")}
                </TabsTrigger>
                <TabsTrigger value="interval">
                  {t("contractionCounter.stats.intervalPattern")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="mb-2 mt-4 text-sm font-medium text-primary-dark">
              {t("contractionCounter.stats.dailyCount")}
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#a97aec" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-primary-dark">
              {t("contractionCounter.stats.recentSessions")}
            </h3>
            <div className="space-y-2">
              {stats.recent_sessions.length === 0 && (
                <p className="text-sm text-text-secondary">
                  {t("contractionCounter.stats.noSessions")}
                </p>
              )}
              {stats.recent_sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-primary-light/30 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-primary-dark">
                    {t("contractionCounter.stats.contractionsCount", {
                      count: s.count,
                    })}
                  </span>
                  <span className="text-text-secondary">
                    {t("contractionCounter.stats.avgApart", {
                      duration: fmtDuration(s.avg_duration_sec),
                      interval: fmtDuration(s.avg_interval_sec),
                    })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-primary-dark">
              {t("contractionCounter.stats.laborProgress")}
            </h3>
            <div className="space-y-3">
              {progressSteps.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                      idx <= currentStep
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary"
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      idx === currentStep
                        ? "font-semibold text-primary-dark"
                        : "text-text-secondary"
                    )}
                  >
                    {step.label}
                    {idx === currentStep &&
                      ` ${t("contractionCounter.stats.current")}`}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-primary-dark">
              {t("contractionCounter.stats.patternAnalysis")}
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-text-secondary">
              {stats.pattern_analysis.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </Card>

          <Card
            className={cn(
              "p-6",
              cta.level === "urgent"
                ? "border-destructive bg-destructive/5"
                : cta.level === "warning"
                  ? "border-primary bg-primary-light/40"
                  : "bg-primary-light/30"
            )}
          >
            <div className="flex items-center gap-2">
              <TriangleAlert
                className={cn(
                  "size-5",
                  cta.level === "urgent" ? "text-destructive" : "text-primary"
                )}
              />
              <h3 className="font-semibold text-primary-dark">
                {t("contractionCounter.stats.timeToGo")}
              </h3>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{cta.message}</p>
            {cta.show_call_hospital && (
              <Button
                asChild
                className="mt-4 w-full justify-center bg-destructive hover:bg-destructive/90"
              >
                <a href="tel:112">
                  <Phone className="size-4" />{" "}
                  {t("contractionCounter.stats.callHospital")}
                </a>
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary-light">
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-primary-dark">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}
