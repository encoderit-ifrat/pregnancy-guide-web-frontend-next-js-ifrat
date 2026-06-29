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
import {
  useQueryContractionSettings,
  useQueryContractionStatistics,
} from "../_api/queries/useQueryContraction";
import { fmtDuration } from "../_lib/format";
import { LaborProgress } from "../_types/contraction_types";
import { useRouter } from "next/navigation";

export default function ContractionStatistics() {
  const { t } = useTranslation();
  const { data: settings } = useQueryContractionSettings();
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
              <h2 className="text-xl! font-semibold! text-primary-dark!">
                {t("contractionCounter.stats.title")}
              </h2>
              <p className="text-base! font-normal! text-primary-dark!">
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

          <Card className="px-2 py-[25px] md:p-3 lg:p-6 border border-[#F3E8FF] shadow-none bg-white rounded-2xl overflow-hidden">
            <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
              <TabsList className="max-xl:w-full max-[450px]:max-w-[330px] max-xl:flex max-xl:overflow-x-auto max-xl:flex-nowrap max-xl:justify-start max-xl:[&::-webkit-scrollbar]:hidden max-xl:[scrollbar-width:none] px-2 py-[5px] md:py-[7px] border border-[#F3E8FF] bg-white rounded-[10px] shadow-week-details">
                <TabsTrigger
                  variant={"inv"}
                  value="frequency"
                  className="shrink-0"
                >
                  {t("contractionCounter.stats.frequencyTrend")}
                </TabsTrigger>
                <TabsTrigger
                  variant={"inv"}
                  value="duration"
                  className="shrink-0"
                >
                  {t("contractionCounter.stats.durationAnalysis")}
                </TabsTrigger>
                <TabsTrigger
                  variant={"inv"}
                  value="interval"
                  className="shrink-0"
                >
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
              {stats.labor_progress == "early" ? (
                <div className="space-y-2">
                  <Row
                    label={t("contractionCounter.stats.earlyLabor")}
                    value={"Past"}
                  />

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full bg-[#B9F8CF]"
                      style={{ width: `${100}` }}
                    />
                  </div>
                </div>
              ) : stats.labor_progress == "active" ? (
                <div className="space-y-2">
                  <Row
                    label={t("contractionCounter.stats.activeLabor")}
                    value={"Current"}
                  />

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full bg-[#FFD6A8]"
                      style={{ width: `${100}` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Row
                    label={t("contractionCounter.stats.transition")}
                    value={"Upcoming"}
                  />

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full bg-[#99A1AF]"
                      style={{ width: `${100}` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-2xl">
            <h3 className="font-semibold text-xl! text-primary-dark!">
              📊 {t("contractionCounter.stats.patternAnalysis")}
            </h3>
            <div
              className="mt-2 space-y-2 text-base! text-primary-dark!"
              dangerouslySetInnerHTML={{
                __html: settings?.contractionCounter?.trackingTips,
              }}
            />
          </Card>

          <Card
            className={cn(
              "p-6 md:p-6 px-2 py-[25px]  shadow-none bg-white rounded-2xl border border-[#F3E8FF]"
            )}
          >
            <div className="flex items-center gap-2">
              <TriangleAlert className={cn("size-5", "text-destructive")} />
              <h3 className="font-semibold text-primary-dark">
                {t("contractionCounter.stats.timeToGo")}
              </h3>
            </div>
            <p
              className="mt-2 text-sm text-primary-dark!"
              dangerouslySetInnerHTML={{
                __html: settings?.contractionCounter?.timeToGoDescription || "",
              }}
            ></p>
            {settings?.contractionCounter?.hospitalContactNumber && (
              <Button
                asChild
                className="mt-4 w-full justify-center bg-destructive hover:bg-destructive/90"
              >
                <a
                  href={`tel:${settings?.contractionCounter?.hospitalContactNumber}`}
                >
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
    <Card className="p-5 border-0 shadow-week-details">
      <div className="flex flex-row md:flex-col w-full items-center md:items-start gap-2">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-primary-dark">{value}</span>
    </div>
  );
}
