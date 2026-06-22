"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Loader2, Play, Timer } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryActiveContractionSession } from "./_api/queries/useQueryContraction";
import { useStartContractionSession } from "./_api/mutations/useContractionMutations";
import ContractionCounter from "./_component/ContractionCounter";
import ContractionStatistics from "./_component/ContractionStatistics";
import ContractionHistory from "./_component/ContractionHistory";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

type View = "auto" | "stats" | "history";

export default function ContractionClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [view, setView] = useState<View>("auto");

  const { data: active, isLoading } = useQueryActiveContractionSession();
  const start = useStartContractionSession();

  const handleStart = () => {
    setView("auto");
    start.mutate(undefined, {
      onError: (e: unknown) =>
        toast.error(
          (e as { message?: string })?.message ??
            t("contractionCounter.startError")
        ),
    });
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="thread-header mb-8 flex flex-col items-center text-center">
          <IconHeading
            text={t("contractionCounter.badge")}
            image="/images/icons/track-01.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("contractionCounter.title")}
          </SectionHeading>

          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("contractionCounter.subtitle")}
          </p>
        </div>

        {userLoading || isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <p className="text-primary-dark">
              {t("contractionCounter.loginPrompt")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/logga-in">{t("contractionCounter.login")}</Link>
            </Button>
          </Card>
        ) : view === "stats" ? (
          <ContractionStatistics onBack={() => setView("auto")} />
        ) : view === "history" ? (
          <ContractionHistory
            onBack={() => setView("auto")}
            onViewStats={() => setView("stats")}
          />
        ) : active ? (
          <ContractionCounter
            session={active}
            onViewStats={() => setView("stats")}
            onViewHistory={() => setView("history")}
          />
        ) : (
          <Card className="mx-auto max-w-xl p-10 text-center">
            <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-primary-light">
              <Timer className="size-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("contractionCounter.readyTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              {t("contractionCounter.readyDesc")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={handleStart}
                disabled={start.isPending}
                size="lg"
              >
                {start.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Play className="size-5" />
                )}
                <span>{t("contractionCounter.startSession")}</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setView("history")}
              >
                {t("contractionCounter.viewHistory")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
