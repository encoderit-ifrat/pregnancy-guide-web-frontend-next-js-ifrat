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
  TrendingUp,
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
import { useRouter } from "next/navigation";

export default function ContractionStatistics() {
  const { t } = useTranslation();
  const [view, setView] = useState<"frequency" | "duration" | "interval">(
    "frequency"
  );
  const { data: stats, isLoading } = useQueryContractionStatistics(
    "week",
    view
  );
  const router = useRouter();

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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 ">
          <div className="space-y-6 lg:col-span-2 bg-white rounded-2xl border border-[#F3E8FF] px-[9px] py-[25px] md:p-[35px]">
            <div>
              <h2 className="text-xl font-semibold text-primary-dark">
                {t("contractionCounter.stats.title")}
              </h2>
              <p className="text-sm text-text-secondary">
                {t("contractionCounter.stats.subtitle")}
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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
          </div>

          <Card className="px-2 py-[25px] md:p-6 border border-[#F3E8FF] shadow-none bg-white rounded-2xl ">
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
              <TabsList className="max-sm:w-full max-sm:flex-wrap px-2 py-[5px] md:py-[7px] border border-[#F3E8FF] bg-white rounded-[10px] shadow-week-details">
                <TabsTrigger variant={"inv"} value="frequency">
                  {t("contractionCounter.stats.frequencyTrend")}
                </TabsTrigger>
                <TabsTrigger variant={"inv"} value="duration">
                  {t("contractionCounter.stats.durationAnalysis")}
                </TabsTrigger>
                <TabsTrigger variant={"inv"} value="interval">
                  {t("contractionCounter.stats.intervalPattern")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="mb-0! mt-4 text-[30px]! font-semibold! text-primary-dark!">
              {t("contractionCounter.stats.dailyCount")}
            </p>
            <p className="mb-2 mt-0! text-base! font-normal! text-primary-dark!">
              {t("contractionCounter.stats.dailyCountDes")}
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

          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-2xl ">
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
                  className="flex items-start gap-2 rounded-lg bg-[#FCFAFF] px-4 py-3 text-sm"
                >
                  <div className="bg-white rounded-full w-10 h-10 shrink-0 flex items-center justify-center">
                    <Timer className="text-primary size-7" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-lg! font-semibold! text-primary-dark!">
                      {t("contractionCounter.stats.contractionsCount", {
                        count: s.count,
                      })}
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col items-start">
                        <p className="text-lg! font-normal! text-primary-dark!">
                          {t("contractionCounter.stats.avgDuration")}
                        </p>
                        <p className="text-lg! font-semibold! text-primary-dark!">
                          {fmtDuration(s.avg_duration_sec)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-lg! font-normal! text-primary-dark!">
                          {t("contractionCounter.stats.avgInterval")}
                        </p>
                        <p className="text-lg! font-semibold! text-primary-dark!">
                          {fmtDuration(s.avg_interval_sec)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-2xl">
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

          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-2xl">
            <h3 className="font-semibold text-xl! text-primary-dark!">
              📊 {t("contractionCounter.stats.patternAnalysis")}
            </h3>
            <ul className="mt-2 space-y-2 text-base! font-normal! text-primary-dark!">
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
              "p-6 md:p-6 px-2 py-[25px]  shadow-none bg-white rounded-2xl",
              cta.level === "urgent"
                ? "border border-destructive "
                : cta.level === "warning"
                  ? "border "
                  : ""
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

          <div className="space-y-2">
            <Button
              variant="default"
              onClick={() => router.push("/varkraknare")}
              className="w-full justify-center"
            >
              <Timer className="size-4" />{" "}
              {t("contractionCounter.counter.continueTracking")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/varkraknare/historik")}
              className="w-full justify-center"
            >
              <Clock className="size-4" />{" "}
              {t("contractionCounter.counter.viewHistory")}
            </Button>
          </div>
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
    <Card className="p-5 border border-[#F3E8FF] ">
      <div className="flex w-full items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary-light">
          {icon}
        </div>
        <div>
          <p className="text-sm! text-primary-dark!">{label}</p>
          <p className=" text-[30px]! font-bold! text-primary-dark!">{value}</p>
        </div>
      </div>
    </Card>
  );
}
