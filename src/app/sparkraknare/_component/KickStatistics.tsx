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
import { useQueryContractionSettings } from "@/app/varkraknare/_api/queries/useQueryContraction";
import { formatDate } from "date-fns";
import Pagination from "@/components/base/Pagination";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sv } from "date-fns/locale";

export default function KickStatistics({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: stats, isLoading } = useQueryKickStatistics("week", page);
  const { data: settings } = useQueryContractionSettings();

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
          <div className="space-y-6 lg:col-span-2 bg-white rounded-2xl border border-[#F3E8FF] px-[9px] py-[25px] md:p-[35px]">
            <div>
              <h2 className="text-xl! md:text-[30px]! font-semibold! text-primary-dark!">
                {t("kickCounter.stats.title")}
              </h2>
              <p className="text-base! font-normal! text-primary-dark!">
                {t("kickCounter.stats.subtitle")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Activity className="size-5 text-primary" />}
                value={stats.totals.total_this_week}
                label={t("kickCounter.stats.totalThisWeek")}
                changes={`${stats?.totals.percentage_change > 0 ? "↑ " : "↓ "}${stats?.totals.percentage_change}% ${t("kickCounter.stats.fromLastWeek")}`}
                color={
                  stats?.totals.percentage_change > 0 ? "success" : "error"
                }
              />
              <StatCard
                icon={<TrendingUp className="size-5 text-primary" />}
                value={stats.totals.daily_average}
                label={t("kickCounter.stats.dailyAverage")}
                changes={t("kickCounter.stats.kicksPerDay")}
              />
              <StatCard
                icon={<Clock4 className="size-5 text-primary" />}
                value={stats.totals.peak_hour}
                label={t("kickCounter.stats.peakHour")}
                changes={` ${t("kickCounter.stats.mostActiveTime")} `}
              />
            </div>
          </div>

          <Card className="px-2 py-[25px] md:p-6 border border-[#F3E8FF] shadow-none bg-white rounded-2xl ">
            <Tabs defaultValue="daily">
              <TabsList className="max-sm:w-full max-sm:flex-wrap px-2 py-[5px] md:py-[7px] border border-[#F3E8FF] bg-white rounded-[10px] shadow-week-details">
                <TabsTrigger variant={"inv"} value="daily">
                  {t("kickCounter.stats.dailyTrend")}
                </TabsTrigger>
                <TabsTrigger variant={"inv"} value="hourly">
                  {t("kickCounter.stats.hourlyPattern")}
                </TabsTrigger>
              </TabsList>
              <p className="mb-0! mt-4 text-[30px]! font-semibold! text-primary-dark!">
                {t("kickCounter.stats.weeklyKickCount")}
              </p>
              <p className="mb-2 mt-0! text-base! font-normal! text-primary-dark!">
                {t("kickCounter.stats.weeklyKickCountDes")}
              </p>
              <TabsContent value="daily" className="pt-4">
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

          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-2xl ">
            <h3 className="mb-4 text-xl! md:text-[25px]! font-semibold! text-primary-dark">
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
                  <div className="flex items-center gap-2">
                    <div className="bg-white rounded-full w-10 h-10 shrink-0 flex items-center justify-center">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <mask
                          id="mask0_4272_8430"
                          style={{ maskType: "alpha" as any }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="25"
                          height="25"
                        >
                          <path
                            d="M0 0H25V25H0V0Z"
                            fill="url(#pattern0_4272_8430)"
                          />
                        </mask>
                        <g mask="url(#mask0_4272_8430)">
                          <rect width="25" height="25" fill="#A97AEC" />
                        </g>
                        <defs>
                          <pattern
                            id="pattern0_4272_8430"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1"
                          >
                            <use
                              href="#image0_4272_8430"
                              transform="scale(0.00195312)"
                            />
                          </pattern>
                          <image
                            id="image0_4272_8430"
                            width="512"
                            height="512"
                            preserveAspectRatio="none"
                            href="data:image/png;base64,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"
                          />
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold! text-xl! text-primary-dark!">
                        {t("kickCounter.stats.kicksCount", { count: s.count })}
                      </p>
                      <p className="text-base! font-normal! text-primary-dark!">
                        {formatDate(s.started_at, "MMMM d, yyyy", {
                          locale: sv,
                        })}{" "}
                        at {formatDate(s.started_at, "HH:mm")}
                      </p>
                    </div>
                  </div>

                  <span className=" px-3 py-1 text-xl! font-semibold! capitalize text-primary-dark!">
                    {s.label === "soft"
                      ? t("kickCounter.stats.soft")
                      : s.label === "hard"
                        ? t("kickCounter.stats.hard")
                        : s.label === "mixed"
                          ? t("kickCounter.stats.mixed")
                          : t("kickCounter.stats.unknown")}
                  </span>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={stats.session_history_pagination.current_page}
              totalPages={stats.session_history_pagination.last_page}
              onPageChange={setPage}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold! text-xl! text-primary-dark!">
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

          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-[10px]">
            <div className="flex items-center gap-2">
              📊
              <h3 className="text-[25px]! font-semibold! text-primary-dark!">
                {t("kickCounter.stats.insights")}
              </h3>
            </div>
            <div
              className="mt-3 space-y-2 text-sm text-text-secondary"
              dangerouslySetInnerHTML={{
                __html: settings?.kickCounter?.trackingTips,
              }}
            />
          </Card>
          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-[10px]">
            <div className="flex items-center gap-2">
              💡
              <h3 className="text-[25px]! font-semibold! text-primary-dark!">
                {t("kickCounter.stats.whenToCall")}
              </h3>
            </div>
            <div
              className="mt-3 space-y-2 text-sm text-text-secondary"
              dangerouslySetInnerHTML={{
                __html: settings?.kickCounter?.whenToCallDescription,
              }}
            />
          </Card>

          <div className="space-y-2">
            <Button onClick={onStart} className="w-full justify-center">
              {t("kickCounter.stats.startNew")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/sparkraknare/historik")}
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
  changes,
  color = "default",
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  changes?: string;
  color?: "default" | "success" | "error";
}) {
  return (
    <Card className="p-5 border-0 shadow-week-details">
      <div className="flex flex-row md:flex-col w-full items-center md:items-start gap-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary-light">
          {icon}
        </div>
        <div>
          <p className="text-sm! md:text-base! font-normal!  text-primary-dark!">
            {label}
          </p>
          <p className=" text-[30px]! font-bold! text-primary-dark!">{value}</p>
          <span
            className={`text-base! font-normal! ${color === "default" ? "text-[#3D3177]" : color === "success" ? "text-[#00A63E]" : "text-error"}`}
          >
            {changes}
          </span>
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
        <span className="text-base! font-normal! text-primary-dark!">
          {label}
        </span>
        <span className="text-base! font-semibold! text-[#0A0A0A]!">
          {pct}%
        </span>
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
