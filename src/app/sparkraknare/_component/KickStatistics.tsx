"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Clock,
  Clock4,
  Footprints,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQueryKickStatistics } from "../_api/queries/useQueryKickCounter";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";

export default function KickStatistics({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useQueryKickStatistics("week");

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const trend = stats.daily_trend.map((d) => ({
    label: new Date(d.date).toLocaleDateString("sv-SE", { weekday: "short" }),
    count: d.count,
  }));

  const hourly = stats.hourly_pattern
    .filter((_, i) => i % 2 === 0)
    .map((h) => ({ label: `${h.hour}:00`, avg: h.avg }));

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 cursor-pointer my-[35px]"
      >
        <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
        <p className="text-base font-normal"> {t("kickCounter.stats.back")}</p>
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("kickCounter.stats.title")}
            </h2>
            <p className="text-sm text-text-secondary">
              {t("kickCounter.stats.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Activity className="size-5 text-primary" />}
              value={stats.totals.total_this_week}
              label={t("kickCounter.stats.totalThisWeek")}
            />
            <StatCard
              icon={<TrendingUp className="size-5 text-primary" />}
              value={stats.totals.daily_average}
              label={t("kickCounter.stats.dailyAverage")}
            />
            <StatCard
              icon={<Clock4 className="size-5 text-primary" />}
              value={stats.totals.peak_hour}
              label={t("kickCounter.stats.peakHour")}
            />
          </div>

          <Card className="p-6">
            <Tabs defaultValue="daily">
              <TabsList>
                <TabsTrigger value="daily">
                  {t("kickCounter.stats.dailyTrend")}
                </TabsTrigger>
                <TabsTrigger value="hourly">
                  {t("kickCounter.stats.hourlyPattern")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="pt-4">
                <p className="mb-2 text-sm font-medium text-primary-dark">
                  {t("kickCounter.stats.weeklyKickCount")}
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#a97aec"
                      strokeWidth={2}
                      dot={{ fill: "#a97aec" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="hourly" className="pt-4">
                <p className="mb-2 text-sm font-medium text-primary-dark">
                  {t("kickCounter.stats.hourlyActivity")}
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={hourly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#a97aec" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-primary-dark">
              {t("kickCounter.stats.sessionHistory")}
            </h3>
            <div className="space-y-2">
              {stats.session_history.length === 0 && (
                <p className="text-sm text-text-secondary">
                  {t("kickCounter.stats.noSessions")}
                </p>
              )}
              {stats.session_history.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-primary-light/30 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-primary-dark">
                      {t("kickCounter.stats.kicksCount", { count: s.count })}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(s.started_at).toLocaleString("sv-SE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {s.label && (
                    <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium capitalize text-primary">
                      {s.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-primary-dark">
              {t("kickCounter.stats.thisWeek")}
            </h3>
            <div className="mt-4 space-y-4">
              <BreakdownBar
                label={t("kickCounter.stats.softKicks")}
                value={stats.this_week_breakdown.soft}
              />
              <BreakdownBar
                label={t("kickCounter.stats.hardKicks")}
                value={stats.this_week_breakdown.hard}
              />
              <BreakdownBar
                label={t("kickCounter.stats.unsure")}
                value={stats.this_week_breakdown.unsure}
              />
            </div>
          </Card>

          <Card className="p-6 bg-primary-light/40">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              <h3 className="font-semibold text-primary-dark">
                {t("kickCounter.stats.insights")}
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {stats.insights.map((i, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {i}
                </li>
              ))}
            </ul>
          </Card>

          <Button onClick={onStart} className="w-full justify-center">
            {t("kickCounter.stats.startNew")}
          </Button>
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
  value: number | string;
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

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-primary-dark">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
