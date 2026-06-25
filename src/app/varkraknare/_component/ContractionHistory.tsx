"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Droplet, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryContractionSessions } from "../_api/queries/useQueryContraction";
import { useDeleteContractionSession } from "../_api/mutations/useContractionMutations";
import Link from "next/link";
import { fmtDuration, fmtFullDuration } from "../_lib/format";

export default function ContractionHistory({
  onViewStats,
}: {
  onViewStats: () => void;
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQueryContractionSessions(page);
  const del = useDeleteContractionSession();

  const sessions = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <Link href={"/varkraknare"} className="flex items-center gap-2 my-[35px]">
        <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
        <p className="text-base font-normal">
          {t("contractionCounter.history.back")}
        </p>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 bg-white rounded-2xl border border-[#F3E8FF] px-[9px] py-[25px]">
          <div>
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("contractionCounter.history.title")}
            </h2>
            <p className="text-sm text-text-secondary">
              {t("contractionCounter.history.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-10 text-center text-sm text-text-secondary">
              {t("contractionCounter.history.noSessions")}
            </Card>
          ) : (
            sessions.map((s) => (
              <Card
                key={s._id}
                className="p-2 md:p-5 border border-[#F3E8FF] shadow-none bg-white rounded-2xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary-light">
                      <Timer className="size-4 text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-primary-dark">
                        {t("contractionCounter.history.contractionsCount", {
                          count: s.total_count,
                        })}
                        <span className="bg-primary-light2 text-xs! px-2 py-0.5 rounded-full !text-primary ml-1">
                          {fmtFullDuration(
                            s.ended_at
                              ? Math.floor(
                                  (new Date(s.ended_at).getTime() -
                                    new Date(s.started_at).getTime()) /
                                    1000
                                )
                              : 0
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(s.started_at).toLocaleString("sv-SE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      del.mutate(s._id, {
                        onSuccess: () =>
                          toast.success(
                            t("contractionCounter.history.sessionDeleted")
                          ),
                      })
                    }
                    className="text-text-secondary hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 pt-4 text-center">
                  <Mini
                    label={t("contractionCounter.history.avgDuration")}
                    value={fmtDuration(s.avg_duration_sec)}
                  />
                  <Mini
                    label={t("contractionCounter.history.avgInterval")}
                    value={fmtDuration(s.avg_interval_sec)}
                  />
                  <Mini
                    label={t("contractionCounter.history.totalCount")}
                    value={String(s.total_count)}
                  />
                </div>
              </Card>
            ))
          )}

          {(data?.pagination.last_page ?? 1) > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t("contractionCounter.history.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= (data?.pagination.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("contractionCounter.history.next")}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-primary-dark">
              {t("contractionCounter.history.summary")}
            </h3>
            <div className="space-y-3 text-sm">
              <Row
                label={t("contractionCounter.history.totalSessions")}
                value={total}
              />
              <Row
                label={t("contractionCounter.history.totalContractions")}
                value={sessions.reduce((a, s) => a + s.total_count, 0)}
              />
            </div>
            <Button
              onClick={onViewStats}
              className="mt-5 w-full justify-center"
            >
              {t("contractionCounter.history.viewFullStats")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-[10px] border border-[#F3E8FF] shadow-week-details px-2.5 py-2">
      <p className="text-sm! font-normal! text-primary-dark!">{label}</p>
      <p className="text-xl! font-semibold! text-primary-dark!">{value}</p>
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
