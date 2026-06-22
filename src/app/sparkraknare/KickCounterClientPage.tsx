"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Footprints } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useQueryActiveKickSession } from "./_api/queries/useQueryKickCounter";
import { useStartKickSession } from "./_api/mutations/useKickMutations";
import KickLanding from "./_component/KickLanding";
import KickSession from "./_component/KickSession";
import KickStatistics from "./_component/KickStatistics";

type View = "auto" | "stats";

export default function KickCounterClientPage() {
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [view, setView] = useState<View>("auto");

  const { data: active, isLoading } = useQueryActiveKickSession();
  const start = useStartKickSession();

  const handleStart = () => {
    setView("auto");
    start.mutate(undefined, {
      onError: (e: unknown) => {
        const msg =
          (e as { message?: string })?.message ?? "Could not start session";
        toast.error(msg);
      },
    });
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Footprints className="size-4" /> Kick Counter
          </span>
          <h1 className="mt-2 text-3xl font-bold text-primary-dark">
            Track Your Baby&apos;s Movements
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            Monitor your baby&apos;s kicks and movements throughout your
            pregnancy. Keep track of patterns and stay connected with your
            little one.
          </p>
        </div>

        {userLoading || isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <p className="text-primary-dark">
              Please log in to use the Kick Counter.
            </p>
            <Button asChild className="mt-4">
              <Link href="/logga-in">Log in</Link>
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
