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
import { useQueryActiveContractionSession } from "./_api/queries/useQueryContraction";
import { useStartContractionSession } from "./_api/mutations/useContractionMutations";
import ContractionCounter from "./_component/ContractionCounter";
import ContractionStatistics from "./_component/ContractionStatistics";
import ContractionHistory from "./_component/ContractionHistory";

type View = "auto" | "stats" | "history";

export default function ContractionClientPage() {
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [view, setView] = useState<View>("auto");

  const { data: active, isLoading } = useQueryActiveContractionSession();
  const start = useStartContractionSession();

  const handleStart = () => {
    setView("auto");
    start.mutate(undefined, {
      onError: (e: unknown) =>
        toast.error((e as { message?: string })?.message ?? "Could not start"),
    });
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Timer className="size-4" /> Contraction Counter
          </span>
          <h1 className="mt-2 text-3xl font-bold text-primary-dark">
            Time Your Contractions
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            Track the duration and frequency of your contractions and know when
            it&apos;s time to head to the hospital.
          </p>
        </div>

        {userLoading || isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <p className="text-primary-dark">
              Please log in to use the Contraction Counter.
            </p>
            <Button asChild className="mt-4">
              <Link href="/logga-in">Log in</Link>
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
              Ready to track contractions?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              Start a new session when your contractions begin. We&apos;ll time
              each one and track the intervals for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={handleStart} disabled={start.isPending} size="lg">
                {start.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Play className="size-5" />
                )}
                Start Session
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setView("history")}
              >
                View History
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
