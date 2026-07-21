"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  useQueryActiveKickSession,
  useQueryKickStatistics,
} from "./_api/queries/useQueryKickCounter";
import {
  useAddKick,
  useStartKickSession,
} from "./_api/mutations/useKickMutations";
import { KickType } from "./_types/kick_types";
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showKickSession, setShowKickSession] = useState(false);

  const {
    data: session,
    isLoading,
    isFetching,
  } = useQueryActiveKickSession(!!sessionId);
  const { data: stats, isFetching: statsIsFetching } = useQueryKickStatistics(
    "week",
    1
  );
  const start = useStartKickSession();
  const addKick = useAddKick();

  const handleFirstKick = (type: KickType) => {
    start.mutate(undefined, {
      onSuccess: (newSession) => {
        setSessionId(newSession._id);
        addKick.mutate(
          { sessionId: newSession._id, type },
          { onError: () => toast.error(t("kickCounter.startError")) }
        );
      },
      onError: (e: unknown) => {
        const msg =
          (e as { message?: string })?.message ?? t("kickCounter.startError");
        toast.error(msg);
      },
    });
  };

  const handleStop = () => {
    setSessionId(null);
    setShowKickSession(false);
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        {view != "stats" && (
          <div className="thread-header mb-8 flex flex-col items-center text-center">
            <IconHeading
              text={
                showKickSession || session
                  ? t("kickCounter.badge01")
                  : t("kickCounter.badge")
              }
              image={
                showKickSession || session
                  ? "/images/icons/kick-02.png"
                  : "/images/icons/kick-01.png"
              }
              className="text-primary justify-center"
            />
            <SectionHeading className="my-2 mb-6">
              {showKickSession || session
                ? t("kickCounter.title01")
                : t("kickCounter.title")}
            </SectionHeading>

            <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
              {showKickSession || session
                ? t("kickCounter.subtitle01")
                : t("kickCounter.subtitle")}
            </p>
          </div>
        )}

        {userLoading || (isLoading && !showKickSession) ? (
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
            onBack={() => setView("")}
            onStart={() => {
              setShowKickSession(true);
              setView("");
            }}
          />
        ) : showKickSession ||
          session ||
          (stats?.session_history?.length ?? 0) > 0 ? (
          <KickSession
            session={session ?? null}
            onStop={handleStop}
            onViewStats={() => setView("stats")}
            onFirstKick={handleFirstKick}
            isStarting={start.isPending || isFetching}
          />
        ) : start.isPending || isFetching ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <KickLanding
            onStart={() => setShowKickSession(true)}
            starting={false}
            onViewStats={() => setView("stats")}
          />
        )}
      </div>
    </PageContainer>
  );
}
