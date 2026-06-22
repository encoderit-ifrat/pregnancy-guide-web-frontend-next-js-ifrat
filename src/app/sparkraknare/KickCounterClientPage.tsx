"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Footprints } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useQueryActiveKickSession } from "./_api/queries/useQueryKickCounter";
import { useStartKickSession } from "./_api/mutations/useKickMutations";
import KickLanding from "./_component/KickLanding";
import KickSession from "./_component/KickSession";
import KickStatistics from "./_component/KickStatistics";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

type View = "auto" | "stats";

export default function KickCounterClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [view, setView] = useState<View>("auto");

  const { data: active, isLoading } = useQueryActiveKickSession();
  const start = useStartKickSession();

  const handleStart = () => {
    setView("auto");
    start.mutate(undefined, {
      onError: (e: unknown) => {
        const msg =
          (e as { message?: string })?.message ?? t("kickCounter.startError");
        toast.error(msg);
      },
    });
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="thread-header mb-8 flex flex-col items-center text-center">
          <IconHeading
            text={t("kickCounter.badge")}
            image="/images/icons/kick-01.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("kickCounter.title")}
          </SectionHeading>

          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("kickCounter.subtitle")}
          </p>
        </div>

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
          <KickSession session={active} onViewStats={() => setView("stats")} />
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
