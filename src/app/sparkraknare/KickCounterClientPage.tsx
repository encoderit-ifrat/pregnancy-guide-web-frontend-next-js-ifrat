"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Footprints } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  useQueryActiveKickSession,
  kickKeys,
} from "./_api/queries/useQueryKickCounter";
import { useStartKickSession } from "./_api/mutations/useKickMutations";
import KickLanding from "./_component/KickLanding";
import KickSession from "./_component/KickSession";
import KickStatistics from "./_component/KickStatistics";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

type View = "auto" | "stats" | "";

export default function KickCounterClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [view, setView] = useState<View>("");
  const [started, setStarted] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("kickStarted") === "true"
      : false
  );

  const {
    data: active,
    isLoading,
    isFetching,
  } = useQueryActiveKickSession(started);
  const start = useStartKickSession();
  const qc = useQueryClient();

  const handleStart = () => {
    localStorage.setItem("kickStarted", "true");
    setStarted(true);
    setView("auto");
    start.mutate(undefined, {
      onError: (e: unknown) => {
        localStorage.removeItem("kickStarted");
        setStarted(false);
        const msg =
          (e as { message?: string })?.message ?? t("kickCounter.startError");
        toast.error(msg);
      },
    });
  };

  const handleStop = () => {
    localStorage.removeItem("kickStarted");
    setStarted(false);
    qc.removeQueries({ queryKey: kickKeys.active });
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        {view != "stats" && (
          <div className="thread-header mb-8 flex flex-col items-center text-center">
            <IconHeading
              text={active ? t("kickCounter.badge01") : t("kickCounter.badge")}
              image={
                active
                  ? "/images/icons/kick-02.png"
                  : "/images/icons/kick-01.png"
              }
              className="text-primary justify-center"
            />
            <SectionHeading className="my-2 mb-6">
              {active ? t("kickCounter.title01") : t("kickCounter.title")}
            </SectionHeading>

            <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
              {active ? t("kickCounter.subtitle01") : t("kickCounter.subtitle")}
            </p>
          </div>
        )}

        {userLoading || isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <p className="text-primary-dark">{t("kickCounter.loginPrompt")}</p>
            <Button asChild className="mt-4">
              <Link href="/logga-in">{t("kickCounter.login")}</Link>
            </Button>
          </Card>
        ) : view === "stats" ? (
          <KickStatistics
            onBack={() => setView("auto")}
            onStart={handleStart}
          />
        ) : active ? (
          <KickSession
            session={active}
            onStop={handleStop}
            onViewStats={() => setView("stats")}
          />
        ) : start.isPending || isFetching ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <KickLanding
            onStart={handleStart}
            starting={start.isPending}
            onViewStats={() => setView("stats")}
          />
        )}
      </div>
    </PageContainer>
  );
}
