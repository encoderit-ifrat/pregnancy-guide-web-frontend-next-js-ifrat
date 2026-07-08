"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  Footprints,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useQueryKickSessions,
  useQueryKickTodaySummary,
} from "../_api/queries/useQueryKickCounter";
import Link from "next/link";
import { fmtDuration, fmtFullDuration } from "@/app/varkraknare/_lib/format";
import { formatDate } from "date-fns";
import Pagination from "@/components/base/Pagination";
import { useQueryContractionSettings } from "@/app/varkraknare/_api/queries/useQueryContraction";
import { useDeleteKickSession } from "../_api/mutations/useKickMutations";

export default function KickHistory({
  onViewStats,
  onViewSession,
}: {
  onViewStats: () => void;
  onViewSession: () => void;
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useQueryKickSessions(page);
  const del = useDeleteKickSession();
  const { data: todaySummary } = useQueryKickTodaySummary();
  const { data: settings } = useQueryContractionSettings();

  const sessions = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="space-y-6">
      <Link
        href={"/sparkraknare"}
        className="flex items-center gap-2 my-[35px]"
      >
        <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
        <p className="text-base font-normal">{t("kickCounter.history.back")}</p>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 bg-white rounded-2xl border border-[#F3E8FF] px-[9px] md:px-[35px] py-[25px]">
          <div>
            <h2 className="text-[25px]! md:text-[30px]! font-semibold text-primary-dark!">
              {t("kickCounter.history.title")}
            </h2>
            <p className="text-base! font-normal! text-primary-dark!">
              {t("kickCounter.history.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-10 text-center text-sm text-text-secondary">
              {t("kickCounter.history.noSessions")}
            </Card>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={sessions.map((s) => s._id)}
            >
              {sessions.map((s) => (
                <AccordionItem
                  key={s._id}
                  value={s._id}
                  className="border-0 mb-4"
                >
                  <Card className="p-2 md:p-5 border border-[#F3E8FF] shadow-none bg-white rounded-2xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start md:items-center gap-1 md:gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary-light">
                          <Footprints className="size-4 text-primary" />
                        </span>
                        <div>
                          <p className="text-sm! md:text-[20px]! font-semibold! text-primary-dark! flex items-center gap-1">
                            <span className="w-[140px] md:w-auto truncate">
                              {t("kickCounter.history.kicksCount", {
                                count: s.total_kicks,
                              })}
                            </span>
                            <span className="bg-primary-light2 text-xs! px-2 py-0.5 rounded-full !text-primary ml-1 whitespace-nowrap">
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
                          <div className="flex flex-col md:flex-row gap-1 md:gap-2.5">
                            <p className="text-base! font-normal! flex gap-1 items-center text-primary-dark!">
                              <Calendar className="size-3" />
                              {formatDate(s.started_at, "PP")}
                            </p>
                            <p className="text-base! font-normal! flex gap-1 items-center text-primary-dark!">
                              <Clock className="size-3 shrink-0" />
                              {formatDate(s.started_at, "HH:mm")}-
                              {s.ended_at
                                ? formatDate(s.ended_at, "HH:mm")
                                : "..."}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-around gap-1 md:gap-2">
                        <button
                          onClick={() => setDeleteId(s._id)}
                          className="text-destructive cursor-pointer p-1 md:p-2 rounded-[5px] border border-[#f3e8ff] flex items-center justify-center"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <AccordionTrigger className="text-primary bg-primary-light2 rounded-full p-1.5 border border-[#f3e8ff] flex items-center justify-center flex-none gap-0 hover:no-underline w-auto">
                          <ChevronDown className="size-4" />
                        </AccordionTrigger>
                      </div>
                    </div>
                    <AccordionContent className="py-5 px-1 text-base! font-normal! [&>div]:pt-0">
                      <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                        <Mini
                          label={t("kickCounter.history.totalKicks")}
                          value={String(s.total_kicks)}
                        />
                        <Mini
                          label={t("kickCounter.history.type")}
                          value={
                            s.type_label === "soft"
                              ? t("kickCounter.stats.soft")
                              : s.type_label === "hard"
                                ? t("kickCounter.stats.hard")
                                : s.type_label === "mixed"
                                  ? t("kickCounter.stats.mixed")
                                  : t("kickCounter.stats.unknown")
                          }
                        />
                        <Mini
                          label={t("kickCounter.history.sessionDuration")}
                          value={fmtDuration(
                            s.ended_at
                              ? Math.floor(
                                  (new Date(s.ended_at).getTime() -
                                    new Date(s.started_at).getTime()) /
                                    1000
                                )
                              : 0
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {(data?.pagination.last_page ?? 1) > 1 && (
            <Pagination
              currentPage={data?.pagination.current_page}
              totalPages={data?.pagination.last_page}
              onPageChange={setPage}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card className="md:p-6 px-2 py-[25px]  border border-[#F3E8FF] shadow-none bg-white rounded-[10px]">
            <h3 className="mb-4 text-[25px]! font-semibold! text-primary-dark!">
              {t("kickCounter.history.summary")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-[13px]">
              <Row
                label={t("kickCounter.history.totalSessions")}
                value={todaySummary?.sessions ?? total}
              />
              <Row
                label={t("kickCounter.history.totalKicksToday")}
                value={todaySummary?.total_kicks ?? "—"}
              />
            </div>
            <Button
              onClick={onViewSession}
              className="mt-5 w-full justify-center"
            >
              <Footprints className="size-4 mr-2" />{" "}
              {t("kickCounter.history.newSession")}
            </Button>
            <Button
              onClick={onViewStats}
              variant="outline"
              className="mt-5 w-full justify-center"
            >
              {t("kickCounter.history.viewFullStats")}
            </Button>
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
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-white border border-[#E8E4F8] rounded-[15px] p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("kickCounter.history.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("kickCounter.history.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("kickCounter.history.deleteCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) {
                  del.mutate(deleteId, {
                    onSuccess: () => {
                      toast.success(
                        t("kickCounter.history.sessionDeleted")
                      );
                      setDeleteId(null);
                    },
                  });
                }
              }}
            >
              {del.isPending ? (
                <Spinner />
              ) : (
                t("kickCounter.history.deleteConfirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-[10px] border border-[#F3E8FF] shadow-week-details px-2.5 py-2">
      <p className="text-sm! md:text-base! font-normal! text-primary-dark!">
        {label}
      </p>
      <p className="text-xl! font-semibold! text-primary-dark!">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="py-[18px] px-[25px] md:p-0 border-0 shadow-week-details md:shadow-none bg-white rounded-[10px] flex flex-col md:flex-row items-center justify-center md:justify-between">
      <span className="text-primary-dark! font-normal! text-lg! md:text-base! text-center! md:max-w-[220px] md:truncate hyphens-auto">
        {label}
      </span>
      <span className="text-lg! font-semibold! text-primary-dark! ">
        {value}
      </span>
    </Card>
  );
}
