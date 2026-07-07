"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import KickHistory from "../_component/KickHistory";

export default function HistoryClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  return (
    <PageContainer childClassName="px-2 md:px-4">
      <div className="mx-auto max-w-6xl">
        {userLoading ? (
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
        ) : (
          <KickHistory
            onViewStats={() => router.push("/sparkraknare")}
            onViewSession={() => router.push("/sparkraknare")}
          />
        )}
      </div>
    </PageContainer>
  );
}
