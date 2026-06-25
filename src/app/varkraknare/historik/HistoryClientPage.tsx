"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import ContractionHistory from "../_component/ContractionHistory";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

export default function HistoryClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        {userLoading ? (
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
        ) : (
          <ContractionHistory
            onViewStats={() => router.push("/varkraknare/statistik")}
          />
        )}
      </div>
    </PageContainer>
  );
}
